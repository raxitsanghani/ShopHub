# OTP Setup Guide for ShopHub

## Overview
The password reset system now uses phone number-based OTP instead of email. This provides better security and reliability.

## Features
- Phone number-based OTP generation
- SMS delivery via Twilio (optional)
- 5-minute OTP expiration
- Secure password reset flow
- Fallback to console logging when Twilio not configured

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the root directory with the following variables:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/shopHub

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-here

# Twilio Configuration (Optional - for SMS OTP)
# Get these from https://console.twilio.com/
TWILIO_ACCOUNT_SID=your_twilio_account_sid_here
TWILIO_AUTH_TOKEN=your_twilio_auth_token_here
TWILIO_PHONE_NUMBER=your_twilio_phone_number_here

# Server Port
PORT=3000
```

### 3. Twilio Setup (Optional)
1. Sign up for a Twilio account at https://console.twilio.com/
2. Get your Account SID and Auth Token from the console
3. Get a Twilio phone number for sending SMS
4. Add these credentials to your `.env` file

### 4. Start the Server
```bash
npm start
```

## How It Works

### Without Twilio (Development)
- OTPs are generated and logged to the console
- Perfect for development and testing
- No external dependencies

### With Twilio (Production)
- OTPs are sent via SMS to the user's phone
- Professional SMS delivery
- Real-time notifications

## API Endpoints

### Request OTP
```
POST /api/request-otp
Body: { "phone": "+1234567890" }
```

### Verify OTP
```
POST /api/verify-otp
Body: { "phone": "+1234567890", "otp": "123456" }
```

### Reset Password
```
POST /api/reset-password
Body: { "resetToken": "jwt_token", "newPassword": "new_password" }
```

## Security Features
- OTPs expire after 5 minutes
- One-time use OTPs
- JWT-based reset tokens
- Secure password hashing
- Phone number validation

## Testing
1. Start the server
2. Navigate to the profile page
3. Click "Change Password"
4. Click "Forgot your current password?"
5. Enter a phone number
6. Check console for OTP (if Twilio not configured)
7. Enter OTP and reset password

## Troubleshooting

### OTP Not Received
- Check console logs for OTP (development mode)
- Verify Twilio credentials (production mode)
- Ensure phone number format is correct

### Database Issues
- Ensure MongoDB is running
- Check connection string in `.env`
- Verify database permissions

### Twilio Errors
- Verify Account SID and Auth Token
- Check if Twilio phone number is active
- Ensure sufficient Twilio credits
