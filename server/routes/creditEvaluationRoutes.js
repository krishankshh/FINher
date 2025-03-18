// server/routes/creditEvaluationRoutes.js
import express from 'express';
const router = express.Router();

/**
 * POST /api/credit-evaluation
 * Simulated robust AI credit evaluation using multiple data points:
 * - entrepreneurName
 * - amountRequested
 * - purpose
 * - businessRevenue (in ₹)
 * - businessAge (in years)
 * - collateralValue (in ₹)
 */
router.post('/', async (req, res) => {
  try {
    const {
      entrepreneurName,
      amountRequested,
      purpose,
      businessRevenue,
      businessAge,
      collateralValue
    } = req.body;
    
    // Start with a base score
    let score = 500;
    
    // Factor: Amount Requested
    if (amountRequested) {
      if (amountRequested < 100000) {
        score += 100;
      } else if (amountRequested < 500000) {
        score += 50;
      } else {
        score -= 50;
      }
    }
    
    // Factor: Business Revenue
    if (businessRevenue) {
      if (businessRevenue >= 1000000) { // ≥ 10 lakhs
        score += 100;
      } else if (businessRevenue >= 500000) { // 5 lakhs to 10 lakhs
        score += 50;
      } else {
        score -= 20;
      }
    }
    
    // Factor: Business Age
    if (businessAge) {
      if (businessAge >= 5) {
        score += 50;
      } else if (businessAge >= 2) {
        score += 20;
      } else {
        score -= 20;
      }
    }
    
    // Factor: Collateral Value
    if (collateralValue && amountRequested) {
      if (collateralValue >= amountRequested * 1.5) {
        score += 50;
      } else if (collateralValue >= amountRequested) {
        score += 20;
      } else {
        score -= 20;
      }
    }
    
    // Factor: Purpose adjustment
    if (purpose) {
      const purposeLower = purpose.toLowerCase();
      if (purposeLower.includes('expansion') || purposeLower.includes('growth')) {
        score += 50;
      } else if (purposeLower.includes('startup') || purposeLower.includes('new')) {
        score -= 50;
      }
    }
    
    // Factor: Entrepreneur Name (dummy proxy for experience)
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
      ? "Eligible for standard funding" 
      : "Consider alternative financing options";
    
    res.status(200).json({ creditScore: score, recommendation });
  } catch (error) {
    console.error("Error in robust credit evaluation:", error);
    res.status(500).json({ message: "Error evaluating credit" });
  }
});

export default router;
