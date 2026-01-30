import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for OTP requests
 * Limits to 3 requests per 15 minutes per IP
 */
export const otpRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
    message: {
        error: 'Too many OTP requests from this IP. Please try again after 15 minutes.'
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Use phone number as key instead of IP for better tracking
    keyGenerator: (req) => {
        return req.body.phone || req.ip;
    }
});

/**
 * General API rate limiter
 * Limits to 100 requests per 15 minutes per IP
 */
export const apiRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: {
        error: 'Too many requests from this IP. Please try again later.'
    }
});
