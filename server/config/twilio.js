import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config();

// Get Twilio credentials from environment
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

// Check if credentials are configured
const areCredentialsConfigured = () => {
    return accountSid &&
        authToken &&
        twilioPhoneNumber &&
        accountSid.startsWith('AC') && // Valid Twilio Account SID format
        accountSid !== 'your_account_sid_here'; // Not placeholder
};

// Lazy initialization - only create client when needed
let client = null;

const getClient = () => {
    if (!areCredentialsConfigured()) {
        throw new Error(
            'Twilio credentials not configured. Please:\n' +
            '1. Copy .env.example to .env\n' +
            '2. Add your Twilio Account SID, Auth Token, and Phone Number\n' +
            '3. Restart the server'
        );
    }

    if (!client) {
        client = twilio(accountSid, authToken);
    }

    return client;
};

/**
 * Send OTP via SMS using Twilio
 * @param {string} phoneNumber - Recipient phone number (E.164 format recommended)
 * @param {string} otp - The OTP code to send
 * @returns {Promise<boolean>} - Success status
 */
export async function sendOTP(phoneNumber, otp) {
    try {
        const twilioClient = getClient(); // Get client only when needed

        // Format phone number to E.164 if needed (add +91 for India)
        const formattedPhone = phoneNumber.startsWith('+')
            ? phoneNumber
            : `+91${phoneNumber}`;

        console.log(`📱 Attempting to send OTP to: ${formattedPhone}`);

        const message = await twilioClient.messages.create({
            body: `Your NCO Search verification code is: ${otp}. Valid for 5 minutes. Do not share this code with anyone.`,
            from: twilioPhoneNumber,
            to: formattedPhone
        });

        console.log(`✅ OTP sent to ${formattedPhone}. Message SID: ${message.sid}`);
        return true;
    } catch (error) {
        console.error('❌ Twilio SMS Error Details:');
        console.error('   Error Code:', error.code);
        console.error('   Error Message:', error.message);
        console.error('   More Info:', error.moreInfo);
        console.error('   Full Error:', error);

        // Provide user-friendly error messages based on Twilio error codes
        if (error.code === 21211) {
            throw new Error('Invalid phone number format. Please check the number and try again.');
        } else if (error.code === 21608) {
            throw new Error('This phone number is not verified. In trial mode, you must verify your phone number in the Twilio console first.');
        } else if (error.code === 21606) {
            throw new Error('The "From" phone number is not a valid Twilio number. Please check your Twilio phone number configuration.');
        } else {
            throw new Error(`Failed to send OTP: ${error.message}`);
        }
    }
}

/**
 * Validate phone number format
 * @param {string} phone - Phone number to validate
 * @returns {boolean}
 */
export function isValidPhoneNumber(phone) {
    if (!phone) return false;

    // Remove any spaces, dashes, or parentheses
    const cleanPhone = phone.toString().replace(/[\s\-\(\)]/g, '');

    // Basic validation for Indian phone numbers (10 digits starting with 6-9)
    const phoneRegex = /^[6-9]\d{9}$/;
    const isValid = phoneRegex.test(cleanPhone);

    console.log(`📞 Phone validation: "${phone}" -> cleaned: "${cleanPhone}" -> valid: ${isValid}`);

    return isValid;
}

/**
 * Check if Twilio is configured
 * @returns {boolean}
 */
export function isTwilioConfigured() {
    return areCredentialsConfigured();
}

export default getClient;
