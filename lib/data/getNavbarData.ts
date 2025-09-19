import dbConnect from '@/lib/mongodb';
import Navbar from '@/models/Navbar';
import { unstable_cache } from 'next/cache';

// Create a cached version of the function
const getCachedNavbarData = unstable_cache(
  async () => {
    try {
      await dbConnect();
      
      let data = await Navbar.findOne().lean();
      if (!data) {
        // Create default navbar data
        const newNavbar = new Navbar({
          logo: {
            url: '/logo.png',
            alt: 'Novaa Logo'
          },
          items: [
            { label: 'Home', href: '/', order: 1, isActive: true },
            { label: 'Projects', href: '/project', order: 2, isActive: true },
            { label: 'About Us', href: '/about-us', order: 3, isActive: true },
            { label: 'Blog', href: '/blog', order: 4, isActive: true },
            { label: 'Contact Us', href: '/contact-us', order: 5, isActive: true }
          ]
        });
        await newNavbar.save();
        data = await Navbar.findOne().lean();
      }
      
      // Convert MongoDB document to plain object
      return JSON.parse(JSON.stringify(data));
    } catch (error) {
      console.error("Failed to get navbar data:", error);
      return null;
    }
  },
  ['navbar-data'], // Cache key
  {
    tags: ['navbar'], // Cache tag for revalidation
    revalidate: false, // Revalidate every hour (fallback)
  }
);

export const getNavbarData = getCachedNavbarData;