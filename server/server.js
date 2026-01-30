import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/userRoutes.js';
import { apiRateLimiter } from './middleware/rateLimiter.js';
import { isTwilioConfigured } from './config/twilio.js';
import { connectDB, isDBConnected } from './config/database.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

// Middleware
const allowedOrigins = [
    process.env.FRONTEND_URL || 'http://localhost:5173',
    'http://localhost:5174'
];

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow any Vercel deployment URL
        if (origin.endsWith('.vercel.app') || allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }

        const msg = `CORS Error: Origin ${origin} not allowed.`;
        return callback(new Error(msg), false);
    },
    credentials: true
}));

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting to all API routes
app.use('/api', apiRateLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'NCO Search Backend Server is running',
        twilioConfigured: isTwilioConfigured(),
        databaseConnected: isDBConnected(),
        timestamp: new Date().toISOString()
    });
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'NCO Search Backend API',
        version: '1.0.0'
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message // Temporarily enabled for production debugging
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Connect to Database immediately
connectDB();

// Only call listen if we're not running as a Vercel function
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`📡 Server running on: http://localhost:${PORT}`);
        if (isTwilioConfigured()) {
            console.log('✅ Twilio is configured and ready!');
        } else {
            console.warn('⚠️  Twilio is NOT configured (Check your .env file)');
        }
    });
}

export default app;
