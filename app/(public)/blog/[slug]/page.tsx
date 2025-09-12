import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Section from "@/models/Section";
import { unstable_cache } from "next/cache";
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
import BlogDetailClient from "@/components/client/BlogDetailClient";

// Create cached functions for blog data
const getCachedBlogBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      try {
        await connectDB();

        console.log("Fetching blog with slug:", slug);

        const blog = await Blog.findOne({ slug, isActive: true })
          .populate("category", "title slug")
          .populate("author", "name avatar")
          .lean(); // Add .lean() for better performance

        console.log("Blog found:", !!blog);

        if (!blog) {
          console.log("Blog not found with slug:", slug);
          return null;
        }

        // Get related blogs from the same category
        const relatedBlogs = await Blog.find({
          category: (blog as any)?.category?._id,
          _id: { $ne: (blog as any)._id },
          isActive: true,
        })
          .populate("category", "title slug")
          .populate("author", "name avatar")
          .sort({ createdAt: -1 })
          .limit(4)
          .lean(); // Add .lean() for better performance

        // Convert all BSON/ObjectId fields into plain strings
        const updatedBlog = JSON.parse(JSON.stringify(blog));
        const updatedRelatedBlogs = JSON.parse(JSON.stringify(relatedBlogs));

        // Ensure categoryName is set (in case it's not in the database)
        if (updatedBlog.category && !updatedBlog.categoryName) {
          updatedBlog.categoryName = updatedBlog.category.title;
        }

        // Ensure categoryName is set for related blogs
        updatedRelatedBlogs.forEach(
          (relatedBlog: {
            category: { title: string };
            categoryName: string;
          }) => {
            if (relatedBlog.category && !relatedBlog.categoryName) {
              relatedBlog.categoryName = relatedBlog.category.title;
            }
          }
        );

        console.log("Blog data processed successfully");
        return { updatedBlog, updatedRelatedBlogs };
      } catch (error) {
        console.error("Error fetching blog:", error);
        return null;
      }
    },
    [`blog-detail-${slug}`], // Cache key
    {
      tags: ["blogs", `blog-${slug}`, "blog-categories"], // Cache tags for revalidation
      revalidate: 3600, // Revalidate every hour (fallback)
    }
  );

// Create cached function for breadcrumb data
const getCachedBreadcrumbData = unstable_cache(
  async () => {
    try {
      await connectDB();

      const breadcrumbSection = await Section.findOne({
        pageSlug: "blog",
        type: "breadcrumb",
        status: "active",
        "settings.isVisible": true,
      }).lean(); // Add .lean() for better performance

      return JSON.parse(JSON.stringify(breadcrumbSection));
    } catch (error) {
      console.error("Error fetching breadcrumb data:", error);
      return null;
    }
  },
  ["blog-breadcrumb-data"], // Cache key
  {
    tags: ["blog-sections", "sections"], // Cache tags for revalidation
    revalidate: 3600, // Revalidate every hour (fallback)
  }
);

async function getBlogBySlug(slug: string) {
  try {
    const cachedFunction = getCachedBlogBySlug(slug);
    const result = await cachedFunction();

    // Increment view count (this should not be cached)
    if (result?.updatedBlog) {
      try {
        await connectDB();
        await Blog.findByIdAndUpdate(result.updatedBlog._id, {
          $inc: { views: 1 },
        });
      } catch (error) {
        console.error("Error incrementing view count:", error);
        // Don't fail the request if view count update fails
      }
    }

    return result;
  } catch (error) {
    console.error("Error in getBlogBySlug:", error);
    return null;
  }
}

async function getBreadcrumbData() {
  try {
    return await getCachedBreadcrumbData();
  } catch (error) {
    console.error("Error in getBreadcrumbData:", error);
    return null;
  }
}

// generateStaticParams for better production performance
export async function generateStaticParams() {
  try {
    await connectDB();
    const blogs = await Blog.find({ isActive: true }).select("slug").lean();

    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error("Error generating static params:", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;
    const result = await getBlogBySlug(slug);

    if (!result?.updatedBlog) {
      return {
        title: "Blog Not Found",
        description: "The requested blog post could not be found.",
      };
    }

    const { updatedBlog } = result;

    return {
      title: updatedBlog.seo?.metaTitle || updatedBlog.title,
      description: updatedBlog.seo?.metaDescription || updatedBlog.description,
      keywords:
        updatedBlog.seo?.keywords?.join(", ") || updatedBlog.tags?.join(", "),
      openGraph: {
        title: updatedBlog.title,
        description: updatedBlog.description,
        images: updatedBlog.image ? [updatedBlog.image] : [],
        type: "article",
        publishedTime: updatedBlog.createdAt,
        authors: updatedBlog.author?.name ? [updatedBlog.author.name] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: updatedBlog.title,
        description: updatedBlog.description,
        images: updatedBlog.image ? [updatedBlog.image] : [],
      },
    };
  } catch (error) {
    console.error("Error generating metadata:", error);
    return {
      title: "Blog Post",
      description: "Read our latest blog post.",
    };
  }
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  try {
    const { slug } = await params;

    console.log("BlogDetailPage accessed with slug:", slug);

    const [result, breadcrumbData] = await Promise.all([
      getBlogBySlug(slug),
      getBreadcrumbData(),
    ]);

    if (!result?.updatedBlog) {
      console.log("Blog not found, calling notFound()");
      notFound();
    }

    const { updatedBlog, updatedRelatedBlogs } = result;

    return (
      <main className="relative">
        {breadcrumbData && (
          <BreadcrumbsSection
            {...breadcrumbData.content}
            pageSlug={breadcrumbData.pageSlug}
          />
        )}
        <BlogDetailClient
          blog={updatedBlog}
          relatedBlogs={updatedRelatedBlogs}
        />
      </main>
    );
  } catch (error) {
    console.error("Error in BlogDetailPage:", error);
    notFound();
  }
}
