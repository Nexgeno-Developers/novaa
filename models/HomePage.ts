// models/HomePage.ts
import mongoose from 'mongoose';

interface HighlightedWord {
  word: string;
  style: {
    color?: string;
    fontWeight?: string;
    textDecoration?: string;
    background?: string; // For gradient backgrounds
    fontFamily?: string;
    fontSize?: string;
    fontStyle?: string;
  };
}

interface CtaButton {
  text: string;
  href: string;
  isActive: boolean;
}

interface HeroSection {
  mediaType: 'image' | 'video';
  mediaUrl: string;
  title: string;
  subtitle?: string;
  highlightedWords?: HighlightedWord[];
  ctaButton?: CtaButton;
  overlayOpacity?: number;
  overlayColor?: string;
  titleFontFamily?: string;
  subtitleFontFamily?: string;
}

interface IHomePage {
  heroSection: HeroSection;
  updatedAt: Date;
}

const highlightedWordSchema = new mongoose.Schema({
  word: { type: String, required: true },
  style: {
    color: { type: String, default: '#3B82F6' },
    fontWeight: { type: String, default: 'bold' },
    textDecoration: { type: String, default: '' },
    background: { type: String, default: '' }, // For gradients
    fontFamily: { type: String, default: '' },
    fontSize: { type: String, default: '' },
    fontStyle: { type: String, default: 'normal' },
  }
});

const ctaButtonSchema = new mongoose.Schema({
  text: { type: String, required: true },
  href: { type: String, required: true },
  isActive: { type: Boolean, default: true }
});

const heroSectionSchema = new mongoose.Schema({
  mediaType: { type: String, enum: ['image', 'video'], default: 'image' },
  mediaUrl: { type: String, required: true },
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  highlightedWords: [highlightedWordSchema],
  ctaButton: ctaButtonSchema,
  overlayOpacity: { type: Number, default: 0.4, min: 0, max: 1 },
  overlayColor: { type: String, default: '#000000' },
  titleFontFamily: { type: String, default: 'font-cinzel' },
  subtitleFontFamily: { type: String, default: 'font-cinzel' },
   titleFontSize: {
      type: String,
      default: 'text-3xl md:text-5xl'
    },
    subtitleFontSize: {
      type: String,
      default: 'text-xl md:text-3xl'
    },
    // Add these gradient fields
    titleGradient: {
      type: String,
      default: 'none'
    },
    subtitleGradient: {
      type: String,
      default: 'none'
    }
});

const homePageSchema = new mongoose.Schema({
  heroSection: heroSectionSchema,
  updatedAt: { type: Date, default: Date.now }
});

homePageSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

const HomePage = mongoose.models.HomePage || mongoose.model<IHomePage>('HomePage', homePageSchema);

export default HomePage;