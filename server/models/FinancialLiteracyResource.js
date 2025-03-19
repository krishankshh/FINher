// server/models/FinancialLiteracyResource.js
import mongoose from 'mongoose';

const FinancialLiteracyResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  resourceType: {
    type: String,
    enum: ['article', 'video', 'course'],
    default: 'article'
  },
  url: { type: String },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

const FinancialLiteracyResource = mongoose.model('FinancialLiteracyResource', FinancialLiteracyResourceSchema);
export default FinancialLiteracyResource;
