// server/routes/literacyRoutes.js
import express from 'express';
import FinancialLiteracyResource from '../models/FinancialLiteracyResource.js';

const router = express.Router();

/**
 * GET /api/financial-literacy
 * Fetch all financial literacy resources.
 */
router.get('/', async (req, res) => {
  try {
    const resources = await FinancialLiteracyResource.find();
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching financial literacy resources:', error);
    res.status(500).json({ message: 'Error fetching financial literacy resources' });
  }
});

/**
 * POST /api/financial-literacy
 * (Optional) Create a new financial literacy resource.
 * Could be protected by authMiddleware if you want only admins to add resources.
 */
router.post('/', async (req, res) => {
  try {
    const { title, description, resourceType, url } = req.body;
    const newResource = new FinancialLiteracyResource({
      title,
      description,
      resourceType,
      url
    });
    const saved = await newResource.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating financial literacy resource:', error);
    res.status(500).json({ message: 'Error creating financial literacy resource' });
  }
});

export default router;
