import {
  Schema,
  model,
  models,
  InferSchemaType,
  HydratedDocument,
} from "mongoose";

// Define schema
const EnquirySchema = new Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },
    emailAddress: {
      type: String,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email address",
      ],
    },
    phoneNo: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
      trim: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: [1000, "Message cannot exceed 1000 characters"],
    },
    status: {
      type: String,
      enum: ["new", "contacted", "interested", "closed"],
      default: "new",
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "medium",
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [500, "Notes cannot exceed 500 characters"],
    },
    pageUrl: {
      type: String,
      trim: true,
      maxlength: [500, "Page URL cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
EnquirySchema.index({ createdAt: -1 });
EnquirySchema.index({ status: 1 });
EnquirySchema.index({ phoneNo: 1 });

// Infer TS types from schema
export type Enquiry = InferSchemaType<typeof EnquirySchema>;
export type EnquiryDocument = HydratedDocument<Enquiry>;

// Export model
const EnquiryModel = models.Enquiry || model<Enquiry>("Enquiry", EnquirySchema);

export default EnquiryModel;
