// server/seed/alternativeFundingOptionsSeed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import AlternativeFundingOption from '../models/AlternativeFundingOption.js';

dotenv.config();

const options = [
  {
    name: "Pradhan Mantri Mudra Yojana (PMMY)",
    description: "Provides microloans up to Rs.10 lakh for non-corporate, non-farm small/micro enterprises in manufacturing, trading, and services.",
    eligibility: "Entrepreneurs aged 18-60 with viable business ideas.",
    applicationLink: "https://www.mudra.org.in/"
  },
  {
    name: "Stand Up India Scheme",
    description: "Facilitates bank loans between Rs. 10 lakh and Rs. 1 crore to at least one SC/ST borrower and at least one woman borrower per bank branch.",
    eligibility: "Women entrepreneurs, especially from SC/ST communities.",
    applicationLink: "https://www.standupmitra.in/"
  },
  {
    name: "Credit Guarantee Fund Trust for Micro and Small Enterprises (CGTMSE)",
    description: "Provides collateral-free credit to MSMEs by sharing the credit risk between banks and the government.",
    eligibility: "Eligible MSMEs as per guidelines.",
    applicationLink: "https://www.cgtmse.in/"
  }
];

mongoose.connect(process.env.MONGO_URI || '', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log('Connected to MongoDB. Seeding data...');
    await AlternativeFundingOption.deleteMany({});
    await AlternativeFundingOption.insertMany(options);
    console.log('Seeding complete.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  });
