import mongoose from 'mongoose';

const FundingRequestSchema = new mongoose.Schema({
  entrepreneurName: {
    type: String,
    required: true
  },
  amountRequested: {
    type: Number,
    required: true
  },
  purpose: {
    type: String,
    required: true
  }
}, { timestamps: true });

const FundingRequest = mongoose.model('FundingRequest', FundingRequestSchema);

export default FundingRequest;
