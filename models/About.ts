import mongoose, { Schema, Document } from "mongoose";

export interface IAbout extends Document {
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonUrl: string;
  bgImage1: string;
  bgImage2: string;
  bgType: "image" | "video";
  bgVideo: string;
  topOverlay: boolean;
  bottomOverlay: boolean;
}

const AboutSchema: Schema = new Schema(
  {
    title: { type: String, default: "About" },
    subtitle: { type: String, default: true },
    description: {
      type: String,
      default:
        "is simply dummy text of the printing and typesetting indust random text for testing is simply dummy text of the printing and typesetting indust random text for testing is simply dummy text of the printing and typesetting indust random text for testing is simply dummy text of the printing and typesetting indust random text for testing is simply dummy text of the printing and typesetting indust random text for testing is simply dummy text of the printing and typesetting indust random text for testing is simply dummy text of the printing and typesetting indust random text for testing is simply dummy text of the printing and typesetting indust random text for testing is simply dummy text of the printing and typesetting indust random text for testing is simply dummy text of the printing and typesetting indust random text for testing",
    },
    buttonText: { type: String, default: "Discover More" },
    buttonUrl: { type: String, default: "/about-us" },
    bgType: { type: String, enum: ["image", "video"], default: "image" },

    bgImage1: { type: String, default: "/images/about-bg-with-clouds.png" },
    bgImage2: { type: String, default: "/images/about-bg-without-cloud.png" },
    bgVideo: { type: String, default: "" },
    topOverlay: { type: Boolean, default: true },
    bottomOverlay: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Prevent model overwrite in Next.js hot-reloading
export default mongoose.models.About ||
  mongoose.model<IAbout>("About", AboutSchema);
