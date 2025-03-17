// server/routes/fundingOptionsRoutes.js
import express from 'express';
import AlternativeFundingOption from '../models/AlternativeFundingOption.js';

const router = express.Router();

// GET /api/funding-options - list all alternative funding options
router.get('/', async (req, res) => {
  try {
    const options = await AlternativeFundingOption.find();
    res.status(200).json(options);
  } catch (error) {
    console.error("Error fetching funding options:", error);
    res.status(500).json({ message: "Error fetching funding options" });
  }
});

export default router;
