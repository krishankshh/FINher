import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import FundingRequest from './models/FundingRequest.js'; // Import the funding request model

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// Test route
app.get('/', (req, res) => {
  res.send('FinHER API is Running!');
});

// Create a new funding request (POST /api/funding-requests)
app.post('/api/funding-requests', async (req, res) => {
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

// Get all funding requests (GET /api/funding-requests)
app.get('/api/funding-requests', async (req, res) => {
  try {
    const requests = await FundingRequest.find();
    res.status(200).json(requests);
  } catch (error) {
    console.error('Error fetching funding requests:', error);
    res.status(500).json({ message: 'Error fetching funding requests' });
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
