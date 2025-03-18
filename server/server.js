// server/server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';

// Import Models
import User from './models/User.js';
import FundingRequest from './models/FundingRequest.js';
import AlternativeFundingOption from './models/AlternativeFundingOption.js';
import FinancialLiteracyResource from './models/FinancialLiteracyResource.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

/* ----------------------------------------------------------------------------
   Simulated Auth Middleware
   ----------------------------------------------------------------------------
   For demonstration, we simulate authentication by checking that a token is
   present in the headers. We then set req.user.userId to a fixed, valid
   ObjectId string (24 hex characters). Make sure this matches the DB you expect.
------------------------------------------------------------------------------- */
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }
  // Set a fixed, valid ObjectId string so that createdBy is valid.
  req.user = { userId: '64c4ef283db2a23eaa6d6f41' };
  next();
};

/* ----------------------------------------------------------------------------
   MAIN ROUTES
------------------------------------------------------------------------------- */

// Test Route
app.get('/', (req, res) => {
  res.send('FinHER API (OTP-based password reset) is Running!');
});

/* ------------------------- Funding Requests ------------------------- */

// Public GET: All funding requests
app.get('/api/funding-requests', async (req, res) => {
  try {
    const requests = await FundingRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching funding requests:', error);
    res.status(500).json({ message: 'Error fetching funding requests' });
  }
});

// Public GET: Single funding request details (for funding detail view)
app.get('/api/funding-requests/:id', async (req, res) => {
  try {
    const request = await FundingRequest.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ message: 'Funding request not found' });
    }
    res.status(200).json(request);
  } catch (error) {
    console.error('Error fetching funding request details:', error);
    res.status(500).json({ message: 'Error fetching funding request details' });
  }
});

// Protected GET: Get funding requests created by the logged-in user
app.get('/api/my-funding-requests', authMiddleware, async (req, res) => {
  try {
    const requests = await FundingRequest.find({ createdBy: req.user.userId });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching user funding requests:', error);
    res.status(500).json({ message: 'Error fetching user funding requests' });
  }
});

// Protected POST: Create a new funding request
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
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error creating funding request:', error);
    res.status(500).json({ message: 'Error creating funding request' });
  }
});

// Protected PUT: Update a funding request
app.put('/api/funding-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { entrepreneurName, amountRequested, purpose, description, contactPhone, contactAddress } = req.body;

    const existingRequest = await FundingRequest.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ message: 'Funding request not found' });
    }
    if (existingRequest.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    existingRequest.entrepreneurName = entrepreneurName;
    existingRequest.amountRequested = amountRequested;
    existingRequest.purpose = purpose;
    existingRequest.description = description;
    existingRequest.contactPhone = contactPhone;
    existingRequest.contactAddress = contactAddress;

    const updatedRequest = await existingRequest.save();
    res.status(200).json(updatedRequest);
  } catch (error) {
    console.error('Error updating funding request:', error);
    res.status(500).json({ message: 'Error updating funding request' });
  }
});

// Protected DELETE: Delete a funding request
app.delete('/api/funding-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    const existingRequest = await FundingRequest.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ message: 'Funding request not found' });
    }
    if (existingRequest.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }

    await existingRequest.deleteOne();
    res.status(200).json({ message: 'Funding request deleted successfully' });
  } catch (error) {
    console.error('Error deleting funding request:', error);
    res.status(500).json({ message: 'Error deleting funding request' });
  }
});

/* ------------------------- Alternative Funding Options ------------------------- */

// GET alternative funding options
import fundingOptionsRoutes from './routes/fundingOptionsRoutes.js';
app.use('/api/funding-options', fundingOptionsRoutes);

/* ------------------------- Financial Literacy Resources ------------------------- */

// GET financial literacy resources
import literacyRoutes from './routes/literacyRoutes.js';
app.use('/api/financial-literacy', literacyRoutes);

/* ------------------------- AI Credit Evaluation ------------------------- */

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

/* ------------------------- OTP-based Password Reset ------------------------- */

// POST: Send OTP for password reset
app.post('/api/auth/send-otp', async (req, res) => {
  console.log('POST /api/auth/send-otp called');
  console.log('Request body:', req.body);
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      console.log('No user found for email:', email);
      return res.status(400).json({ message: 'No user found with that email' });
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 10 * 60 * 1000; // 10 minutes

    user.otpCode = otpCode;
    user.otpExpires = expiry;
    await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const resetText = `Your OTP code is: ${otpCode}\nThis code will expire in 10 minutes.`;
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'FinHER OTP Code',
      text: resetText
    };

    await transporter.sendMail(mailOptions);
    console.log('OTP sent successfully to:', user.email);
    return res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Error in send-otp route:', error);
    return res.status(500).json({ message: 'Server error sending OTP' });
  }
});

// POST: Verify OTP and reset password
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'No user found with that email' });
    }
    if (user.otpCode !== otpCode) {
      return res.status(400).json({ message: 'Invalid OTP code' });
    }
    if (Date.now() > user.otpExpires) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();
    return res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Error in verify-otp route:', error);
    return res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

/* ------------------------- DB Connection ------------------------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('MongoDB Connection Error:', err.message));
