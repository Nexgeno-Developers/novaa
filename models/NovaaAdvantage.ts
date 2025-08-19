// lib/models/NovaaAdvantage.ts
import mongoose, { Schema, Document, models } from 'mongoose';

export interface AdvantageItem extends Document {
  id: string;
  title: string;
  description: string;
  icon: string; // URL to the icon image
  order: number;
}

export interface NovaaAdvantage extends Document {
  title: string;
    highlightedTitle: string;
  description: string;
  backgroundImage: string; // URL for water effect background
  logoImage: string; // URL for water effect logo
  advantages: AdvantageItem[];
}

const AdvantageItemSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  order: { type: Number, required: true },
});

const NovaaAdvantageSchema: Schema = new Schema({
  title: { type: String, required: true },
    highlightedTitle: { type: String, required: true },
  description: { type: String, required: true },
  backgroundImage: { type: String, required: true },
  logoImage: { type: String, required: true },
  advantages: [AdvantageItemSchema],
}, { timestamps: true });

const NovaaAdvantage = models.NovaaAdvantage || mongoose.model<NovaaAdvantage>('NovaaAdvantage', NovaaAdvantageSchema);

export default NovaaAdvantage;