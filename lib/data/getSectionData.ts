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

        // Check if any section is a curated collection that needs fresh project data
        const hasCollectionSection = sections.some(section => section.type === 'collection');
        
        let sectionsWithFreshData = sections;

        // If we have a collection section, fetch fresh project data and merge it
        if (hasCollectionSection) {
          try {
            // Fetch fresh project and category data
            const [categories, projects] = await Promise.all([
              Category.find({ isActive: true }).sort({ order: 1 }).lean(),
              Project.find({ isActive: true })
                .populate('category')
                .sort({ order: 1 })
                .lean(),
            ]);

            // Group projects by category for the collection
            const projectsByCategory: Record<string, any[]> = {};
            projects.forEach((project) => {
              const categoryId = project.category._id.toString();
              if (!projectsByCategory[categoryId]) {
                projectsByCategory[categoryId] = [];
              }
              projectsByCategory[categoryId].push(project);
            });

            // Update collection sections with fresh project data
            sectionsWithFreshData = sections.map(section => {
              if (section.type === 'collection') {
                return {
                  ...section,
                  content: {
                    ...section.content,
                    // Merge fresh project data into the section content
                    items: projectsByCategory,
                    categories: categories,
                    projects: projects,
                    // Keep the original CMS content (title, description, etc.)
                  }
                };
              }
              return section;
            });

            console.log('Updated collection section with fresh project data');
          } catch (projectError) {
            console.error('Failed to fetch fresh project data:', projectError);
            // Continue with original sections if project fetch fails
          }
        }

        return JSON.parse(JSON.stringify(sectionsWithFreshData));
      } catch (error) {
        console.error(`Failed to fetch ${pageSlug} page sections:`, error);
        return [];
      }
    },
    [`${pageSlug}-page-sections`],
    {
      // Include project and category tags so this cache gets invalidated
      // when project data changes from CMS
      tags: [
        `${pageSlug}-sections`, 
        'sections', 
        'projects',     
        'categories'
      ],
      revalidate: 3600,
    }
  );

  return getCachedSectionData();
};