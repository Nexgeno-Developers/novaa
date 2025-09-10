import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Section from "@/models/Section";
import BlogCategory from "@/models/BlogCategory";
import { unstable_cache } from "next/cache";
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
  blogData: { blogData: any };
  createdAt: Date;
  updatedAt: Date;
}

const sectionComponentMap: {
  [key: string]: React.ComponentType<SectionContent>;
} = {
  breadcrumb: BreadcrumbsSection,
  blog: BlogSection,
};

// Create a cached version of the function
const getCachedBlogPageData = unstable_cache(
  async () => {
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
  },
  ["blog-page-sections"], // Cache key
  {
    tags: ["blog-sections", "sections", "blogs", "blog-categories"], // Cache tags for revalidation
    revalidate: 3600, // Revalidate every hour (fallback)
  }
);

async function getBlogPageData() {
  return getCachedBlogPageData();
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
