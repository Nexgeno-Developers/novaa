// models/Breadcrumb.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// Interface for our Breadcrumb data
export interface IBreadcrumb extends Document {
  pageSlug: string;
  title: string;
  description: string;
  backgroundImageUrl: string;
}

// Mongoose Schema
const BreadcrumbSchema: Schema<IBreadcrumb> = new Schema({
  pageSlug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: [true, "Title is required."],
    default: "Our Properties",
  },
  description: {
    type: String,
    default: "<p>Discover your next home with Novaa Real Estate.</p>",
  },
  backgroundImageUrl: {
    type: String,
    required: [true, "Background image URL is required."],
    default: "/images/bg1.webp", // A default fallback image
  },
});

// To prevent model recompilation in Next.js hot-reloading
const Breadcrumb: Model<IBreadcrumb> =
  mongoose.models.Breadcrumb ||
  mongoose.model<IBreadcrumb>("Breadcrumb", BreadcrumbSchema);

export default Breadcrumb;
