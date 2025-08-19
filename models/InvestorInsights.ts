// models/InvestorInsights.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface ITestimonial {
  quote: string;
  content: string;
  designation: string;
  src: string;
  order: number;
}

export interface IInvestorInsightsContent {
  mainTitle: string;
  highlightedTitle: string;
  description: string;
}

export interface IInvestorInsights extends Document {
  content: IInvestorInsightsContent;
  testimonials: ITestimonial[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema({
  quote: { type: String, required: true },
  content: { type: String, required: true },
  designation: { type: String, required: true },
  src: { type: String, required: true },
  order: { type: Number, required: true, default: 0 }
});

const InvestorInsightsContentSchema = new Schema({
  mainTitle: { type: String, required: true, default: "Insights for the" },
  highlightedTitle: { type: String, required: true, default: "Discerning Investor" },
  description: { type: String, required: true, default: "Stay informed with trending stories, industry updates, and thoughtful articles curated just for you." }
});

const InvestorInsightsSchema = new Schema({
  content: { 
    type: InvestorInsightsContentSchema, 
    required: true,
    default: () => ({})
  },
  testimonials: [TestimonialSchema],
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export default mongoose.models.InvestorInsights || mongoose.model<IInvestorInsights>('InvestorInsights', InvestorInsightsSchema);