import dbConnect from '@/lib/mongodb';
import Footer from '@/models/Footer';
import { unstable_noStore as noStore } from 'next/cache';


export const getFooterData = async () => {
    noStore();

  try {
    await dbConnect();
    
    let data = await Footer.findOne({ sectionId: 'footer-section' }).lean();
    if (!data) {
      // Create default footer data
      const newFooter = new Footer({
        sectionId: 'footer-section'
      });
      await newFooter.save();
      data = await Footer.findOne({ sectionId: 'footer-section' }).lean();
    }
    
    // Convert MongoDB document to plain object
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Failed to get footer data:", error);
    return null;
  }
};