import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Section from "@/models/Section";
import { unstable_cache } from "next/cache";
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
import BlogDetailClient from "@/components/client/BlogDetailClient";

// Fallback function to get blog directly from DB (without cache)
async function getBlogBySlugDirect(slug: string) {
  try {
    await connectDB();

    const blog = await Blog.findOne({ slug, isActive: true })
      .populate("category", "title slug")
      .populate("author", "name avatar")
      .lean();

    if (!blog) {
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
      .lean();

    // Convert all BSON/ObjectId fields into plain strings
    const updatedBlog = JSON.parse(JSON.stringify(blog));
    const updatedRelatedBlogs = JSON.parse(JSON.stringify(relatedBlogs));

    // Ensure categoryName is set
    if (updatedBlog.category && !updatedBlog.categoryName) {
      updatedBlog.categoryName = updatedBlog.category.title;
    }

    // Ensure categoryName is set for related blogs
    updatedRelatedBlogs.forEach((relatedBlog: any) => {
      if (relatedBlog.category && !relatedBlog.categoryName) {
        relatedBlog.categoryName = relatedBlog.category.title;
      }
    });

    return { updatedBlog, updatedRelatedBlogs };
  } catch (error) {
    console.error("Error fetching blog directly:", error);
    return null;
  }
}

// Create cached functions for blog data
const getCachedBlogBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      return await getBlogBySlugDirect(slug);
    },
    [`blog-detail-${slug}`],
    {
      tags: ["blogs", `blog-${slug}`, "blog-categories"],
      revalidate: 0, // Fallback revalidation
    }
  );

// Fallback function to get breadcrumb directly from DB
async function getBreadcrumbDataDirect() {
  try {
    await connectDB();

    const breadcrumbSection = await Section.findOne({
      pageSlug: "blog",
      type: "breadcrumb",
      status: "active",
      "settings.isVisible": true,
    }).lean();

    return JSON.parse(JSON.stringify(breadcrumbSection));
  } catch (error) {
    console.error("Error fetching breadcrumb data directly:", error);
    return null;
  }
}

// Create cached function for breadcrumb data
const getCachedBreadcrumbData = unstable_cache(
  async () => {
    return await getBreadcrumbDataDirect();
  },
  ["blog-breadcrumb-data"],
  {
    tags: ["blog-sections", "sections"],
    revalidate: 0,
  }
);

async function getBlogBySlug(slug: string) {
  try {
    console.log("Fetching blog with slug:", slug);

    // First try to get from cache
    const cachedFunction = getCachedBlogBySlug(slug);
    let result = await cachedFunction();

    // If cache returns null or undefined, try direct DB query as fallback
    if (!result) {
      console.log(
        "Cache miss or empty, trying direct DB query for blog slug:",
        slug
      );
      result = await getBlogBySlugDirect(slug);

      if (result) {
        console.log(
          "Found blog via direct query, cache will be populated on next request"
        );
      }
    }

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

    // Final fallback to direct DB query
    console.log("Cache error, falling back to direct DB query");
    return await getBlogBySlugDirect(slug);
  }
}

async function getBreadcrumbData() {
  try {
    // First try to get from cache
    const cachedFunction = getCachedBreadcrumbData;
    let breadcrumbData = await cachedFunction();

    // If cache returns null, try direct DB query as fallback
    if (!breadcrumbData) {
      console.log("Breadcrumb cache miss, trying direct DB query");
      breadcrumbData = await getBreadcrumbDataDirect();

      if (breadcrumbData) {
        console.log("Found breadcrumb via direct query");
      }
    }

    return breadcrumbData;
  } catch (error) {
    console.error("Error in getBreadcrumbData:", error);

    // Final fallback to direct DB query
    return await getBreadcrumbDataDirect();
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

    console.log("Successfully loaded blog:", updatedBlog.title);

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
