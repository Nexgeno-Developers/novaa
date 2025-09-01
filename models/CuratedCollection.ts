
import mongoose from 'mongoose';

const curatedCollectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    default: 'CURATED COLLECTION'
  },
  description: {
    type: String,
    required: true,
    default: 'Every property we list is handpicked, backed by deep research, developer due diligence, and real investment potential. If it\'s here, it\'s a home worth considering.'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export default mongoose.models.CuratedCollection || mongoose.model('CuratedCollection', curatedCollectionSchema);