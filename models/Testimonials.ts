import mongoose from "mongoose";

const TestimonialItemSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
      default: 5,
    },
    quote: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const TestimonialsSchema = new mongoose.Schema(
  {
    sectionId: {
      type: String,
      required: true,
      unique: true,
      default: "testimonials-section",
    },
    content: {
      title: {
        type: String,
        required: true,
        default: "What Our Elite Clients Say",
      },
      subtitle: {
        type: String,
        required: true,
        default: "Real stories from real people who trust us",
      },
    },
    testimonials: [TestimonialItemSchema],
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Ensure testimonials are sorted by order
TestimonialsSchema.pre("find", function () {
  this.populate({
    path: "testimonials",
    options: { sort: { order: 1 } },
  });
});

TestimonialsSchema.pre("findOne", function () {
  this.populate({
    path: "testimonials",
    options: { sort: { order: 1 } },
  });
});

export default mongoose.models.Testimonials ||
  mongoose.model("Testimonials", TestimonialsSchema);
