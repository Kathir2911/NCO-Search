import User from '../models/User.js';
import { isDBConnected } from '../config/database.js';

/**
 * Find user by phone number from MongoDB
 * @param {string} phone - Phone number
 * @returns {Promise<Object|null>} - User object or null
 */
export async function findUserByPhone(phone) {
    if (!isDBConnected()) {
        console.warn('⚠️  MongoDB not connected, falling back to mock user');
        // Fallback: Allow specific test numbers
        if (phone === '9876543210' || phone === '8248805628') {
            return {
                phone: phone,
                role: 'ENUMERATOR',
                name: phone === '8248805628' ? 'User (Verified)' : 'Test Enumerator',
                isActive: true
            };
        }
        return null;
    }

    try {
        const user = await User.findOne({ phone, isActive: true });
        return user;
    } catch (error) {
        console.error('Error finding user:', error);
        return null;
    }
}

/**
 * Create a new user in MongoDB
 * @param {Object} userData - User data
 * @returns {Promise<Object>} - Created user
 */
export async function createUser(userData) {
    if (!isDBConnected()) {
        console.warn('⚠️  MongoDB not connected, cannot create user');
        throw new Error('Database not available');
    }

    try {
        const user = new User(userData);
        await user.save();
        console.log(`👤 New user created: ${user.name} (${user.phone})`);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

/**
 * Update user's last login time
 * @param {string} phone - Phone number
 */
export async function updateLastLogin(phone) {
    if (!isDBConnected()) return;

    try {
        await User.findOneAndUpdate(
            { phone },
            { lastLogin: new Date() }
        );
    } catch (error) {
        console.error('Error updating last login:', error);
    }
}

/**
 * Get all users (for debugging/admin)
 */
export async function getAllUsers() {
    if (!isDBConnected()) {
        return [];
    }

    try {
        return await User.find({ isActive: true }).select('-__v');
    } catch (error) {
        console.error('Error fetching users:', error);
        return [];
    }
}
