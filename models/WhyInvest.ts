import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Interface for an individual investment point
export interface IInvestmentPoint extends Document {
  icon: string; // We'll store the icon URL or identifier
  title: string;
  description: string;
}

// Interface for the main WhyInvest document
export interface IWhyInvest extends Document {
  mainTitle: string;
  highlightedTitle: string;
  description: string;
  investmentPoints: IInvestmentPoint[];
  images: string[]; // Array of 4 image URLs
}

const InvestmentPointSchema: Schema<IInvestmentPoint> = new Schema({
  icon: { type: String, required: true, default: '/icons/default-icon.svg' },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

const WhyInvestSchema: Schema<IWhyInvest> = new Schema({
  mainTitle: { type: String, required: true, default: "Why Invest in" },
  highlightedTitle: { type: String, required: true, default: "Phuket Thailand" },
  description: { type: String, required: true, default: "Default description text." },
  investmentPoints: [InvestmentPointSchema],
  images: {
    type: [String],
    required: true,
    validate: [
      (val: string[]) => val.length === 4,
      'There must be exactly 4 images.'
    ],
    default: [
      '/images/default-1.png',
      '/images/default-2.png',
      '/images/default-3.png',
      '/images/default-4.png',
    ],
  },
}, { timestamps: true });

// Check if the model already exists before defining it
const WhyInvest: Model<IWhyInvest> = models.WhyInvest || mongoose.model<IWhyInvest>('WhyInvest', WhyInvestSchema);

export default WhyInvest;