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
}, {
  timestamps: true,
});

export default mongoose.models.Page || mongoose.model('Page', PageSchema);