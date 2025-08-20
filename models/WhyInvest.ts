import mongoose, { Schema, Document, models, Model } from 'mongoose';

// Interface for an individual investment point
export interface IInvestmentPoint {
  icon: string;
  title: string;
  description: string;
}

// Interface for the main WhyInvest document
export interface IWhyInvest extends Document {
  mainTitle: string;
  highlightedTitle: string;
  description: string;
  investmentPoints: IInvestmentPoint[];
  images: string[];
}

const InvestmentPointSchema = new Schema<IInvestmentPoint>({
  icon: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
});

// Default investment points array
const defaultInvestmentPoints = [
  {
    icon: "/icons/capital.svg",
    title: "Capital Appreciation",
    description:
      "Thailand's property market offers robust long-term growth, with luxury properties in Phuket appreciating by 8-10% annually due to high demand from international buyers and limited supply",
  },
  {
    icon: "/icons/dollar.svg",
    title: "Rental Benefits",
    description:
      "Enjoy high rental yields of 6-8% in prime locations like Phuket and Bangkok, driven by a thriving tourism industry attracting over 40 million visitors yearly.",
  },
  {
    icon: "/icons/location.svg",
    title: "Tourism Boom",
    description:
      "Phuket welcomed 12 million tourists in 2024, fueling demand for luxury accommodations and ensuring strong rental income for investors.",
  },
  {
    icon: "/icons/economy.svg",
    title: "Economic Stability",
    description:
      "Thailand's steady GDP growth and foreigner-friendly policies create a secure environment for investments, supported by world-class infrastructure and healthcare.",
  },
];

const WhyInvestSchema = new Schema<IWhyInvest>(
  {
    mainTitle: {
      type: String,
      required: true,
      default: "Why Invest in",
    },
    highlightedTitle: {
      type: String,
      required: true,
      default: "Phuket Thailand",
    },
    description: {
      type: String,
      required: true,
      default:
        "With tourism revenue at 497.5 billion in 2024, making Phuket Thailand's top-earning province and a real estate market growing 5-7% per year, now is the time to explore high-potential opportunities in coastal investment.",
    },
    investmentPoints: {
      type: [InvestmentPointSchema],
      default: defaultInvestmentPoints,
    },
    images: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length === 4,
        "There must be exactly 4 images.",
      ],
      default: [
        "/images/invest-one.png",
        "/images/invest-two.png",
        "/images/invest-three.png",
        "/images/invest-four.png",
      ],
    },
  },
  { timestamps: true }
);

const WhyInvest: Model<IWhyInvest> =
  models.WhyInvest || mongoose.model<IWhyInvest>("WhyInvest", WhyInvestSchema);

export default WhyInvest;