import express from 'express';
import { sendOTP, isValidPhoneNumber } from '../config/twilio.js';
import { generateOTP, storeOTP, verifyOTP } from '../services/otpService.js';
import { findUserByPhone, updateLastLogin } from '../services/userService.js';
import { generateToken } from '../services/authService.js';
import { otpRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

/**
 * POST /api/auth/request-otp
 * Request OTP for phone number (only for registered users)
 */
router.post('/request-otp', otpRateLimiter, async (req, res) => {
    try {
        const { phone } = req.body;

        // Validate phone number
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        if (!isValidPhoneNumber(phone)) {
            return res.status(400).json({
                error: 'Invalid phone number. Please enter a valid 10-digit Indian mobile number.'
            });
        }

        // Check if user exists in database (no auto-creation)
        const user = await findUserByPhone(phone);

        if (!user) {
            console.log(`❌ Account not found for phone: ${phone}`);
            return res.status(404).json({
                error: 'Account not found. Please contact your administrator to register this phone number.'
            });
        }

        // Check if account is active
        if (user.isActive === false) {
            return res.status(403).json({
                error: 'Account is inactive. Please contact your administrator.'
            });
        }

        console.log(`✅ User found: ${user.name} (${phone})`);

        // Generate OTP
        const otp = generateOTP();

        // Store OTP
        await storeOTP(phone, otp);

        // Send OTP via Twilio
        await sendOTP(phone, otp);

        console.log(`📱 OTP Request: ${phone} -> ${otp}`); // Log for development

        return res.status(200).json({
            success: true,
            message: `OTP sent successfully to ${phone}`
        });

    } catch (error) {
        console.error('❌ Error in request-otp:', error.stack || error.message);

        // Ensure we send a response instead of letting the connection hang or crash
        const statusCode = error.name === 'Error' ? 400 : (error.status || 500);

        return res.status(statusCode).json({
            success: false,
            error: error.message || 'Failed to send OTP. Please check your Twilio configuration.'
        });
    }
});

/**
 * POST /api/auth/verify-otp
 * Verify OTP and authenticate user
 */
router.post('/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;

        // Validate input
        if (!phone || !otp) {
            return res.status(400).json({ error: 'Phone number and OTP are required' });
        }

        // Verify OTP
        const verification = await verifyOTP(phone, otp);

        if (!verification.valid) {
            return res.status(400).json({ error: verification.message });
        }

        // Find user (should exist since OTP was sent)
        const user = await findUserByPhone(phone);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Update last login time
        await updateLastLogin(phone);

        // Generate JWT token
        const token = generateToken(user);

        // Return user data with token
        res.json({
            success: true,
            user: {
                phone: user.phone,
                role: user.role,
                name: user.name,
                token
            }
        });

    } catch (error) {
        console.error('Error in verify-otp:', error);
        res.status(500).json({
            error: 'Verification failed. Please try again.'
        });
    }
});

/**
 * POST /api/auth/logout
 * Logout user (optional - mainly handled on frontend)
 */
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

export default router;
