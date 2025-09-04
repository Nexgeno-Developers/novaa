// import connectDB from '@/lib/mongodb';
// import Section from '@/models/Section';
// import BreadcrumbsSection from '@/components/client/BreadcrumbsSection';
// import BlogSection from '@/components/client/BlogSection';

// const sectionComponentMap: { [key: string]: React.ComponentType<any> } = {
//   breadcrumb: BreadcrumbsSection,
//   blog: BlogSection, // Add the blog section component
//   // Add more Blog section components as needed
// };

// async function getBlogPageData() {
//   try {
//     await connectDB();

//     // Fetch all active sections for the 'blog' page and sort them by order
//     const sections = await Section.find({
//       pageSlug: 'blog',
//       status: 'active',
//       'settings.isVisible': true  // Only fetch visible sections
//     })
//       .sort({ order: 1 })
//       .lean();

//     return sections;
//   } catch (error) {
//     console.error("Failed to fetch blog page data:", error);
//     return [];
//   }
// }

// export default async function BlogPage() {
//   const sections = await getBlogPageData();

//   console.log("Blog Sections:", sections);

//   if (!sections || sections.length === 0) {
//     return (
//       <main className="flex items-center justify-center h-screen">
//         <p>Blog content is not configured yet.</p>
//       </main>
//     );
//   }

//   return (
//     <main className="relative">
//       {sections.map(section => {
//         const Component = sectionComponentMap[section.type] || sectionComponentMap[section.slug];
//         // If a component is found, render it. Otherwise, render nothing.
//         return Component ? <Component key={section._id} {...section.content} pageSlug={section.pageSlug} /> : null;
//       })}
//     </main>
//   );
// }
import connectDB from "@/lib/mongodb";
import Section from "@/models/Section";
import Blog from "@/models/Blog"; // Import your Blog model
import BlogCategory from "@/models/BlogCategory"; // Import your BlogCategory model
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
import BlogSection from "@/components/client/BlogSection";
import CategoriesPage from "@/app/admin/categories/page";

const sectionComponentMap: { [key: string]: React.ComponentType<any> } = {
  breadcrumb: BreadcrumbsSection,
  blog: BlogSection,
};

async function getBlogPageData() {
  try {
    await connectDB();

    // Fetch sections, blog categories, and blogs in parallel
    const [sections, blogCategories, blogs] = await Promise.all([
      Section.find({
        pageSlug: "blog",
        status: "active",
        "settings.isVisible": true,
      })
        .sort({ order: 1 })
        .lean(),

      BlogCategory.find({ isActive: true }).sort({ order: 1 }).lean(),

      Blog.find({ isActive: true })
        .populate("category")
        .populate("author")
        .sort({ createdAt: -1 })
        .limit(6) // maxBlogs
        .lean(),
    ]);

    // console.log("sections , blogs and blogs categories ", blogs)
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

    return sectionsWithData;
  } catch (error) {
    console.error("Failed to fetch blog page data:", error);
    return [];
  }
}

export default async function BlogPage() {
  const sections = await getBlogPageData();

  // console.log("Blog Sections:", sections);

  if (!sections || sections.length === 0) {
    return (
      <main className="flex items-center justify-center h-screen">
        <p>Blog content is not configured yet.</p>
      </main>
    );
  }

  return (
    <main className="relative">
      {sections.map((section) => {
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
