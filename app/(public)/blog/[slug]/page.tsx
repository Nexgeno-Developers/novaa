import { notFound } from "next/navigation";
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
import BlogDetailClient from "@/components/client/BlogDetailClient";

// API-based fetch function to avoid Mongoose schema issues
async function getBlogBySlug(slug: string) {
  try {
    console.log("Fetching blog with slug via API:", slug);

    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
      }/api/blogs/slug/${slug}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for better performance
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      if (response.status === 404) {
        console.log("Blog not found with slug:", slug);
        return null;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.log("API returned error:", result.error);
      return null;
    }

    const { blog, relatedBlogs } = result.data;
    console.log("Blog found via API:", !!blog);

    // Ensure categoryName is set (in case it's not in the database)
    const updatedBlog = {
      ...blog,
      categoryName: blog.categoryName || blog.category?.title || "",
    };

    // Ensure categoryName is set for related blogs
    const updatedRelatedBlogs = relatedBlogs.map((relatedBlog: any) => ({
      ...relatedBlog,
      categoryName:
        relatedBlog.categoryName || relatedBlog.category?.title || "",
    }));

    console.log("Blog data processed successfully via API");
    return { updatedBlog, updatedRelatedBlogs };
  } catch (error) {
    console.error("Error fetching blog via API:", error);
    return null;
  }
}

// API-based fetch for breadcrumb data
async function getBreadcrumbData() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
      }/api/cms/sections?pageSlug=blog`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        // Add cache control for better performance
        next: { revalidate: 60 },
      }
    );

    if (!response.ok) {
      console.log("Breadcrumb API not available:", response.status);
      return null;
    }

    const sections = await response.json();

    if (!sections || sections.length === 0) {
      console.log("No sections found for blog page");
      return null;
    }

    // Find breadcrumb section from the sections
    const breadcrumbSection = sections.find(
      (section: any) =>
        section.type === "breadcrumb" &&
        section.status === "active" &&
        section.settings?.isVisible === true
    );

    if (!breadcrumbSection) {
      console.log("No breadcrumb section found");
      return null;
    }

    console.log("Breadcrumb data fetched successfully");

    // Convert ObjectId to string for JSON serialization
    return JSON.parse(JSON.stringify(breadcrumbSection));
  } catch (error) {
    console.error("Error fetching breadcrumb data:", error);
    return null;
  }
}

// Updated generateStaticParams using API to avoid Mongoose schema issues
export async function generateStaticParams() {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3001"
      }/api/blogs`,
      {
        // Use static generation
        next: { revalidate: 3600 }, // Revalidate every hour
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    if (!result.success) {
      console.log("API returned error:", result.error);
      return [];
    }

    const blogs = result.data.filter((blog: any) => blog.isActive);

    return blogs.map((blog: any) => ({
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

// These exports control Next.js ISR behavior
export const dynamicParams = true; // Allow dynamic segments not in generateStaticParams
export const revalidate = 60; // Revalidate page every 60 seconds (ISR)
