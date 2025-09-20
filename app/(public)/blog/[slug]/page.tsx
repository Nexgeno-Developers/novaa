// import { notFound } from "next/navigation";
// import connectDB from "@/lib/mongodb";
// import Blog from "@/models/Blog";
// import Section from "@/models/Section";
// import { unstable_cache } from "next/cache";
// import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
// import BlogDetailClient from "@/components/client/BlogDetailClient";

// // Create cached functions for blog data
// const getCachedBlogBySlug = (slug: string) =>
//   unstable_cache(
//     async () => {
//       try {
//         await connectDB();

//         console.log("Fetching blog with slug:", slug);

//         const blog = await Blog.findOne({ slug, isActive: true })
//           .populate("category", "title slug")
//           .populate("author", "name avatar")
//           .lean(); // Add .lean() for better performance

//         console.log("Blog found:", !!blog);

//         if (!blog) {
//           console.log("Blog not found with slug:", slug);
//           return null;
//         }

//         // Get related blogs from the same category
//         const relatedBlogs = await Blog.find({
//           category: (blog as any)?.category?._id,
//           _id: { $ne: (blog as any)._id },
//           isActive: true,
//         })
//           .populate("category", "title slug")
//           .populate("author", "name avatar")
//           .sort({ createdAt: -1 })
//           .limit(4)
//           .lean(); // Add .lean() for better performance

//         // Convert all BSON/ObjectId fields into plain strings
//         const updatedBlog = JSON.parse(JSON.stringify(blog));
//         const updatedRelatedBlogs = JSON.parse(JSON.stringify(relatedBlogs));

//         // Ensure categoryName is set (in case it's not in the database)
//         if (updatedBlog.category && !updatedBlog.categoryName) {
//           updatedBlog.categoryName = updatedBlog.category.title;
//         }

//         // Ensure categoryName is set for related blogs
//         updatedRelatedBlogs.forEach(
//           (relatedBlog: {
//             category: { title: string };
//             categoryName: string;
//           }) => {
//             if (relatedBlog.category && !relatedBlog.categoryName) {
//               relatedBlog.categoryName = relatedBlog.category.title;
//             }
//           }
//         );

//         console.log("Blog data processed successfully");
//         return { updatedBlog, updatedRelatedBlogs };
//       } catch (error) {
//         console.error("Error fetching blog:", error);
//         return null;
//       }
//     },
//     [`blog-detail-${slug}`], // Cache key
//     {
//       tags: ["blogs", `blog-${slug}`, "blog-categories"], // Cache tags for revalidation
//       revalidate: 3600, // Revalidate every hour (fallback)
//     }
//   );

// // Create cached function for breadcrumb data
// const getCachedBreadcrumbData = unstable_cache(
//   async () => {
//     try {
//       await connectDB();

//       const breadcrumbSection = await Section.findOne({
//         pageSlug: "blog",
//         type: "breadcrumb",
//         status: "active",
//         "settings.isVisible": true,
//       }).lean(); // Add .lean() for better performance

//       return JSON.parse(JSON.stringify(breadcrumbSection));
//     } catch (error) {
//       console.error("Error fetching breadcrumb data:", error);
//       return null;
//     }
//   },
//   ["blog-breadcrumb-data"], // Cache key
//   {
//     tags: ["blog-sections", "sections"], // Cache tags for revalidation
//     revalidate: 3600, // Revalidate every hour (fallback)
//   }
// );

// async function getBlogBySlug(slug: string) {
//   try {
//     const cachedFunction = getCachedBlogBySlug(slug);
//     const result = await cachedFunction();

//     // Increment view count (this should not be cached)
//     if (result?.updatedBlog) {
//       try {
//         await connectDB();
//         await Blog.findByIdAndUpdate(result.updatedBlog._id, {
//           $inc: { views: 1 },
//         });
//       } catch (error) {
//         console.error("Error incrementing view count:", error);
//         // Don't fail the request if view count update fails
//       }
//     }

