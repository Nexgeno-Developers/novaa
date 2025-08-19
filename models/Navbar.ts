import mongoose from 'mongoose';

const NavbarItemSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  href: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const NavbarSchema = new mongoose.Schema({
  logo: {
    url: String,
    alt: String,
  },
  items: [NavbarItemSchema],
}, {
  timestamps: true,
});

export default mongoose.models.Navbar || mongoose.model('Navbar', NavbarSchema);