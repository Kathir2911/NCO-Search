import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        index: true
    },
    otp: {
        type: String,
        required: true
    },
    expiresAt: {
        type: Date,
        required: true,
        index: { expires: '5m' } // Automatically delete the document after it expires
    },
    attempts: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

const OTP = mongoose.models.OTP || mongoose.model('OTP', otpSchema);

export default OTP;