//     return result;
//   } catch (error) {
//     console.error("Error in getBlogBySlug:", error);
//     return null;
//   }
// }

// async function getBreadcrumbData() {
//   try {
//     return await getCachedBreadcrumbData();
//   } catch (error) {
//     console.error("Error in getBreadcrumbData:", error);
//     return null;
//   }
// }

// // generateStaticParams for better production performance
// export async function generateStaticParams() {
//   try {
//     await connectDB();
//     const blogs = await Blog.find({ isActive: true }).select("slug").lean();

//     return blogs.map((blog) => ({
//       slug: blog.slug,
//     }));
//   } catch (error) {
//     console.error("Error generating static params:", error);
//     return [];
//   }
// }

// export async function generateMetadata({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   try {
//     const { slug } = await params;
//     const result = await getBlogBySlug(slug);

//     if (!result?.updatedBlog) {
//       return {
//         title: "Blog Not Found",
//         description: "The requested blog post could not be found.",
//       };
//     }

//     const { updatedBlog } = result;

//     return {
//       title: updatedBlog.seo?.metaTitle || updatedBlog.title,
//       description: updatedBlog.seo?.metaDescription || updatedBlog.description,
//       keywords:
//         updatedBlog.seo?.keywords?.join(", ") || updatedBlog.tags?.join(", "),
//       openGraph: {
//         title: updatedBlog.title,
//         description: updatedBlog.description,
//         images: updatedBlog.image ? [updatedBlog.image] : [],
//         type: "article",
//         publishedTime: updatedBlog.createdAt,
//         authors: updatedBlog.author?.name ? [updatedBlog.author.name] : [],
//       },
//       twitter: {
//         card: "summary_large_image",
//         title: updatedBlog.title,
//         description: updatedBlog.description,
//         images: updatedBlog.image ? [updatedBlog.image] : [],
//       },
//     };
//   } catch (error) {
//     console.error("Error generating metadata:", error);
//     return {
//       title: "Blog Post",
//       description: "Read our latest blog post.",
//     };
//   }
// }

// export default async function BlogDetailPage({
//   params,
// }: {
//   params: Promise<{ slug: string }>;
// }) {
//   try {
//     const { slug } = await params;

//     console.log("BlogDetailPage accessed with slug:", slug);

//     const [result, breadcrumbData] = await Promise.all([
//       getBlogBySlug(slug),
//       getBreadcrumbData(),
//     ]);

//     if (!result?.updatedBlog) {
//       console.log("Blog not found, calling notFound()");
//       notFound();
//     }

//     const { updatedBlog, updatedRelatedBlogs } = result;

//     return (
//       <main className="relative">
//         {breadcrumbData && (
//           <BreadcrumbsSection
//             {...breadcrumbData.content}
//             pageSlug={breadcrumbData.pageSlug}
//           />
//         )}
//         <BlogDetailClient
//           blog={updatedBlog}
//           relatedBlogs={updatedRelatedBlogs}
//         />
//       </main>
//     );
//   } catch (error) {
//     console.error("Error in BlogDetailPage:", error);
//     notFound();
//   }
// }
import { notFound } from "next/navigation";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import Section from "@/models/Section";
import { unstable_cache } from "next/cache";
import BreadcrumbsSection from "@/components/client/BreadcrumbsSection";
import BlogDetailClient from "@/components/client/BlogDetailClient";
import ContentRefreshIndicator from "@/components/client/ContentRefreshIndicator";
import { BlogDetailSkeleton } from "@/components/client/LoadingSkeletons";
import { Suspense } from "react";

