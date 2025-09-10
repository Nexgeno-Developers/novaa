import dbConnect from '@/lib/mongodb';
import Footer from '@/models/Footer';
import { unstable_cache } from 'next/cache';

// Create a cached version of the function
const getCachedFooterData = unstable_cache(
  async () => {
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
  },
  ['footer-data'], // Cache key
  {
    tags: ['footer'], // Cache tag for revalidation
    revalidate: 3600, // Revalidate every hour (fallback)
  }
);

export const getFooterData = getCachedFooterData;