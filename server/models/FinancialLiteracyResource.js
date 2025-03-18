import mongoose from 'mongoose';

const FinancialLiteracyResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  url: { type: String }
}, { timestamps: true });

const FinancialLiteracyResource = mongoose.model('FinancialLiteracyResource', FinancialLiteracyResourceSchema);
export default FinancialLiteracyResource;