// Your existing fetch functions...
async function fetchBlogBySlugDirect(slug: string) {
  console.log(`[BLOG_DIRECT] Fetching blog: ${slug}`);
  
  try {
    await connectDB();

    const blog = await Blog.findOne({ slug, isActive: true })
      .populate("category", "title slug")
      .populate("author", "name avatar")
      .lean();

    if (!blog) {
      console.log(`[BLOG_DIRECT] No blog found: ${slug}`);
      return null;
    }

    // Get related blogs
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

    const updatedBlog = JSON.parse(JSON.stringify(blog));
    const updatedRelatedBlogs = JSON.parse(JSON.stringify(relatedBlogs));

    // Ensure categoryName is set
    if (updatedBlog.category && !updatedBlog.categoryName) {
      updatedBlog.categoryName = updatedBlog.category.title;
    }

    updatedRelatedBlogs.forEach((relatedBlog: any) => {
      if (relatedBlog.category && !relatedBlog.categoryName) {
        relatedBlog.categoryName = relatedBlog.category.title;
      }
    });

    const result = {
      updatedBlog,
      updatedRelatedBlogs,
      _cacheMetadata: {
        fetchedAt: new Date().toISOString(),
        source: 'direct',
        slug: slug
      }
    };

    console.log(`[BLOG_DIRECT] Successfully fetched: ${updatedBlog.title}`);
    return result;
  } catch (error) {
    console.error(`[BLOG_DIRECT] Error:`, error);
    return null;
  }
}

async function fetchBreadcrumbDataDirect() {
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
    console.error(`[BREADCRUMB_DIRECT] Error:`, error);
    return null;
  }
}

const getFreshBlogBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const result = await fetchBlogBySlugDirect(slug);
      if (result) {
        result._cacheMetadata.source = 'fresh-cache';
      }
      return result;
    },
    [`blog-fresh-${slug}-${Date.now()}`],
    {
      tags: ["blogs", `blog-${slug}`],
      revalidate: false,
    }
  );

const getStaleBlogBySlug = (slug: string) =>
  unstable_cache(
    async () => {
      const result = await fetchBlogBySlugDirect(slug);
      if (result) {
        result._cacheMetadata.source = 'stale-cache';
      }
      return result;
    },
    [`blog-stale-${slug}`],
    {
      tags: ["blogs", `blog-${slug}`],
      revalidate: 300,
    }
  );

const getCachedBreadcrumbData = unstable_cache(
  fetchBreadcrumbDataDirect,
  ["blog-breadcrumb-data"],
  {
    tags: ["blog-sections"],
    revalidate: 600,
  }
);

// Modified SWR function with loading states
async function getBlogBySlugSWR(slug: string) {
  console.log(`[BLOG_SWR] Starting SWR for slug: ${slug}`);
  
  let staleResult = null;
  let freshResult = null;
  let shouldShowRefreshIndicator = false;
  let isLoading = true;
  
  // Step 1: Try stale cache first (quick)
  try {
    console.log(`[BLOG_SWR] Trying stale cache for: ${slug}`);
    const staleFunction = getStaleBlogBySlug(slug);
    staleResult = await Promise.race([
      staleFunction(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Stale cache timeout')), 1500)
      )
    ]) as any;
    
    if (staleResult?.updatedBlog) {
      console.log(`[BLOG_SWR] Stale cache hit for: ${slug}`);
      shouldShowRefreshIndicator = true;
      isLoading = false; // We have content to show
    }
  } catch (error) {
    console.log(`[BLOG_SWR] Stale cache miss for: ${slug}`);
  }
  
  // Step 2: Try fresh cache
  try {
    console.log(`[BLOG_SWR] Trying fresh cache for: ${slug}`);
    const freshFunction = getFreshBlogBySlug(slug);
    freshResult = await Promise.race([
      freshFunction(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Fresh cache timeout')), 3000)
      )
    ]) as any;
    
    if (freshResult?.updatedBlog) {
      console.log(`[BLOG_SWR] Fresh cache hit for: ${slug}`);
      shouldShowRefreshIndicator = false;
      isLoading = false;
    }
  } catch (error) {
    console.log(`[BLOG_SWR] Fresh cache miss for: ${slug}`);
  }
  
  // Step 3: Direct fetch if needed
  if (!freshResult) {
    const maxRetries = staleResult ? 1 : 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        freshResult = await Promise.race([
          fetchBlogBySlugDirect(slug),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Direct fetch timeout')), 3000)
          )
        ]) as any;
        
        if (freshResult?.updatedBlog) {
          console.log(`[BLOG_SWR] Direct fetch successful on attempt ${attempt}`);
          isLoading = false;
          break;
        }
      } catch (error) {
        console.log(`[BLOG_SWR] Direct fetch attempt ${attempt} failed`);
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, 500 * attempt));
        }
      }
    }
  }
  
  const finalResult = freshResult || staleResult;
  
  if (finalResult?.updatedBlog) {
    finalResult._showRefreshIndicator = shouldShowRefreshIndicator && !freshResult;
    finalResult._isStale = !freshResult && !!staleResult;
    finalResult._isLoading = isLoading && !finalResult;
    
    console.log(`[BLOG_SWR] Returning blog: ${finalResult.updatedBlog.title}, stale: ${finalResult._isStale}, loading: ${isLoading}`);
  } else {
    console.log(`[BLOG_SWR] No blog data available for: ${slug}`);
  }
  
  return finalResult;
}

