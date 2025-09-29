import mongoose, { Schema, Document, Model } from "mongoose";

export interface IOurStory extends Document {
  pageSlug: string;
  title: string;
  description: string;
  mediaType: "image" | "video";
  mediaUrl: string;
}

const OurStorySchema: Schema<IOurStory> = new Schema({
  pageSlug: {
    type: String,
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: [true, "Title is required."],
    default: "OUR STORY",
  },
  description: {
    type: String,
    default: "<p>Edit this description to tell your story.</p>",
  },
  mediaType: {
    type: String,
    enum: ["image", "video"],
    required: true,
    default: "video",
  },
  mediaUrl: {
    type: String,
    default: "/images/dummyvid.mp4",
  },
});

const OurStory: Model<IOurStory> =
  mongoose.models.OurStory ||
  mongoose.model<IOurStory>("OurStory", OurStorySchema);

export default OurStory;
