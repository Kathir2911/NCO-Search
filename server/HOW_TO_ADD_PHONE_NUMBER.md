# How to Add Your Phone Number to the Database

## Quick Guide

To enable OTP sending for your phone number, you need to add it to the database. Here are the steps:

### Option 1: Using seedDatabase.js (Recommended)

1. **Edit the seed file**:
   ```bash
   # Open server/seedDatabase.js in your editor
   ```

2. **Add your phone number** to the `testUsers` array:
   ```javascript
   const testUsers = [
       {
           phone: '8925341040',  // Existing number
           name: '8925341040 - Enumerator',
           role: 'ENUMERATOR',
           isActive: true
       },
       // Add your number here:
       {
           phone: 'YOUR_10_DIGIT_NUMBER',  // e.g., '9876543210'
           name: 'Your Name - Enumerator',
           role: 'ENUMERATOR',
           isActive: true
       }
   ];
   ```

3. **Run the seed script**:
   ```powershell
   cd server
   npm run seed
   ```

4. **Verify in the output**:
   ```
   ✅ Successfully seeded 4 users:
      - 8925341040 - Enumerator (8925341040) - ENUMERATOR
      - YOUR_NUMBER - Enumerator (YOUR_NUMBER) - ENUMERATOR
   ```

### Option 2: Add Directly via MongoDB Compass (GUI)

1. Open MongoDB Compass and connect to your database
2. Navigate to the `nco search` database → `users` collection
3. Click "ADD DATA" → "Insert Document"
4. Add the following JSON:
   ```json
   {
     "phone": "YOUR_10_DIGIT_NUMBER",
     "name": "Your Name - Enumerator",
     "role": "ENUMERATOR",
     "isActive": true,
     "createdAt": { "$date": "2026-01-30T05:00:00.000Z" }
   }
   ```

### Option 3: Use MongoDB Shell

```javascript
use nco-search;
db.users.insertOne({
    phone: "YOUR_10_DIGIT_NUMBER",
    name: "Your Name - Enumerator",
    role: "ENUMERATOR",
    isActive: true,
    createdAt: new Date()
});
```

## Twilio Trial Account Setup

If you're using a Twilio **trial account**, you must also verify your phone number:

1. Go to: https://console.twilio.com/us1/develop/phone-numbers/manage/verified
2. Click **"Add Verified Caller ID"**
3. Enter your phone number (same one you added to database)
4. Complete the verification process via SMS
5. Once verified, you can receive OTPs from your trial account

## Testing OTP Flow

After adding your phone number:

1. **Start the servers**:
   ```powershell
   # Terminal 1 - Backend
   cd server
   npm run dev
   
   # Terminal 2 - Frontend
   cd ..
   npm run dev
   ```

2. **Navigate to login**:
   - Open: http://localhost:5173/login?role=enumerator

3. **Enter your phone number** (the one you added)

4. **Check server logs** - You should see:
   ```
   ✅ User found: Your Name (YOUR_NUMBER)
   📱 Attempting to send OTP to: +91YOUR_NUMBER
   ✅ OTP sent to +91YOUR_NUMBER. Message SID: SMxxxxxxxxx
   📱 OTP Request: YOUR_NUMBER -> 123456
   ```

5. **Enter the OTP** sent to your phone

## Currently Registered Numbers

These phone numbers are currently in the database and can request OTP:
- `8925341040` - Enumerator
- `8248805628` - Enumerator  
- `8610873826` - Enumerator

## Troubleshooting

### "Account not found" Error
- **Cause**: Phone number not in database
- **Fix**: Add your number using one of the methods above

### "This phone number is not verified" Error (Twilio)
- **Cause**: Twilio trial account restriction
- **Fix**: Verify your number at https://console.twilio.com/us1/develop/phone-numbers/manage/verified

### OTP Not Received
- Check server logs for Twilio error messages
- Ensure phone number format is 10 digits (no +91, spaces, or dashes)
- Verify your Twilio credentials in `.env` file are correct
- Check Twilio console for any account issues
