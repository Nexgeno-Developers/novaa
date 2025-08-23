import mongoose from 'mongoose';

const LinkSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true
  },
  url: {
    type: String,
    default: '#'
  }
});

const SocialLinkSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ['whatsapp', 'facebook', 'instagram', 'twitter']
  },
  url: {
    type: String,
    default: '#'
  }
});

const FooterSchema = new mongoose.Schema({
  sectionId: {
    type: String,
    required: true,
    unique: true,
    default: 'footer-section'
  },
  bgImageOne: {
    type: String,
    default: '/footer/bg-one.png'
  },
  bgImageTwo: {
    type: String,
    default: '/footer/bg-two.png'
  },
  bgImageThree: {
    type: String,
    default: '/footer/bg-three.png'
  },
  tagline: {
    title: {
      type: String,
      default: 'YOUR DREAM HOME IN'
    },
    subtitle: {
      type: String,
      default: 'PHUKET AWAITS'
    },
    description: {
      type: String,
      default: "Live the island life you've always imagined - serene, luxurious, and yours to own."
    }
  },
  ctaButtonLines: {
    type: [String],
    default: ['Explore', 'Your Future', 'Home']
  },
  about: {
    title: {
      type: String,
      default: 'About Us'
    },
    description: {
      type: String,
      default: '<p>is simply dummy text of the printing and typesetting industry.</p>'
    }
  },
  quickLinks: {
    title: {
      type: String,
      default: 'Quick Links'
    },
    links: {
      type: [LinkSchema],
      default: [
        { label: 'Home', url: '/' },
        { label: 'Projects', url: '/project' },
        { label: 'About Us', url: '/about-us' },
        { label: 'Blog', url: '/blog' },
        { label: 'Contact Us', url: '/contact-us' }
      ]
    }
  },
  contact: {
    phone: {
      type: String,
      default: '+91 9867724223'
    },
    email: {
      type: String,
      default: 'karan@novaaglobal.com'
    }
  },
  socials: {
    title: {
      type: String,
      default: 'Follow on'
    },
    links: {
      type: [SocialLinkSchema],
      default: [
        { name: 'whatsapp', url: '#' },
        { name: 'facebook', url: '#' },
        { name: 'instagram', url: '#' },
        { name: 'twitter', url: '#' }
      ]
    }
  },
  copyrightText: {
    type: String,
    default: 'Copyright &copy; Novaa Real Estate | Designed by NEXGENO'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Footer = mongoose.models.Footer || mongoose.model('Footer', FooterSchema);

export default Footer;