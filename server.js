const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const path = require('path');
const crypto = require('crypto');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/shopHub', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    age: {
        type: Number,
        required: true,
        min: 13,
        max: 120
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

// OTP Schema for storing OTPs temporarily
const otpSchema = new mongoose.Schema({
    phone: {
        type: String,
        required: true
    },
    otp: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // OTP expires after 5 minutes
    }
});

const OTP = mongoose.model('OTP', otpSchema);

// Initialize Twilio client (will be null if credentials not provided)
let twilioClient = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
    twilioClient = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
}

// Routes
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/dashboard', (req, res) => {
    res.sendFile(path.join(__dirname, 'dashboard.html'));
});

// Generate OTP
function generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
}

// Send OTP via SMS
async function sendOTP(phone, otp) {
    if (!twilioClient) {
        console.log('Twilio not configured, simulating SMS send');
        console.log(`OTP ${otp} would be sent to ${phone}`);
        return true;
    }

    try {
        await twilioClient.messages.create({
            body: `Your ShopHub password reset OTP is: ${otp}. Valid for 5 minutes.`,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: phone
        });
        return true;
    } catch (error) {
        console.error('Error sending SMS:', error);
        return false;
    }
}

// Request OTP for password reset
app.post('/api/request-otp', async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required' });
        }

        // Check if user exists
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ error: 'No user found with this phone number' });
        }

        // Generate OTP
        const otp = generateOTP();

        // Delete any existing OTP for this phone
        await OTP.deleteOne({ phone });

        // Save new OTP
        const otpDoc = new OTP({ phone, otp });
        await otpDoc.save();

        // Send OTP via SMS
        const smsSent = await sendOTP(phone, otp);

        if (smsSent) {
            res.json({ 
                message: 'OTP sent successfully to your phone number',
                phone: phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') // Mask phone number
            });
        } else {
            res.status(500).json({ error: 'Failed to send OTP. Please try again.' });
        }

    } catch (error) {
        console.error('OTP request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Verify OTP
app.post('/api/verify-otp', async (req, res) => {
    try {
        const { phone, otp } = req.body;

        if (!phone || !otp) {
            return res.status(400).json({ error: 'Phone number and OTP are required' });
        }

        // Find and verify OTP
        const otpDoc = await OTP.findOne({ phone, otp });
        if (!otpDoc) {
            return res.status(400).json({ error: 'Invalid OTP or OTP expired' });
        }

        // Delete the used OTP
        await OTP.deleteOne({ phone, otp });

        // Generate a temporary token for password reset
        const resetToken = jwt.sign(
            { phone, purpose: 'password_reset' },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '10m' }
        );

        res.json({ 
            message: 'OTP verified successfully',
            resetToken
        });

    } catch (error) {
        console.error('OTP verification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Reset password with OTP
app.post('/api/reset-password', async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        if (!resetToken || !newPassword) {
            return res.status(400).json({ error: 'Reset token and new password are required' });
        }

        // Verify reset token
        const decoded = jwt.verify(resetToken, process.env.JWT_SECRET || 'your-secret-key');
        if (decoded.purpose !== 'password_reset') {
            return res.status(400).json({ error: 'Invalid reset token' });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update user password
        const user = await User.findOneAndUpdate(
            { phone: decoded.phone },
            { password: hashedPassword },
            { new: true }
        );

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ message: 'Password reset successfully' });

    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(400).json({ error: 'Invalid or expired reset token' });
        }
        console.error('Password reset error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Registration
app.post('/api/register', async (req, res) => {
    try {
        const { phone, email, age, password } = req.body;

        // Check if user already exists
        const existingUserByEmail = await User.findOne({ email });
        const existingUserByPhone = await User.findOne({ phone });
        
        if (existingUserByEmail && existingUserByPhone) {
            return res.status(400).json({ 
                error: 'User with this email and phone number already exists' 
            });
        } else if (existingUserByEmail) {
            return res.status(400).json({ 
                error: 'User with this email already exists' 
            });
        } else if (existingUserByPhone) {
            return res.status(400).json({ 
                error: 'User with this phone number already exists' 
            });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const user = new User({
            phone,
            email,
            age,
            password: hashedPassword
        });

        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                phone: user.phone,
                age: user.age
            }
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// User Login
app.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'Account not found' });
        }

        // Check password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Password not valid' });
        }

        // Generate JWT token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                phone: user.phone,
                age: user.age
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Protected route example
app.get('/api/profile', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Middleware to authenticate JWT token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid or expired token' });
        }
        req.user = user;
        next();
    });
}

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
    if (!twilioClient) {
        console.log('Note: Twilio not configured. OTPs will be logged to console only.');
    }
});
