// server/models/AlternativeFundingOption.js
import mongoose from 'mongoose';

const AlternativeFundingOptionSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  eligibility: { type: String },
  applicationLink: { type: String }
}, { timestamps: true });

const AlternativeFundingOption = mongoose.model('AlternativeFundingOption', AlternativeFundingOptionSchema);
export default AlternativeFundingOption;
