import mongoose from 'mongoose';

const FundingRequestSchema = new mongoose.Schema({
  entrepreneurName: { type: String, required: true },
  amountRequested: { type: Number, required: true },
  purpose: { type: String, required: true },
  description: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactAddress: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

const FundingRequest = mongoose.model('FundingRequest', FundingRequestSchema);
export default FundingRequest;
