import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
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
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));

// Request logger
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    if (req.method === 'POST') {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }
    next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply general rate limiting to all API routes
app.use('/api', apiRateLimiter);

// Routes
app.use('/api/auth', authRoutes);

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
        version: '1.0.0',
        endpoints: {
            health: '/health',
            requestOTP: 'POST /api/auth/request-otp',
            verifyOTP: 'POST /api/auth/verify-otp',
            logout: 'POST /api/auth/logout'
        }
    });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server Error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
const startServer = async () => {
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 Starting NCO Search Backend Server...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    // 1. Connect to MongoDB FIRST
    await connectDB();

    // 2. Start listening SECOND
    app.listen(PORT, async () => {
        const twilioConfigured = isTwilioConfigured();

        console.log(`📡 Server running on: http://localhost:${PORT}`);
        console.log(`🌐 Frontend URL: ${FRONTEND_URL}`);
        console.log(`🔐 Environment: ${process.env.NODE_ENV || 'development'}`);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('Available endpoints:');
        console.log('  GET  /health');
        console.log('  POST /api/auth/request-otp');
        console.log('  POST /api/auth/verify-otp');
        console.log('  POST /api/auth/logout');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

        // Check Twilio configuration
        if (!twilioConfigured) {
            console.log('');
            console.warn('⚠️  WARNING: Twilio NOT Configured!');
            console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.warn('📝 To enable OTP functionality:');
            console.warn('   1. Copy .env.example to .env');
            console.warn('   2. Sign up at https://www.twilio.com/try-twilio');
            console.warn('   3. Add your credentials to .env file');
            console.warn('   4. Restart this server');
            console.warn('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
            console.log('');
        } else {
            console.log('✅ Twilio is configured and ready!');
        }

        // Check database connection status
        if (isDBConnected()) {
            console.log('✅ MongoDB is connected and ready!');
        } else {
            console.warn('⚠️  MongoDB not connected - using fallback mode');
            console.warn('   Only test numbers 9876543210 and 8248805628 will work');
        }
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    });
};

startServer();

export default app;
