// server/routes/literacyRoutes.js
import express from 'express';
import FinancialLiteracyResource from '../models/FinancialLiteracyResource.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * GET /api/financial-literacy
 * Public route - no login required
 * Optional ?search= for filtering by title/description
 */
router.get('/', async (req, res) => {
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

/**
 * POST /api/financial-literacy
 * Protected - only logged-in users can add
 */
router.post('/', authMiddleware, async (req, res) => {
  console.log('POST /api/financial-literacy called with user:', req.user);

  try {
    const { title, description, resourceType, url } = req.body;
    const newResource = new FinancialLiteracyResource({
      title,
      description,
      resourceType,
      url,
      createdBy: req.user.userId // from authMiddleware
    });

    const saved = await newResource.save();
    await saved.populate('createdBy', 'name');

    res.status(201).json(saved);
  } catch (error) {
    console.error('Error creating financial literacy resource:', error);
    res.status(500).json({ message: 'Error creating financial literacy resource' });
  }
});

export default router;
