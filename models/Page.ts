import mongoose from 'mongoose';

const PageSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  template: {
    type: String,
    default: 'default',
  },
  metaTitle: String,
  metaDescription: String,
  keywords: [String],
  order: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Ensure slug is lowercase and URL-friendly
PageSchema.pre('save', function() {
  if (this.isModified('slug')) {
    this.slug = this.slug.toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-');
  }
});

export default mongoose.models.Page || mongoose.model('Page', PageSchema);