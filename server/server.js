// server/server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

/* --------------------------------------------------------------------------
   Mongoose Models (defined inline for completeness)
--------------------------------------------------------------------------- */

// User Model (now with role)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  otpCode: { type: String },
  otpExpires: { type: Date }
}, { timestamps: true });
const User = mongoose.model('User', userSchema);

// Funding Request Model
const fundingRequestSchema = new mongoose.Schema({
  entrepreneurName: { type: String, required: true },
  amountRequested: { type: Number, required: true },
  purpose: { type: String, required: true },
  description: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactAddress: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const FundingRequest = mongoose.model('FundingRequest', fundingRequestSchema);

// Alternative Funding Option Model
const alternativeFundingOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String },
  applicationLink: { type: String }
}, { timestamps: true });
const AlternativeFundingOption = mongoose.model('AlternativeFundingOption', alternativeFundingOptionSchema);

// Financial Literacy Resource Model (includes createdBy)
const financialLiteracyResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  resourceType: {
    type: String,
    enum: ['article', 'video', 'course'],
    default: 'article'
  },
  url: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });
const FinancialLiteracyResource = mongoose.model('FinancialLiteracyResource', financialLiteracyResourceSchema);

/* --------------------------------------------------------------------------
   Auth Middleware (JWT-based, with role)
--------------------------------------------------------------------------- */
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization; // Expect "Bearer <token>"
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    return res.status(401).json({ message: 'Invalid token format' });
  }
  const token = parts[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = { userId: decoded.userId, role: decoded.role };
  } catch (error) {
    console.error('authMiddleware error:', error);
    return res.status(401).json({ message: 'Invalid token' });
  }
  next();
};

/* --------------------------------------------------------------------------
   Routes
--------------------------------------------------------------------------- */

// Test Route
app.get('/', (req, res) => {
  res.send('FinHER API is running!');
});

/* ----- Authentication Routes ----- */

// Register: POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body; // Optionally, an admin can be created manually via DB or controlled endpoint
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);
    const newUser = new User({ name, email, password: hashed, role: role || 'user' });
    const savedUser = await newUser.save();
    res.status(201).json({ 
      message: 'User registered successfully', 
      user: { _id: savedUser._id, name: savedUser.name, email: savedUser.email, role: savedUser.role }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login: POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('POST /api/auth/login called with:', req.body);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    // Include role in the token payload
    const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
    res.json({
      message: 'Login successful',
      token,
      user: { _id: user._id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ----- OTP-based Password Reset ----- */

// Send OTP: POST /api/auth/send-otp
app.post('/api/auth/send-otp', async (req, res) => {
  console.log('POST /api/auth/send-otp called, body:', req.body);
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user found with that email' });
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.otpCode = otpCode;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
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
    console.log('OTP sent successfully to:', user.email);
    res.status(200).json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Send OTP error:', error);
    res.status(500).json({ message: 'Server error sending OTP' });
  }
});

// Verify OTP & Reset Password: POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otpCode, newPassword } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'No user found with that email' });
    if (user.otpCode !== otpCode) return res.status(400).json({ message: 'Invalid OTP code' });
    if (Date.now() > user.otpExpires) return res.status(400).json({ message: 'OTP has expired' });
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);
    user.password = hashed;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();
    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ message: 'Server error verifying OTP' });
  }
});

/* ----- Funding Request Routes ----- */

// GET all funding requests (public)
app.get('/api/funding-requests', async (req, res) => {
  try {
    const requests = await FundingRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching funding requests:', error);
    res.status(500).json({ message: 'Error fetching funding requests' });
  }
});

// GET single funding request (public)
app.get('/api/funding-requests/:id', async (req, res) => {
  try {
    const request = await FundingRequest.findById(req.params.id);
    if (!request) return res.status(404).json({ message: 'Funding request not found' });
    res.status(200).json(request);
  } catch (error) {
    console.error('Error fetching funding request details:', error);
    res.status(500).json({ message: 'Error fetching funding request details' });
  }
});

// GET funding requests for logged-in user (protected)
app.get('/api/my-funding-requests', authMiddleware, async (req, res) => {
  try {
    const requests = await FundingRequest.find({ createdBy: req.user.userId });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching user funding requests:', error);
    res.status(500).json({ message: 'Error fetching user funding requests' });
  }
});

// POST create a new funding request (protected)
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

