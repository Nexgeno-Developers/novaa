import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
  },
  pageSlug: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
    default: 1,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  type: {
  type: String,
  required: true,
},
  component: {
    type: String,
    required: true,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  settings: {
    backgroundColor: { type: String, default: '#ffffff' },
    textColor: { type: String, default: '#000000' },
    padding: { type: String, default: '60px' },
    margin: { type: String, default: '20px' },
    isVisible: { type: Boolean, default: true },
  },
  seo: {
    metaTitle: String,
    metaDescription: String,
    keywords: [String],
  },
}, {
  timestamps: true,
});

// Compound index for unique sections per page
SectionSchema.index({ pageSlug: 1, slug: 1 }, { unique: true });

export default mongoose.models.Section || mongoose.model('Section', SectionSchema);