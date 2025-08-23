import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';
import { cache } from 'react';

export const getContactData = cache(async () => {
  try {
    await dbConnect();
    
    let data = await Contact.findOne({ sectionId: 'contact-section' }).lean();
    
    if (!data) {
      // Create default contact data if it doesn't exist
      const newContact = new Contact({
        sectionId: 'contact-section'
      });
      await newContact.save();
      data = await Contact.findOne({ sectionId: 'contact-section' }).lean();
    }
    
    // Convert MongoDB document to a plain object and handle potential BSON types
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Failed to get contact data:", error);
    return null;
  }
});
