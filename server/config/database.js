import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI && (process.env.NODE_ENV === 'production' || process.env.VERCEL)) {
    console.error('❌ MONGODB_URI is missing in production environment!');
}

const DB_CONNECTION_STRING = MONGODB_URI || 'mongodb://localhost:27017/nco-search';

/**
 * Connect to MongoDB
 */
let cachedConnection = null;

/**
 * Connect to MongoDB
 */
export async function connectDB() {
    if (cachedConnection) {
        return cachedConnection;
    }

    try {
        console.log('📡 Connecting to MongoDB...');
        const conn = await mongoose.connect(DB_CONNECTION_STRING, {
            serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
        });

        cachedConnection = conn;
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        return conn;
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        // Don't exit process, allow server to run without MongoDB for now
        console.warn('⚠️  Server will continue running, but user verification will be disabled.');
        throw error;
    }
}

/**
 * Check if MongoDB is connected
 */
export function isDBConnected() {
    return mongoose.connection.readyState === 1;
}

/**
 * Close MongoDB connection
 */
export async function closeDB() {
    await mongoose.connection.close();
    console.log('MongoDB connection closed');
}

export default mongoose;
