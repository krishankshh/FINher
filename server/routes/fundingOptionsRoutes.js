// server/routes/fundingOptionsRoutes.js

import express from 'express';
import AlternativeFundingOption from '../models/AlternativeFundingOption.js';

const router = express.Router();

/**
 * GET /api/funding-options
 * Fetches all alternative funding options from the database.
 */
router.get('/', async (req, res) => {
  console.log('GET /api/funding-options called');

  try {
    const options = await AlternativeFundingOption.find();
    console.log('options found:', options);
    res.status(200).json(options);
  } catch (error) {
    console.error('Error fetching alternative funding options:', error);
    res.status(500).json({ message: 'Error fetching alternative funding options' });
  }
});

export default router;
