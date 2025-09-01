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
  type: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
    default: 0,
  },
  pageSlug: {
    type: String,
    required: true,
  },
  component: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  settings: {
    isVisible: {
      type: Boolean,
      default: true,
    },
    backgroundColor: String,
    padding: String,
    margin: String,
    customCSS: String,
    animation: String,
  },
  content: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
}, {
  timestamps: true,
});

// Compound index for page sections
SectionSchema.index({ pageSlug: 1, order: 1 });
SectionSchema.index({ pageSlug: 1, slug: 1 }, { unique: true });

// Ensure slug is lowercase and URL-friendly
SectionSchema.pre('save', function() {
  if (this.isModified('slug')) {
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  }
});

export default mongoose.models.Section || mongoose.model('Section', SectionSchema);