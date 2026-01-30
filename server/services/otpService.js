import OTP from '../models/OTP.js';

// OTP Configuration
const OTP_EXPIRY_MINUTES = 5;

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
export async function storeOTP(phone, otp) {
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    // Update or create OTP record
    await OTP.findOneAndUpdate(
        { phone },
        {
            otp,
            expiresAt,
            attempts: 0
        },
        { upsert: true, new: true }
    );

    console.log(`📝 OTP stored in database for ${phone}, expires at ${expiresAt.toLocaleTimeString()}`);
}

/**
 * Verify OTP for a phone number
 * @param {string} phone - Phone number
 * @param {string} otp - OTP code to verify
 * @returns {Promise<Object>} - { valid: boolean, message: string }
 */
export async function verifyOTP(phone, otp) {
    try {
        const stored = await OTP.findOne({ phone });

        if (!stored) {
            return { valid: false, message: 'No OTP found. Please request a new one.' };
        }

        // Check if expired
        if (new Date() > stored.expiresAt) {
            await OTP.deleteOne({ phone });
            return { valid: false, message: 'OTP has expired. Please request a new one.' };
        }

        // Check attempts (max 3 attempts)
        if (stored.attempts >= 3) {
            await OTP.deleteOne({ phone });
            return { valid: false, message: 'Too many failed attempts. Please request a new OTP.' };
        }

        // Verify OTP
        if (stored.otp === otp) {
            await OTP.deleteOne({ phone }); // Remove after successful verification
            console.log(`✅ OTP verified successfully for ${phone}`);
            return { valid: true, message: 'OTP verified successfully' };
        } else {
            stored.attempts++;
            await stored.save();
            console.log(`❌ Invalid OTP for ${phone}. Attempt ${stored.attempts}/3`);

            if (stored.attempts >= 3) {
                await OTP.deleteOne({ phone });
                return { valid: false, message: 'Too many failed attempts. Please request a new OTP.' };
            }

            return { valid: false, message: 'Invalid OTP. Please try again.' };
        }
    } catch (error) {
        console.error('Error in verifyOTP:', error);
        return { valid: false, message: 'An error occurred during verification.' };
    }
}

/**
 * Clear OTP for a phone number (useful for testing)
 * @param {string} phone
 */
export async function clearOTP(phone) {
    await OTP.deleteOne({ phone });
}
