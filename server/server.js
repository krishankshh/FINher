// server/server.js

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';

// Models
import FundingRequest from './models/FundingRequest.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import fundingOptionsRoutes from './routes/fundingOptionsRoutes.js';
import literacyRoutes from './routes/literacyRoutes.js';

// Middleware
import authMiddleware from './middleware/authMiddleware.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// -------------------------
// Authentication Routes
// -------------------------
app.use('/api/auth', authRoutes);

// -------------------------
// Alternative Funding Routes
// -------------------------
app.use('/api/funding-options', fundingOptionsRoutes);

// -------------------------
// Financial Literacy Routes
// -------------------------
app.use('/api/financial-literacy', literacyRoutes);

// -------------------------
// Test Route
// -------------------------
app.get('/', (req, res) => {
  res.send('FinHER API is Running!');
});

// -------------------------
// Public GET: All Funding Requests
// -------------------------
app.get('/api/funding-requests', async (req, res) => {
  try {
    const requests = await FundingRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching funding requests:', error);
    res.status(500).json({ message: 'Error fetching funding requests' });
  }
});

// -------------------------
// Public GET: Funding Request by ID
// So Home page can fetch detail for /funding/:id
// -------------------------
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

// -------------------------
// Protected GET: My Funding Requests
// Returns only requests created by the logged-in user
// -------------------------
app.get('/api/my-funding-requests', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const requests = await FundingRequest.find({ createdBy: userId });
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching user funding requests:', error);
    res.status(500).json({ message: 'Error fetching user funding requests' });
  }
});

// -------------------------
// Protected POST: Create a Funding Request
// -------------------------
app.post('/api/funding-requests', authMiddleware, async (req, res) => {
  try {
    const { 
      entrepreneurName, 
      amountRequested, 
      purpose, 
      description, 
      contactPhone, 
      contactAddress 
    } = req.body;

    // Associate this request with the logged-in user
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

// -------------------------
// Protected PUT: Update a Funding Request
// -------------------------
app.put('/api/funding-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;
    const { 
      entrepreneurName, 
      amountRequested, 
      purpose, 
      description, 
      contactPhone, 
      contactAddress 
    } = req.body;

    // Find existing request
    const existingRequest = await FundingRequest.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ message: 'Funding request not found' });
    }

    // Check if the logged-in user is the owner
    if (existingRequest.createdBy.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this request' });
    }

    // Update fields
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

// -------------------------
// Protected DELETE: Delete a Funding Request
// -------------------------
app.delete('/api/funding-requests/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.userId;

    // Find existing request
    const existingRequest = await FundingRequest.findById(id);
    if (!existingRequest) {
      return res.status(404).json({ message: 'Funding request not found' });
    }

    // Check if the logged-in user is the owner
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

// -------------------------
// Simulated AI-Powered Credit Evaluation
// -------------------------
app.post('/api/credit-evaluation', async (req, res) => {
  try {
    const { entrepreneurName, amountRequested, purpose } = req.body;
    // Simple credit score logic for demonstration
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

// -------------------------
// MongoDB Connection
// -------------------------
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || '';

if (MONGO_URI) {
  mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log('Connected to MongoDB');
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((error) => console.log('MongoDB Connection Error:', error.message));
} else {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}, but no MONGO_URI found`));
}
