import mongoose, { Document, Schema } from "mongoose";

// TypeScript interfaces
interface ILink {
  label: string;
  url: string;
}

interface ISocialLink {
  name:
    | "whatsapp"
    | "facebook"
    | "instagram"
    | "twitter"
    | "linkedin"
    | "snapchat"
    | "tiktok"
    | "youtube"
    | "telegram"
    | "pinterest"
    | "reddit"
    | "discord"
    | "tumblr"
    | "wechat";
  url: string;
}

interface IFooter extends Document {
  sectionId: string;
  bgImageOne: string;
  bgImageTwo: string;
  bgImageThree: string;
  tagline: {
    title: string;
    subtitle: string;
    description: string;
  };
  ctaButtonLines: string[];
  about: {
    title: string;
    description: string;
  };
  quickLinks: {
    title: string;
    links: mongoose.Types.DocumentArray<ILink>;
  };
  contact: {
    phone: string;
    email: string;
  };
  socials: {
    title: string;
    links: mongoose.Types.DocumentArray<ISocialLink>;
  };
  copyrightText: string;
  isActive: boolean;
}

const LinkSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    url: {
      type: String,
      default: "#",
      trim: true,
    },
  },
  { _id: true }
);

const SocialLinkSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: function(value: string) {
          const validPlatforms = [
            "whatsapp",
            "facebook", 
            "instagram",
            "twitter",
            "linkedin",
            "snapchat",
            "tiktok",
            "youtube",
            "telegram",
            "pinterest",
            "reddit",
            "discord",
            "tumblr",
            "wechat",
          ];
          return validPlatforms.includes(value);
        },
        message: 'Invalid social platform name'
      }
    },
    url: {
      type: String,
      default: "#",
      trim: true,
    },
  },
  { _id: true }
);

const FooterSchema = new mongoose.Schema(
  {
    sectionId: {
      type: String,
      required: true,
      unique: true,
      default: "footer-section",
    },
    bgImageOne: {
      type: String,
      default: "/footer/bg-one.png",
    },
    bgImageTwo: {
      type: String,
      default: "/footer/bg-two.png",
    },
    bgImageThree: {
      type: String,
      default: "/footer/bg-three.png",
    },
    tagline: {
      title: {
        type: String,
        default: "YOUR DREAM HOME IN",
        trim: true,
      },
      subtitle: {
        type: String,
        default: "PHUKET AWAITS",
        trim: true,
      },
      description: {
        type: String,
        default:
          "Live the island life you've always imagined - serene, luxurious, and yours to own.",
        trim: true,
      },
    },
    ctaButtonLines: {
      type: [String],
      default: ["Explore", "Your Future", "Home"],
    },
    about: {
      title: {
        type: String,
        default: "About Us",
        trim: true,
      },
      description: {
        type: String,
        default:
          "<p>is simply dummy text of the printing and typesetting industry.</p>",
        trim: true,
      },
    },
    quickLinks: {
      title: {
        type: String,
        default: "Quick Links",
        trim: true,
      },
      links: {
        type: [LinkSchema],
        default: [
          { label: "Home", url: "/" },
          { label: "Projects", url: "/project" },
          { label: "About Us", url: "/about-us" },
          { label: "Blog", url: "/blog" },
          { label: "Contact Us", url: "/contact-us" },
        ],
      },
    },
    contact: {
      phone: {
        type: String,
        default: "+91 9867724223",
        trim: true,
      },
      email: {
        type: String,
        default: "karan@novaaglobal.com",
        trim: true,
        lowercase: true,
      },
    },
    socials: {
      title: {
        type: String,
        default: "Follow on",
        trim: true,
      },
      links: {
        type: [SocialLinkSchema],
        default: [
          { name: "whatsapp", url: "#" },
          { name: "facebook", url: "#" },
          { name: "instagram", url: "#" },
          { name: "twitter", url: "#" },
        ],
      },
    },
    copyrightText: {
      type: String,
      default: "Copyright &copy; Novaa Real Estate | Designed by NEXGENO",
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Footer =
  mongoose.models.Footer || mongoose.model<IFooter>("Footer", FooterSchema);

export default Footer;
export type { IFooter, ILink, ISocialLink };