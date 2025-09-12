import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import Project from '@/models/Project';
import Category from '@/models/Category';
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

export const getSectionData = async (pageSlug: string): Promise<SectionData[]> => {
  const getCachedSectionData = unstable_cache(
    async (): Promise<SectionData[]> => {
      try {
        await connectDB();

        // Fetch sections first
        const sections = await Section.find({ 
          pageSlug, 
          status: 'active',
          'settings.isVisible': true
        })
          .sort({ order: 1 })
          .lean();

        // Check if any section is a curated collection that might need fresh project data
        const hasCollectionSection = sections.some(section => section.type === 'collection');
        
        let sectionsWithFreshData = sections;

        // If we have a collection section and this is the home page, 
        // we might want to ensure the project data in the section content is fresh
        if (hasCollectionSection && pageSlug === 'home') {
          // For now, we'll just ensure the cache gets invalidated when projects change
          // The actual project data merging can be handled in the component or 
          // through section content updates in your CMS
          console.log('Home page has collection section - will invalidate when projects change');
        }

        return JSON.parse(JSON.stringify(sectionsWithFreshData));
      } catch (error) {
        console.error(`Failed to fetch ${pageSlug} page sections:`, error);
        return [];
      }
    },
    [`${pageSlug}-page-sections`],
    {
      // IMPORTANT: Include project and category tags so this cache gets invalidated
      // when project data changes from your CMS
      tags: [
        `${pageSlug}-sections`, 
        'sections', 
        'projects',      // Add this tag
        'categories'     // Add this tag
      ],
      revalidate: 3600,
    }
  );

  return getCachedSectionData();
};