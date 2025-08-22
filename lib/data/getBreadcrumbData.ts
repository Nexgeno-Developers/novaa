import dbConnect from '@/lib/mongodb';
import Breadcrumb from '@/models/Breadcrumb';
import { cache } from 'react'; // Use React's cache for deduplication

export const getBreadcrumbData = cache(async (slug: string) => {
  try {
    await dbConnect();
    const data = await Breadcrumb.findOne({ pageSlug: slug }).lean();

    if (!data) {
      // Return a default structure if nothing is found in the DB
      // This prevents errors on the page.
      return {
        _id: '',
        pageSlug: slug,
        title: `${slug.replace(/-/g, ' ')}`,
        description: 'Welcome to our page.',
        backgroundImageUrl: '/images/bg1.webp', // Default background
      };
    }
    // Mongoose's .lean() returns a plain object, but the _id is an ObjectId.
    // We stringify and parse to ensure it's a plain string for the client component.
    return JSON.parse(JSON.stringify(data));
  } catch (error) {
    console.error("Failed to get breadcrumb data:", error);
    return null;
  }
});