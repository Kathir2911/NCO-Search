# NCO Search Backend Setup Guide

## 📋 Prerequisites

1. **Node.js** (v18 or higher)
2. **Twilio Account** with:
   - Account SID
   - Auth Token  
   - Twilio Phone Number

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your Twilio credentials:

```env
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your_auth_token_here
TWILIO_PHONE_NUMBER=+1234567890

JWT_SECRET=generate_a_random_secret_key_here
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

#### 🔑 Getting Twilio Credentials

1. Sign up at [twilio.com](https://www.twilio.com/try-twilio)
2. Get a free trial phone number
3. Find your **Account SID** and **Auth Token** in the [Twilio Console](https://console.twilio.com/)
4. Copy **Phone Number** from Phone Numbers section

### 3. Start the Backend Server

```bash
npm run dev
```

You should see:

```
🚀 NCO Search Backend Server Started
📡 Server running on: http://localhost:3001
```

### 4. Test the API

#### Health Check

```bash
curl http://localhost:3001/health
```

#### Request OTP

```bash
curl -X POST http://localhost:3001/api/auth/request-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\"}"
```

Replace `9876543210` with your actual phone number (10-digit Indian mobile number).

#### Verify OTP

After receiving the SMS, verify it:

```bash
curl -X POST http://localhost:3001/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d "{\"phone\":\"9876543210\",\"otp\":\"123456\"}"
```

## 🔧 Running Both Frontend and Backend

### Terminal 1 - Backend

```bash
cd server
npm run dev
```

### Terminal 2 - Frontend

```bash
npm run dev
```

Now visit http://localhost:5173 and test the enumerator login flow!

## 📱 Testing the Complete Login Flow

1. Navigate to: http://localhost:5173/login?role=enumerator
2. Enter your phone number
3. Click "Request OTP"
4. Check your phone for SMS (check spam if not received)
5. Enter the 6-digit OTP
6. Click "Verify & Continue"
7. You should be redirected to `/enumerator` page

## 🔐 Security Features

- **Rate Limiting**: Max 3 OTP requests per 15 minutes per phone number
- **OTP Expiration**: OTPs expire after 5 minutes
- **Attempt Limiting**: Max 3 verification attempts per OTP
- **JWT Authentication**: Secure token-based authentication
- **CORS Protection**: Only allows requests from configured frontend URL

## 🐛 Troubleshooting

### OTP Not Received

1. **Check Twilio Credits**: Free trial accounts need to verify phone numbers
2. **Check Phone Number Format**: Must be 10-digit Indian mobile (starts with 6-9)
3. **Check Spam/Blocked Messages**: Sometimes arrives in spam folder
4. **Verify Twilio Configuration**: Check Account SID and Auth Token are correct

### Server Won't Start

1. **Check Port**: Make sure port 3001 is not already in use
2. **Check Dependencies**: Run `npm install` again
3. **Check Environment Variables**: Verify `.env` file exists and has correct values

### CORS Errors

1. Make sure backend is running on port 3001
2. Make sure frontend is running on port 5173
3. Check `FRONTEND_URL` in `.env` matches your frontend URL

### Rate Limit Errors

If you get "Too many OTP requests":
- Wait 15 minutes before trying again
- Or restart the server (clears in-memory rate limit)

## 📊 Project Structure

```
server/
├── config/
│   └── twilio.js           # Twilio client configuration
├── middleware/
│   └── rateLimiter.js      # Rate limiting middleware
├── routes/
│   └── auth.js             # Authentication endpoints
├── services/
│   ├── authService.js      # JWT token generation
│   ├── otpService.js       # OTP generation & verification
│   └── userService.js      # User management
├── .env.example            # Environment variables template
├── .gitignore              # Git ignore rules
├── package.json            # Dependencies
└── server.js               # Main Express app
```

## 🔄 Production Deployment

For production deployment, consider:

1. **Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **Redis**: Use Redis for OTP storage (better for distributed systems)
3. **Environment Variables**: Use secure secret management
4. **HTTPS**: Enable SSL/TLS encryption
5. **Logging**: Add proper logging service (Winston, Pino)
6. **Monitoring**: Setup monitoring (PM2, New Relic)

## 📝 API Documentation

### POST /api/auth/request-otp

Request OTP for phone number.

**Request Body:**
```json
{
  "phone": "9876543210"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP sent successfully to your phone number"
}
```

**Error Response (400/500):**
```json
{
  "error": "Invalid phone number. Please enter a valid 10-digit Indian mobile number."
}
```

---

### POST /api/auth/verify-otp

Verify OTP and get authentication token.

**Request Body:**
```json
{
  "phone": "9876543210",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "phone": "9876543210",
    "role": "ENUMERATOR",
    "name": "Enumerator 3210",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

**Error Response (400):**
```json
{
  "error": "Invalid OTP. Please try again."
}
```

## 💡 Tips

- **Development**: OTP is logged to console for testing
- **Testing**: Use test phone numbers in Twilio console during development
- **Credits**: Twilio free trial requires phone verification but provides credits
- **International**: To support other countries, update phone validation in `config/twilio.js`

## 🆘 Support

For issues or questions:
1. Check server logs for errors
2. Verify Twilio console for message delivery status
3. Test endpoints with curl/Postman first before testing with frontend
