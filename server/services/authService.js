import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret-change-in-production';
const JWT_EXPIRY = '24h';

/**
 * Generate JWT token for authenticated user
 * @param {Object} user - User object
 * @returns {string} - JWT token
 */
export function generateToken(user) {
    const payload = {
        phone: user.phone,
        role: user.role,
        name: user.name
    };

    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRY
    });

    console.log(`🔑 JWT token generated for ${user.name}`);
    return token;
}

/**
 * Verify and decode JWT token
 * @param {string} token - JWT token
 * @returns {Object|null} - Decoded payload or null if invalid
 */
export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        console.error('❌ Invalid token:', error.message);
        return null;
    }
}

/**
 * Middleware to protect routes with JWT authentication
 */
export function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = verifyToken(token);

    if (!decoded) {
        return res.status(403).json({ error: 'Invalid or expired token' });
    }

    req.user = decoded;
    next();
}
