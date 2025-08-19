import mongoose, { Schema, Document, models } from 'mongoose';

// Interface for a single FAQ item
export interface FaqItem extends Document {
  id: string; // For dnd compatibility
  question: string;
  answer: string;
  order: number;
}

// Interface for the entire FAQ section
export interface Faq extends Document {
  title: string;
  description: string;
  backgroundImage: string;
  faqs: FaqItem[];
}

const FaqItemSchema: Schema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, required: true },
});

const FaqSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String },
  backgroundImage: { type: String, required: true },
  faqs: [FaqItemSchema],
}, { timestamps: true });

const Faq = models.Faq || mongoose.model<Faq>('Faq', FaqSchema);

export default Faq;