// server/seed/financialLiteracySeed.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FinancialLiteracyResource from '../models/FinancialLiteracyResource.js';

dotenv.config();

const sampleResources = [
  {
    title: "Introduction to Budgeting",
    description: "An article explaining the basics of personal and business budgeting.",
    resourceType: "article",
    url: "https://example.com/budgeting-101"
  },
  {
    title: "Cash Flow Management for SMEs",
    description: "Video tutorial on managing cash flow for small and medium enterprises.",
    resourceType: "video",
    url: "https://youtube.com/example-cashflow"
  },
  {
    title: "Business Growth Strategies",
    description: "A free online course covering growth strategies for new entrepreneurs.",
    resourceType: "course",
    url: "https://example.com/course/business-growth"
  }
];

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    console.log("Connected to MongoDB. Seeding data...");
    await FinancialLiteracyResource.deleteMany({});
    await FinancialLiteracyResource.insertMany(sampleResources);
    console.log("Seeding complete.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });
