import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nco-search';

/**
 * Connect to MongoDB
 */
export async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
    } catch (error) {
        console.error('❌ MongoDB connection error:', error.message);
        // Don't exit process, allow server to run without MongoDB for now
        console.warn('⚠️  Server will continue running, but user verification will be disabled.');
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
