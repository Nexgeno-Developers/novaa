// import connectDB from "@/lib/mongodb";
// import Blog from "@/models/Blog";
// import Section from "@/models/Section";
// import BlogCategory from "@/models/BlogCategory";
// import { unstable_cache } from "next/cache";
// import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
// import BlogSection from "@/components/client/BlogSection";

// interface SectionContent {
//   [key: string]: unknown;
// }

// interface Section {
//   _id: string;
//   name: string;
//   slug: string;
//   type: string;
//   order: number;
//   pageSlug: string;
//   component: string;
//   status: "active" | "inactive";
//   settings: {
//     isVisible: boolean;
//     backgroundColor?: string;
//     padding?: string;
//     margin?: string;
//     customCSS?: string;
//     animation?: string;
//   };
//   content: SectionContent;
//   blogData: { blogData: any };

//   createdAt: Date;
//   updatedAt: Date;
// }

// const sectionComponentMap: {
//   [key: string]: React.ComponentType<SectionContent>;
// } = {
//   breadcrumb: BreadcrumbsSection,
//   blog: BlogSection,
// };

// // Create a cached version of the function
// const getCachedBlogPageData = unstable_cache(
//   async () => {
//     try {
//       await connectDB();

//       // Fetch sections first to get blog section configuration
//       const sections = await Section.find({
//         pageSlug: "blog",
//         status: "active",
//         "settings.isVisible": true,
//       })
//         .sort({ order: 1 })
//         .lean();

//       // Find blog section to get its configuration
//       const blogSection = sections.find(section => section.type === "blog");
      
//       // Get initial blog limit from section content or default to 10
//       const initialBlogLimit = blogSection?.content?.initialBlogs || 10;

//       // Fetch blog categories and blogs in parallel
//       const [blogCategories, blogs] = await Promise.all([
//         BlogCategory.find({ isActive: true }).sort({ order: 1 }).lean(),

//         Blog.find({ isActive: true })
//           .populate("category")
//           .populate("author")
//           .sort({ createdAt: -1 })
//           .limit(initialBlogLimit) // Use configured initial limit
//           .lean(),
//       ]);

//       // Attach blog data to blog sections
//       const sectionsWithData = sections.map((section) => {
//         if (section.type === "blog") {
//           // Process blogs to ensure they have the required fields
//           const processedBlogs = blogs.map((blog) => ({
//             ...blog,
//             categoryName: blog.category?.title || "Uncategorized",
//             // Set default author if not present
//             author: blog.author || {
//               name: "Admin",
//               avatar: "/default-avatar.png",
//             },
//           }));

//           return {
//             ...section,
//             blogData: {
//               categories: blogCategories,
//               blogs: processedBlogs,
//             },
//           };
//         }
//         return section;
//       });

//       return JSON.parse(JSON.stringify(sectionsWithData));
//     } catch (error) {
//       console.error("Failed to fetch blog page data:", error);
//       return [];
//     }
//   },
//   ["blog-page-sections"], // Cache key
//   {
//     tags: ["blog-sections", "sections", "blogs", "blog-categories"], // Cache tags for revalidation
//     revalidate: false,
//   }
// );

// async function getBlogPageData() {
//   return getCachedBlogPageData();
// }

// export default async function BlogPage() {
//   const sections = await getBlogPageData();

//   // console.log("Blog Sections:", sections);

//   if (!sections || sections.length === 0) {
//     return (
//       <main className="flex items-center justify-center h-screen">
//         <p>Blog content is not configured yet.</p>
//       </main>
//     );
//   }

//   return (
//     <main className="relative">
//       {sections.map((section: Section) => {
//         const Component =
//           sectionComponentMap[section.type] ||
//           sectionComponentMap[section.slug];

//         // Pass blog data as props if available
//         const componentProps = {
//           ...section.content,
//           pageSlug: section.pageSlug,
//           ...(section.blogData && { blogData: section.blogData }),
//         };

//         return Component ? (
//           <Component key={section._id} {...componentProps} />
//         ) : null;
//       })}
//     </main>
//   );
// }


// app/(public)/blog/page.tsx

import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Section from "@/models/Section";
import BlogCategory from "@/models/BlogCategory";
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
import BlogSection from "@/components/client/BlogSection";

interface SectionContent {
  [key: string]: unknown;
}

interface Section {
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
  content: SectionContent;
  blogData?: { 
    categories: any;
    blogs: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const sectionComponentMap: {
  [key: string]: React.ComponentType<SectionContent>;
} = {
  breadcrumb: BreadcrumbsSection,
  blog: BlogSection,
};

// Direct database query without unstable_cache
async function getBlogPageData() {
  try {
    await connectDB();

    // Fetch sections first to get blog section configuration
    const sections = await Section.find({
      pageSlug: "blog",
      status: "active",
      "settings.isVisible": true,
    })
      .sort({ order: 1 })
      .lean();

    // Find blog section to get its configuration
    const blogSection = sections.find(section => section.type === "blog");
    
    // Get initial blog limit from section content or default to 10
    const initialBlogLimit = blogSection?.content?.initialBlogs || 10;

    // Fetch blog categories and blogs in parallel
    const [blogCategories, blogs] = await Promise.all([
      BlogCategory.find({ isActive: true }).sort({ order: 1 }).lean(),

      Blog.find({ isActive: true })
        .populate("category")
        .populate("author")
        .sort({ createdAt: -1 })
        .limit(initialBlogLimit)
        .lean(),
    ]);

    // Attach blog data to blog sections
    const sectionsWithData = sections.map((section) => {
      if (section.type === "blog") {
        // Process blogs to ensure they have the required fields
        const processedBlogs = blogs.map((blog) => ({
          ...blog,
          categoryName: blog.category?.title || "Uncategorized",
          // Set default author if not present
          author: blog.author || {
            name: "Admin",
            avatar: "/default-avatar.png",
          },
        }));

        return {
          ...section,
          blogData: {
            categories: blogCategories,
            blogs: processedBlogs,
          },
        };
      }
      return section;
    });

    return JSON.parse(JSON.stringify(sectionsWithData));
  } catch (error) {
    console.error("Failed to fetch blog page data:", error);
    return [];
  }
}

export default async function BlogPage() {
  const sections = await getBlogPageData();

  if (!sections || sections.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Blog content is not configured yet.</p>
      </main>
    );
  }

  return (
    <main className="relative">
      {sections.map((section: Section) => {
        const Component =
          sectionComponentMap[section.type] ||
          sectionComponentMap[section.slug];

        // Pass blog data as props if available
        const componentProps = {
          ...section.content,
          pageSlug: section.pageSlug,
          ...(section.blogData && { blogData: section.blogData }),
        };

        return Component ? (
          <Component key={section._id} {...componentProps} />
        ) : null;
      })}
    </main>
  );
}

// Enable ISR with automatic revalidation every 60 seconds
export const revalidate = 60;