async function getBreadcrumbDataSWR() {
  try {
    const breadcrumbData = await Promise.race([
      getCachedBreadcrumbData(),
      new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Breadcrumb cache timeout')), 2000)
      )
    ]) as any;
    
    if (breadcrumbData) {
      return breadcrumbData;
    }
  } catch (error) {
    console.log(`[BREADCRUMB_SWR] Cache miss, trying direct fetch`);
  }
  
  return await fetchBreadcrumbDataDirect();
}

// Main component that renders blog content
function BlogContent({ 
  result, 
  slug, 
  breadcrumbData 
}: { 
  result: any; 
  slug: string; 
  breadcrumbData: any; 
}) {
  const { updatedBlog, updatedRelatedBlogs } = result;

  // Increment view count asynchronously
  setImmediate(async () => {
    try {
      await connectDB();
      await Blog.findByIdAndUpdate(updatedBlog._id, {
        $inc: { views: 1 },
      });
      console.log(`[BLOG_VIEW] View count incremented: ${updatedBlog._id}`);
    } catch (error) {
      console.error(`[BLOG_VIEW] Error incrementing view count:`, error);
    }
  });

  return (
    <main className="relative">
      {/* Show refresh indicator if serving stale content */}
      {result._showRefreshIndicator && (
        <ContentRefreshIndicator 
          type="blog" 
          slug={slug}
          contentName={updatedBlog.title}
        />
      )}
      
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
}

export async function generateStaticParams() {
  try {
    await connectDB();
    const blogs = await Blog.find({ isActive: true }).select("slug").lean();

    return blogs.map((blog) => ({
      slug: blog.slug,
    }));
  } catch (error) {
    console.error("[BLOG_STATIC_PARAMS] Error:", error);
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
    const result = await getBlogBySlugSWR(slug);

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
    console.error("[BLOG_METADATA] Error:", error);
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
  const { slug } = await params;
  
  console.log(`[BLOG_PAGE] BlogDetailPage accessed: ${slug}`);

  try {
    const [result, breadcrumbData] = await Promise.all([
      getBlogBySlugSWR(slug),
      getBreadcrumbDataSWR(),
    ]);

    if (!result?.updatedBlog) {
      console.log(`[BLOG_PAGE] No blog found: ${slug}`);
      notFound();
    }

    console.log(`[BLOG_PAGE] Loaded blog: ${result.updatedBlog.title}`);

    // If we're still loading and have no stale content, show skeleton
    if (result._isLoading) {
      return <BlogDetailSkeleton />;
    }

    return (
      <Suspense fallback={<BlogDetailSkeleton />}>
        <BlogContent 
          result={result} 
          slug={slug} 
          breadcrumbData={breadcrumbData} 
        />
      </Suspense>
    );
  } catch (pageError) {
    console.error(`[BLOG_PAGE] Error: ${slug}:`, pageError);
    // Show skeleton while we figure out what went wrong
    return <BlogDetailSkeleton />;
  }
}