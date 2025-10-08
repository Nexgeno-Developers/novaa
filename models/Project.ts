import mongoose from "mongoose";
import Category from "./Category"; // Import to ensure schema registration

// Function to generate slug from name
function generateSlug(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/[\s_-]+/g, "-") // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
}

const projectSchema = new mongoose.Schema(
  {
    // Existing basic fields
    name: { type: String, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
    }, // New slug field
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

    // Project detail fields (keeping existing structure)
    projectDetail: {
      // Hero Section
      hero: {
        backgroundImage: { type: String, default: "" },
        mediaType: {
          type: String,
          enum: ["image", "video", "vimeo"],
          default: "image",
        },
        vimeoUrl: { type: String, default: "" },
        title: { type: String, default: "" },
        subtitle: { type: String, default: "" },
        scheduleMeetingButton: { type: String, default: "Schedule a meeting" },
        getBrochureButton: { type: String, default: "Get Brochure" },
        brochurePdf: { type: String, default: "" },
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

      // Master Plan Section
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

      // Gateway Section
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
        // Main project location on the map
        mainProjectLocation: {
          title: { type: String, default: "" },
          description: { type: String, default: "" },
          icon: { type: String, default: "/icons/map-pin.svg" },
          coords: {
            x: { type: Number, default: 0 },
            y: { type: Number, default: 0 },
          },
        },
        // Curve lines connecting main project to gateway locations
        curveLines: [
          {
            id: { type: String, required: true },
            categoryId: { type: String, required: true },
            locationId: { type: String, required: true },
            svgPath: { type: String, required: true },
            color: { type: String, default: "#CDB04E" },
            thickness: { type: Number, default: 2 },
            dashPattern: [{ type: Number }],
          },
        ],
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
                // Add pixel coordinates for map editor
                pixelCoords: {
                  x: { type: Number, default: 0 },
                  y: { type: Number, default: 0 },
                },
                categoryId: { type: String, default: "" },
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

// Pre-save middleware to generate slug
projectSchema.pre("save", async function (next) {
  // Only generate slug if name is modified or it's a new document
  if (this.isModified("name") || this.isNew) {
    let baseSlug = generateSlug(this.name);
    let slug = baseSlug;
    let counter = 1;

    const Project = mongoose.model("Project");

    // Check for existing slugs and append number if needed
    while (true) {
      const existingProject = await Project.findOne({
        slug,
        _id: { $ne: this._id }, //Exclude current doc when editing
      });

      if (!existingProject) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    this.slug = slug;
  }
  next();
});

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
