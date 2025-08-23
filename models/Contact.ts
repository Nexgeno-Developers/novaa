import mongoose, { Schema, Model, models } from "mongoose";

// Type for a single contact detail item
export interface IContactDetail {
  icon: string;
  title: string;
  description: string;
}

// Type for the main Contact document
export interface IContact {
  sectionId: string;
  details: IContactDetail[];
  formTitle: string;
  formDescription: string;
  formImage: string;
  mapImage: string;
}

// Sub-schema for details
const ContactDetailSchema = new Schema<IContactDetail>({
  icon: { type: String, default: "/images/phonenumber.svg" },
  title: { type: String, default: "Default Title" },
  description: { type: String, default: "Default Description" },
});

// Main schema
const ContactSchema = new Schema<IContact>(
  {
    sectionId: {
      type: String,
      unique: true,
      required: true,
      default: "contact-section",
    },
    details: { type: [ContactDetailSchema], default: [] },
    formTitle: {
      type: String,
      default:
        'We Would Love To Hear <br/><span class="text-[#CDB04E]">From You</span>',
    },
    formDescription: {
      type: String,
      default:
        "Feel free to reach out with any questions or feedback — we are here to help!",
    },
    formImage: { type: String, default: "/images/contact-form-image.webp" },
    mapImage: { type: String, default: "/images/map.webp" },
  },
  { timestamps: true }
);

// Pre-save hook to ensure default 3 detail items
ContactSchema.pre("save", function (next) {
  if (this.isNew && this.details.length === 0) {
    this.details.push(
      {
        icon: "/images/phonenumber.svg",
        title: "Phone Number",
        description: "+91 9867724223",
      },
      {
        icon: "/images/emailid.svg",
        title: "Email ID",
        description: "karan@novaaglobal.com",
      },
      {
        icon: "/images/location1.svg",
        title: "Location",
        description: "Company address - Bandra West , Mumbai",
      }
    );
  }
  next();
});

// Avoid model overwrite in Next.js
const Contact: Model<IContact> =
  models.Contact || mongoose.model<IContact>("Contact", ContactSchema);

export default Contact;