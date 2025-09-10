
import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import { unstable_cache } from 'next/cache';

// Define the Section interface based on your Mongoose model
interface SectionData {
  _id: string;
  name: string;
  slug: string;
  type: string;
  order: number;
  pageSlug: string;
  component: string;
  status: 'active' | 'inactive';
  settings: {
    isVisible: boolean;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    customCSS?: string;
    animation?: string;
  };
  content: {
    [key: string]: unknown; // Mixed type from Mongoose
  };
  createdAt: Date;
  updatedAt: Date;
}

// Create a reusable cached function for fetching page sections
// export const getSectionData = (pageSlug: string) => {
//   const getCachedSectionData = unstable_cache(
//     async (): Promise<SectionData[]> => {
//       try {
//         await connectDB();

//         // Fetch all active sections for the specified page and SORT them by the 'order' field.
//         const sections = await Section.find({ 
//           pageSlug, 
//           status: 'active',
//           'settings.isVisible': true // Only get visible sections
//         })
//           .sort({ order: 1 })
//           .lean(); // .lean() improves performance

//         return JSON.parse(JSON.stringify(sections));
//       } catch (error) {
//         console.error(`Failed to fetch ${pageSlug} page sections:`, error);
//         return [];
//       }
//     },
//     [`${pageSlug}-page-sections`], // Cache key
//     {
//       tags: [`${pageSlug}-sections`, 'sections'], // Cache tags for revalidation
//       revalidate: 3600, // Revalidate every hour (fallback)
//     }
//   );

//   return getCachedSectionData;
// };

export const getSectionData = async (pageSlug: string): Promise<SectionData[]> => {
  const getCachedSectionData = unstable_cache(
    async (): Promise<SectionData[]> => {
      try {
        await connectDB();

        const sections = await Section.find({ 
          pageSlug, 
          status: 'active',
          'settings.isVisible': true
        })
          .sort({ order: 1 })
          .lean();

        return JSON.parse(JSON.stringify(sections));
      } catch (error) {
        console.error(`Failed to fetch ${pageSlug} page sections:`, error);
        return [];
      }
    },
    [`${pageSlug}-page-sections`],
    {
      tags: [`${pageSlug}-sections`, 'sections'],
      revalidate: 3600,
    }
  );

  return getCachedSectionData();
};
