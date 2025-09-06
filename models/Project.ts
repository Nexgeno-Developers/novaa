import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    // Existing basic fields
    name: { type: String, required: true },
    price: { type: String, required: true },
    images: [{ type: String, required: true }],
    location: { type: String, required: true },
    description: { type: String, required: true },
    badge: { type: String, default: "" },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryName: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    order: { type: Number, default: 0 },

    // New project detail fields
    projectDetail: {
      // Hero Section
      hero: {
        backgroundImage: { type: String, default: "" },
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        scheduleMeetingButton: { type: String, default: "Schedule a meeting" },
        getBrochureButton: { type: String, default: "Get Brochure" },
        brochurePdf: { type: String, default: "" }, // PDF file URL
      },

      // Project Highlights Section
      projectHighlights: {
        backgroundImage: { type: String, default: "" },
        description: { type: String, default: "" },
        highlights: [
          {
            image: { type: String, required: true },
            title: { type: String, required: true },
          },
        ],
      },

      // Key Highlights Section
      keyHighlights: {
        backgroundImage: { type: String, default: "" },
        description: { type: String, default: "" },
        highlights: [
          {
            text: { type: String, required: true },
          },
        ],
      },

      // Modern Amenities Section
      modernAmenities: {
        title: {
          type: String,
          default: "MODERN AMENITIES FOR A BALANCED LIFESTYLE",
        },
        description: { type: String, default: "" },
        amenities: [
          {
            image: { type: String, required: true },
            title: { type: String, required: true },
          },
        ],
      },

      // Master Plan Section - Updated with tabs
      masterPlan: {
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        description: { type: String, default: "" },
        backgroundImage: { type: String, default: "" },
        tabs: [
          {
            title: { type: String, required: true },
            subtitle: { type: String, default: "" },
            subtitle2: { type: String, default: "" },
            image: { type: String, required: true },
          },
        ],
      },

      // Investment Plans Section
      investmentPlans: {
        title: { type: String, default: "LIMITED-TIME INVESTMENT PLANS" },
        description: {
          type: String,
          default:
            "Secure high returns with exclusive, time-sensitive opportunities.",
        },
        backgroundImage: { type: String, default: "" },
        plans: [
          {
            paymentPlan: { type: String, required: true },
            guaranteedReturn: { type: String, required: true },
            returnStartDate: { type: String, required: true },
          },
        ],
      },
// New Gateway Section
      gateway: {
        title: { type: String, default: "A place to come home to" },
        subtitle: { type: String, default: "and a location that" },
        highlightText: { type: String, default: "holds its value." },
        description: {
          type: String,
          default:
            "Set between Layan and Bangtao, this address offers more than scenery. It brings you close to Phuket's most lived-in stretch from cafés and golf courses to global schools and beach clubs.",
        },
        sectionTitle: { type: String, default: "Your Gateway to Paradise" },
        sectionDescription: {
          type: String,
          default:
            "Perfectly positioned where tropical elegance meets modern convenience, discover a world of luxury at your doorstep.",
        },
        backgroundImage: { type: String, default: "" },
        mapImage: { type: String, default: "" },
        categories: [
          {
            title: { type: String, required: true },
            description: { type: String, required: true },
            icon: { type: String, required: true },
            locations: [
              {
                name: { type: String, required: true },
                image: { type: String, required: true },
                coords: {
                  top: { type: String, required: true },
                  left: { type: String, required: true },
                },
                icon: { type: String, default: "/icons/map-pin.svg" },
              },
            ],
          },
        ],
      },
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
