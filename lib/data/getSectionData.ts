// import connectDB from '@/lib/mongodb';
// import Section from '@/models/Section';
// import { unstable_cache } from 'next/cache';

// // Define the Section interface based on your Mongoose model
// interface SectionData {
//   _id: string;
//   name: string;
//   slug: string;
//   type: string;
//   order: number;
//   pageSlug: string;
//   component: string;
//   status: 'active' | 'inactive';
//   settings: {
//     isVisible: boolean;
//     backgroundColor?: string;
//     padding?: string;
//     margin?: string;
//     customCSS?: string;
//     animation?: string;
//   };
//   content: {
//     [key: string]: unknown;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// }

// export const getSectionData = async (pageSlug: string): Promise<SectionData[]> => {
//   const getCachedSectionData = unstable_cache(
//     async (): Promise<SectionData[]> => {
//       try {
//         await connectDB();

//         const sections = await Section.find({
//           pageSlug,
//           status: 'active',
//           'settings.isVisible': true
//         })
//           .sort({ order: 1 })
//           .lean();

//         return JSON.parse(JSON.stringify(sections));
//       } catch (error) {
//         console.error(`Failed to fetch ${pageSlug} page sections:`, error);
//         return [];
//       }
//     },
//     [`${pageSlug}-page-sections`],
//     {
//       // Include project-related cache tags for pages that have curated collections
//       tags: pageSlug === 'home'
//         ? [`${pageSlug}-sections`, 'sections', 'projects', 'categories']
//         : [`${pageSlug}-sections`, 'sections'],
//       revalidate: 3600,
//     }
//   );

//   return getCachedSectionData();
// };

// import connectDB from '@/lib/mongodb';
// import Section from '@/models/Section';
// import Project from '@/models/Project';
// import Category from '@/models/Category';
// import { unstable_cache } from 'next/cache';

// interface SectionData {
//   _id: string;
//   name: string;
//   slug: string;
//   type: string;
//   order: number;
//   pageSlug: string;
//   component: string;
//   status: 'active' | 'inactive';
//   settings: {
//     isVisible: boolean;
//     backgroundColor?: string;
//     padding?: string;
//     margin?: string;
//     customCSS?: string;
//     animation?: string;
//   };
//   content: {
//     [key: string]: unknown;
//   };
//   createdAt: Date;
//   updatedAt: Date;
// }

// export const getSectionData = async (pageSlug: string): Promise<SectionData[]> => {
//   const getCachedSectionData = unstable_cache(
//     async (): Promise<SectionData[]> => {
//       try {
//         await connectDB();

//         const sections = await Section.find({
//           pageSlug,
//           status: 'active',
//           'settings.isVisible': true
//         })
//           .sort({ order: 1 })
//           .lean();

//         // If this is home page and has curated collection, fetch fresh project data
//         const sectionsWithFreshData = await Promise.all(
//           sections.map(async (section) => {
//             if (section.type === 'collection' && pageSlug === 'home') {
//               // Fetch fresh project and category data
//               const [categories, projects] = await Promise.all([
//                 Category.find({ isActive: true }).sort({ order: 1 }).lean(),
//                 Project.find({ isActive: true })
//                   .populate('category')
//                   .sort({ order: 1 })
//                   .lean(),
//               ]);

//               // Get the original curated items configuration from section content
//               const originalItems = section.content.items || {};

//               // Create fresh items object with updated project data
//               const freshItems: Record<string, any[]> = {};

//               // For each category in the original curated selection
//               Object.keys(originalItems).forEach(categoryId => {
//                 const originalProjectIds = originalItems[categoryId]?.map((p: any) => p._id) || [];

//                 // Get fresh project data for these IDs
//                 const freshCategoryProjects = projects.filter((project : any) =>
//                   originalProjectIds.includes(project._id.toString()) && project.isActive
//                 );

//                 // Only include category if it has active projects
//                 if (freshCategoryProjects.length > 0) {
//                   freshItems[categoryId] = freshCategoryProjects;
//                 }
//               });

//               // Return section with fresh project data
//               return {
//                 ...section,
//                 content: {
//                   ...section.content,
//                   items: freshItems, // Replace with fresh data
//                   _categories: categories, // Add fresh categories for reference
//                   _projects: projects, // Add all fresh projects for reference
//                 }
//               };
//             }

