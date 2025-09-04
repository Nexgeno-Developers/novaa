import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema({
  // Existing basic fields
  name: { type: String, required: true },
  price: { type: String, required: true },
  images: [{ type: String, required: true }],
  location: { type: String, required: true },
  description: { type: String, required: true },
  badge: { type: String, default: '' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  categoryName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },

  // New project detail fields
  projectDetail: {
    // Hero Section
    hero: {
      backgroundImage: { type: String, default: '' },
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      scheduleMeetingButton: { type: String, default: 'Schedule a meeting' },
      getBrochureButton: { type: String, default: 'Get Brochure' },
      brochurePdf: { type: String, default: '' } // PDF file URL
    },

    // Project Highlights Section
    projectHighlights: {
      backgroundImage: { type: String, default: '' },
      description: { type: String, default: '' },
      highlights: [{
        image: { type: String, required: true },
        title: { type: String, required: true }
      }]
    },

    // Key Highlights Section
    keyHighlights: {
      backgroundImage: { type: String, default: '' },
      description: { type: String, default: '' },
      highlights: [{
        text: { type: String, required: true }
      }]
    },

    // Modern Amenities Section
    modernAmenities: {
      title: { type: String, default: 'MODERN AMENITIES FOR A BALANCED LIFESTYLE' },
      description: { type: String, default: '' },
      amenities: [{
        image: { type: String, required: true },
        title: { type: String, required: true }
      }]
    },

    // Master Plan Section - Updated with tabs
    masterPlan: {
      title: { type: String, default: '' },
      subtitle: { type: String, default: '' },
      description: { type: String, default: '' },
      backgroundImage: { type: String, default: '' },
      tabs: [{
        title: { type: String, required: true },
        subtitle: { type: String, default: '' },
        subtitle2: { type: String, default: '' },
        image: { type: String, required: true }
      }]
    },

    // Investment Plans Section - New
    investmentPlans: {
      title: { type: String, default: 'LIMITED-TIME INVESTMENT PLANS' },
      description: { type: String, default: 'Secure high returns with exclusive, time-sensitive opportunities.' },
      backgroundImage: { type: String, default: '' },
      plans: [{
        paymentPlan: { type: String, required: true },
        guaranteedReturn: { type: String, required: true },
        returnStartDate: { type: String, required: true }
      }]
    }
  }
}, { 
  timestamps: true 
});

export default mongoose.models.Project || mongoose.model('Project', projectSchema);