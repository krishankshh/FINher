// server/routes/literacyRoutes.js
import express from 'express';
import FinancialLiteracyResource from '../models/FinancialLiteracyResource.js';

const router = express.Router();

// GET /api/financial-literacy - list all financial literacy resources
router.get('/', async (req, res) => {
  try {
    const resources = await FinancialLiteracyResource.find();
    res.status(200).json(resources);
  } catch (error) {
    console.error("Error fetching financial literacy resources:", error);
    res.status(500).json({ message: "Error fetching financial literacy resources" });
  }
});

// Optionally, an endpoint to add new resources (could be admin-only)
router.post('/', async (req, res) => {
  try {
    const { title, description, url } = req.body;
    const newResource = new FinancialLiteracyResource({ title, description, url });
    const savedResource = await newResource.save();
    res.status(201).json(savedResource);
  } catch (error) {
    console.error("Error creating financial literacy resource:", error);
    res.status(500).json({ message: "Error creating financial literacy resource" });
  }
});

export default router;
