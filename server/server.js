import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import FundingRequest from './models/FundingRequest.js';
import authRoutes from './routes/authRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';
import fundingOptionsRoutes from './routes/fundingOptionsRoutes.js';
import literacyRoutes from './routes/literacyRoutes.js';



dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Auth Routes
app.use('/api/auth', authRoutes);
app.use('/api/funding-options', fundingOptionsRoutes);
app.use('/api/financial-literacy', literacyRoutes);



// Test Route
app.get('/api', (req, res) => {
  res.send('FinHER API is Running!');
});

// Funding Requests Routes

// Get all funding requests
app.get('/api/funding-requests', async (req, res) => {
  try {
    const requests = await FundingRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching funding requests:', error);
    res.status(500).json({ message: 'Error fetching funding requests' });
  }
});

// Create a new funding request (Protected Route)
app.post('/api/funding-requests', authMiddleware, async (req, res) => {
  try {
    const { entrepreneurName, amountRequested, purpose } = req.body;
    const newRequest = new FundingRequest({ entrepreneurName, amountRequested, purpose });
    const savedRequest = await newRequest.save();
    res.status(201).json(savedRequest);
  } catch (error) {
    console.error('Error creating funding request:', error);
    res.status(500).json({ message: 'Error creating funding request' });
  }
});

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

// Simulated AI-powered credit evaluation endpoint
app.post('/api/credit-evaluation', async (req, res) => {
  try {
    const { entrepreneurName, amountRequested, purpose } = req.body;
    // Simple simulated credit evaluation:
    let score = 850 - (Number(amountRequested) / 100);
    if (score > 850) score = 850;
    if (score < 300) score = 300;
    const recommendation = score > 700 
      ? "Eligible for standard funding" 
      : "Consider alternative financing options";
    res.status(200).json({ creditScore: score, recommendation });
  } catch (error) {
    console.error("Error evaluating credit:", error);
    res.status(500).json({ message: "Error evaluating credit" });
  }
});
