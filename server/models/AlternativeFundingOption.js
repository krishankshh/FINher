import mongoose from 'mongoose';

const AlternativeFundingOptionSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['Crowdfunding', 'Peer-to-Peer Lending', 'Microloan', 'Angel Investment']
  },
  description: { type: String, required: true },
  link: { type: String }
}, { timestamps: true });

const AlternativeFundingOption = mongoose.model('AlternativeFundingOption', AlternativeFundingOptionSchema);
export default AlternativeFundingOption;