//             return section;
//           })
//         );

//         return JSON.parse(JSON.stringify(sectionsWithFreshData));
//       } catch (error) {
//         console.error(`Failed to fetch ${pageSlug} page sections:`, error);
//         return [];
//       }
//     },
//     [`${pageSlug}-page-sections`],
//     {
//       // Include project-related cache tags for pages that have curated collections
//       tags: pageSlug === 'home'
//         ? [`${pageSlug}-sections`, 'sections', 'projects', 'categories']
//         : [`${pageSlug}-sections`, 'sections'],
//       revalidate: 3600,
//     }
//   );

//   return getCachedSectionData();
// };

import connectDB from "@/lib/mongodb";
import Section from "@/models/Section";
import Project from "@/models/Project";
import Category from "@/models/Category";
import { unstable_cache } from "next/cache";

interface SectionData {
  _id: string;
  name: string;
  slug: string;
  type: string;
  order: number;
  pageSlug: string;
  component: string;
  status: "active" | "inactive";
  settings: {
    isVisible: boolean;
    backgroundColor?: string;
    padding?: string;
    margin?: string;
    customCSS?: string;
    animation?: string;
  };
  content: {
    [key: string]: unknown;
  };
  createdAt: Date;
  updatedAt: Date;
}

export const getSectionData = async (
  pageSlug: string
): Promise<SectionData[]> => {
  const getCachedSectionData = unstable_cache(
    async (): Promise<SectionData[]> => {
      try {
        await connectDB();

        const sections = await Section.find({
          pageSlug,
          status: "active",
          "settings.isVisible": true,
        })
          .sort({ order: 1 })
          .lean();

        // If this is home page and has curated collection, fetch fresh project data
        const sectionsWithFreshData = await Promise.all(
          sections.map(async (section) => {
            if (section.type === "collection" && pageSlug === "home") {
              // Fetch fresh project and category data
              const [categories, projects] = await Promise.all([
                Category.find({ isActive: true }).sort({ order: 1 }).lean(),
                Project.find({ isActive: true })
                  .populate("category")
                  .sort({ order: 1 })
                  .lean(),
              ]);

              // Get the original curated items configuration from section content
              const originalItems = section.content.items || {};

              // Create fresh items object with updated project data
              const freshItems: Record<string, any[]> = {};

              // console.log('Original curated items:', originalItems);
              // console.log('Available categories:', categories.map(c => ({ id: c._id, name: c.name })));

              // For each category in the original curated selection
              Object.keys(originalItems).forEach((categoryId) => {
                const originalCategoryProjects =
                  originalItems[categoryId] || [];
                const originalProjectIds = originalCategoryProjects.map(
                  (p: any) => p._id?.toString() || p.toString()
                );

                // console.log(`Processing category ${categoryId}:`, {
                //   originalProjectCount: originalCategoryProjects.length,
                //   originalProjectIds
                // });

                // Get fresh project data for these IDs
                const freshCategoryProjects = projects.filter(
                  (project: any) =>
                    originalProjectIds.includes(project._id.toString()) &&
                    project.isActive
                );

                // console.log(`Fresh projects found for category ${categoryId}:`, freshCategoryProjects.length);

                // Include category even if no projects to preserve the structure
                // This prevents categories from disappearing
                freshItems[categoryId] = freshCategoryProjects;
              });

              // Return section with fresh project data
              return {
                ...section,
                content: {
                  ...section.content,
                  items: freshItems,
                  _categories: categories,
                  _projects: projects,
                },
              };
            }

            return section;
          })
        );

        return JSON.parse(JSON.stringify(sectionsWithFreshData));
      } catch (error) {
        console.error(`Failed to fetch ${pageSlug} page sections:`, error);
        return [];
      }
    },
    [`${pageSlug}-page-sections`],
    {
      // Include project-related cache tags for pages that have curated collections
      tags:
        pageSlug === "home"
          ? [`${pageSlug}-sections`, "sections", "projects", "categories"]
          : [`${pageSlug}-sections`, "sections"],
      revalidate: false,
    }
  );

  return getCachedSectionData();
};
