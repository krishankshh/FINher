// server/server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import crypto from 'crypto'; // for generating numeric OTP codes or random strings

// Models
import User from './models/User.js';
import FundingRequest from './models/FundingRequest.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// -------------------------
// Test route
// -------------------------
app.get('/api', (req, res) => {
  res.send('FinHER API (OTP-based password reset) is Running!');
});

// -------------------------
// Auth: Register
// -------------------------
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = new User({
      name,
      email,
      password: hashed
    });
    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully'
    });
  } catch (error) {
    console.error('Register Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// -------------------------
// Auth: Login
// -------------------------
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // In a real app, create a JWT. We'll just return a fake token for demo
    const token = 'FAKE_JWT_TOKEN';
    return res.json({
      message: 'Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// -------------------------
// OTP-based Password Reset
// -------------------------

// 1) Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { email } = req.body;
    // Check user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No user found with that email' });
    }

    // Generate a 6-digit numeric OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // e.g. "123456"
    // or crypto.randomBytes(3).toString('hex') for a hex code

    // Set expiry (e.g., 10 minutes from now)
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otpCode = otpCode;
    user.otpExpires = expiry;
    await user.save();

    // Send OTP via Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'FinHER OTP Code',
      text: `Your OTP code is: ${otpCode}\nThis code will expire in 10 minutes.`
    };

    await transporter.sendMail(mailOptions);

    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP Error:', error);
    return res.status(500).json({ message: 'Server error sending OTP' });
  }
});

// 2) Verify OTP & Reset Password
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No user found with that email' });
    }

    // Check if OTP matches and not expired
    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired' });
    }

    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;

    // Clear OTP fields
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Verify OTP Error:', error);
    return res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

// -------------------------
// Demo Auth Middleware for Protected Routes
// -------------------------
const authMiddleware = (req, res, next) => {
  // In real app, verify JWT. For now, assume user is always "logged in" if token present
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  // Fake user
  req.user = { userId: 'SIMULATED_USER_ID' };
  next();
};

// -------------------------
// Funding Request CRUD (Protected)
// -------------------------
app.get('/api/my-funding-requests', authMiddleware, async (req, res) => {
  try {
    const requests = await FundingRequest.find({ createdBy: req.user.userId });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching user funding requests:', error);
    res.status(500).json({ message: 'Error fetching user funding requests' });
  }
});

app.post('/api/funding-requests', authMiddleware, async (req, res) => {
  try {
    const { entrepreneurName, amountRequested, purpose, description, contactPhone, contactAddress } = req.body;
    const newRequest = new FundingRequest({
      entrepreneurName,
      amountRequested,
      purpose,
      description,
      contactPhone,
      contactAddress,
      createdBy: req.user.userId
    });
    const saved = await newRequest.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating request:', error);
    res.status(500).json({ message: 'Error creating funding request' });
  }
});

app.put('/api/funding-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await FundingRequest.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Funding request not found' });
    }
    if (existing.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const { entrepreneurName, amountRequested, purpose, description, contactPhone, contactAddress } = req.body;
    existing.entrepreneurName = entrepreneurName;
    existing.amountRequested = amountRequested;
    existing.purpose = purpose;
    existing.description = description;
    existing.contactPhone = contactPhone;
    existing.contactAddress = contactAddress;

    const updated = await existing.save();
    res.status(200).json(updated);
  } catch (error) {
    console.error('Error updating request:', error);
    res.status(500).json({ message: 'Error updating request' });
  }
});

app.delete('/api/funding-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await FundingRequest.findById(id);
    if (!existing) {
      return res.status(404).json({ message: 'Funding request not found' });
    }
    if (existing.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await existing.deleteOne();
    res.status(200).json({ message: 'Funding request deleted successfully' });
  } catch (error) {
    console.error('Error deleting request:', error);
    res.status(500).json({ message: 'Error deleting request' });
  }
});

// -------------------------
// AI Credit Evaluation
// -------------------------
app.post('/api/credit-evaluation', async (req, res) => {
  try {
    const { entrepreneurName, amountRequested, purpose } = req.body;
    let score = 850 - (Number(amountRequested) / 100);
    if (score > 850) score = 850;
    if (score < 300) score = 300;
    const recommendation = score > 700 
      ? 'Eligible for standard funding' 
      : 'Consider alternative financing options';

    res.status(200).json({ creditScore: score, recommendation });
  } catch (error) {
    console.error('Error evaluating credit:', error);
    res.status(500).json({ message: 'Error evaluating credit' });
  }
});

// Connect to MongoDB
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI || '', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('MongoDB Error:', err.message));