// PUT update a funding request (protected)
// Admins can update any request; others can update only their own
app.put('/api/funding-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { entrepreneurName, amountRequested, purpose, description, contactPhone, contactAddress } = req.body;
    const existingRequest = await FundingRequest.findById(id);
    if (!existingRequest) return res.status(404).json({ message: 'Funding request not found' });
    // Allow update if user is the owner or admin
    if (existingRequest.createdBy.toString() !== userId && req.user.role !== 'admin') {
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

// DELETE a funding request (protected)
// Admins can delete any request; others can delete only their own
app.delete('/api/funding-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const existingRequest = await FundingRequest.findById(id);
    if (!existingRequest) return res.status(404).json({ message: 'Funding request not found' });
    if (existingRequest.createdBy.toString() !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }
    await existingRequest.deleteOne();
    res.status(200).json({ message: 'Funding request deleted successfully' });
  } catch (error) {
    console.error('Error deleting funding request:', error);
    res.status(500).json({ message: 'Error deleting funding request' });
  }
});

/* ----- Alternative Funding Options ----- */
app.get('/api/funding-options', async (req, res) => {
  try {
    const options = await AlternativeFundingOption.find();
    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching alternative funding options:', error);
    res.status(500).json({ message: 'Error fetching alternative funding options' });
  }
});

/* ----- Financial Literacy Resources ----- */
// GET financial literacy resources with search (public)
app.get('/api/financial-literacy', async (req, res) => {
  try {
    const search = req.query.search || '';
    const query = {};
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }
    const resources = await FinancialLiteracyResource
      .find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching financial literacy resources:', error);
    res.status(500).json({ message: 'Error fetching financial literacy resources' });
  }
});

// POST create a new financial literacy resource (protected)
// Only logged-in users can add resources. Admins can add and later delete any resource.
app.post('/api/financial-literacy', authMiddleware, async (req, res) => {
  try {
    const { title, description, resourceType, url } = req.body;
    const newResource = new FinancialLiteracyResource({
      title,
      description,
      resourceType: resourceType || 'article',
      url,
      createdBy: req.user.userId
    });
    const saved = await newResource.save();
    await saved.populate('createdBy', 'name');
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating financial literacy resource:', error);
    res.status(500).json({ message: 'Error creating financial literacy resource' });
  }
});

// DELETE financial literacy resource (protected)
// Admins can delete any resource; others can delete only their own.
app.delete('/api/financial-literacy/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await FinancialLiteracyResource.findById(id);
    if (!resource) return res.status(404).json({ message: 'Resource not found' });
    if (resource.createdBy.toString() !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this resource' });
    }
    await resource.deleteOne();
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ message: 'Error deleting resource' });
  }
});

/* ----- Robust AI Credit Evaluation ----- */
app.post('/api/credit-evaluation', async (req, res) => {
  try {
    const {
      entrepreneurName,
      amountRequested,
      purpose,
      businessRevenue,
      businessAge,
      collateralValue
    } = req.body;
    
    let score = 500;
    
    // Amount Requested
    if (amountRequested < 100000) {
      score += 100;
    } else if (amountRequested < 500000) {
      score += 50;
    } else {
      score -= 50;
    }
    
    // Business Revenue
    if (businessRevenue >= 1000000) {
      score += 100;
    } else if (businessRevenue >= 500000) {
      score += 50;
    } else {
      score -= 20;
    }
    
    // Business Age
    if (businessAge >= 5) {
      score += 50;
    } else if (businessAge >= 2) {
      score += 20;
    } else {
      score -= 20;
    }
    
    // Collateral Value
    if (collateralValue && amountRequested) {
      if (collateralValue >= amountRequested * 1.5) {
        score += 50;
      } else if (collateralValue >= amountRequested) {
        score += 20;
      } else {
        score -= 20;
      }
    }
    
    // Purpose
    if (purpose) {
      const purposeLower = purpose.toLowerCase();
      if (purposeLower.includes('expansion') || purposeLower.includes('growth')) {
        score += 50;
      } else if (purposeLower.includes('startup') || purposeLower.includes('new')) {
        score -= 50;
      }
    }
    
    // Entrepreneur Name Length (dummy proxy for experience)
    if (entrepreneurName) {
      if (entrepreneurName.length > 10) {
        score += 20;
      } else {
        score -= 10;
      }
    }
    
    // Clamp score between 300 and 850
    if (score > 850) score = 850;
    if (score < 300) score = 300;
    
    const recommendation = score > 700
      ? 'Eligible for standard funding'
      : 'Consider alternative financing options';
    
    res.status(200).json({ creditScore: score, recommendation });
  } catch (error) {
    console.error('Error in robust credit evaluation:', error);
    res.status(500).json({ message: 'Error evaluating credit' });
  }
});

/* ------------------------- DB Connection ------------------------- */
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

mongoose
  .connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.log('MongoDB Connection Error:', err.message));
