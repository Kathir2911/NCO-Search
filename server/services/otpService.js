/**
 * OTP Service - Handles OTP generation, storage, and verification
 * Uses in-memory storage with automatic cleanup
 */

// In-memory OTP storage: { phone: { otp, expiresAt } }
const otpStore = new Map();

// OTP Configuration
const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;

/**
 * Generate a random 6-digit OTP
 * @returns {string} - 6-digit OTP code
 */
export function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Store OTP for a phone number with expiration
 * @param {string} phone - Phone number
 * @param {string} otp - OTP code
 */
export function storeOTP(phone, otp) {
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    otpStore.set(phone, {
        otp,
        expiresAt,
        attempts: 0
    });

    console.log(`📝 OTP stored for ${phone}, expires at ${expiresAt.toLocaleTimeString()}`);

    // Auto-cleanup after expiration
    setTimeout(() => {
        if (otpStore.has(phone)) {
            otpStore.delete(phone);
            console.log(`🗑️  Expired OTP removed for ${phone}`);
        }
    }, OTP_EXPIRY_MINUTES * 60 * 1000);
}

/**
 * Verify OTP for a phone number
 * @param {string} phone - Phone number
 * @param {string} otp - OTP code to verify
 * @returns {Object} - { valid: boolean, message: string }
 */
export function verifyOTP(phone, otp) {
    const stored = otpStore.get(phone);

    if (!stored) {
        return { valid: false, message: 'No OTP found. Please request a new one.' };
    }

    // Check if expired
    if (new Date() > stored.expiresAt) {
        otpStore.delete(phone);
        return { valid: false, message: 'OTP has expired. Please request a new one.' };
    }

    // Check attempts (max 3 attempts)
    if (stored.attempts >= 3) {
        otpStore.delete(phone);
        return { valid: false, message: 'Too many failed attempts. Please request a new OTP.' };
    }

    // Verify OTP
    if (stored.otp === otp) {
        otpStore.delete(phone); // Remove after successful verification
        console.log(`✅ OTP verified successfully for ${phone}`);
        return { valid: true, message: 'OTP verified successfully' };
    } else {
        stored.attempts++;
        console.log(`❌ Invalid OTP for ${phone}. Attempt ${stored.attempts}/3`);
        return { valid: false, message: 'Invalid OTP. Please try again.' };
    }
}

/**
 * Clear OTP for a phone number (useful for testing)
 * @param {string} phone
 */
export function clearOTP(phone) {
    otpStore.delete(phone);
}

/**
 * Get all active OTPs (for debugging only)
 */
export function getActiveOTPs() {
    return Array.from(otpStore.entries());
}
