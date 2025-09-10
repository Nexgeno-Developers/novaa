import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import Section from '@/models/Section';
import { unstable_cache } from 'next/cache';
import BreadcrumbsSection from '@/components/client/BreadcrumbsSection';
import BlogDetailClient from '@/components/client/BlogDetailClient';

// Create cached functions for blog data
const getCachedBlogBySlug = (slug: string) => 
  unstable_cache(
    async () => {
      try {
        await connectDB();
        
        const blog = await Blog.findOne({ slug, isActive: true })
          .populate('category', 'title slug')
          .populate('author', 'name avatar')
        
        if (!blog) {
          return null;
        }
        
        // Get related blogs from the same category
        const relatedBlogs = await Blog.find({
          category: blog.category._id,
          _id: { $ne: blog._id },
          isActive: true
        })
          .populate('category', 'title slug')
          .populate('author', 'name avatar')
          .sort({ createdAt: -1 })
          .limit(4)

        // Convert all BSON/ObjectId fields into plain strings
        const updatedBlog = JSON.parse(JSON.stringify(blog));
        const updatedRelatedBlogs = JSON.parse(JSON.stringify(relatedBlogs));

        // Ensure categoryName is set (in case it's not in the database)
        if (updatedBlog.category && !updatedBlog.categoryName) {
          updatedBlog.categoryName = updatedBlog.category.title;
        }

        // Ensure categoryName is set for related blogs
        updatedRelatedBlogs.forEach((relatedBlog: { category: { title: string; }; categoryName: string; }) => {
          if (relatedBlog.category && !relatedBlog.categoryName) {
            relatedBlog.categoryName = relatedBlog.category.title;
          }
        });
        
        return { updatedBlog, updatedRelatedBlogs };
      } catch (error) {
        console.error('Error fetching blog:', error);
        return null;
      }
    },
    [`blog-detail-${slug}`], // Cache key
    {
      tags: ['blogs', `blog-${slug}` , 'blog-categories'], // Cache tags for revalidation
      revalidate: 3600, // Revalidate every hour (fallback)
    }
  );

// Create cached function for breadcrumb data
const getCachedBreadcrumbData = unstable_cache(
  async () => {
    try {
      await connectDB();
      
      const breadcrumbSection = await Section.findOne({
        pageSlug: 'blog',
        type: 'breadcrumb',
        status: 'active',
        'settings.isVisible': true
      })
      
      return JSON.parse(JSON.stringify(breadcrumbSection));
    } catch (error) {
      console.error('Error fetching breadcrumb data:', error);
      return null;
    }
  },
  ['blog-breadcrumb-data'], // Cache key
  {
    tags: ['blog-sections', 'sections' , ], // Cache tags for revalidation
    revalidate: 3600, // Revalidate every hour (fallback)
  }
);

async function getBlogBySlug(slug: string) {
  const cachedFunction = getCachedBlogBySlug(slug);
  const result = await cachedFunction();
  
  // Increment view count (this should not be cached)
  if (result?.updatedBlog) {
    try {
      await connectDB();
      await Blog.findByIdAndUpdate(result.updatedBlog._id, { $inc: { views: 1 } });
    } catch (error) {
      console.error('Error incrementing view count:', error);
    }
  }
  
  return result;
}

async function getBreadcrumbData() {
  return getCachedBreadcrumbData();
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const result = await getBlogBySlug(slug);
  
  if (!result?.updatedBlog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  const { updatedBlog } = result;
  
  return {
    title: updatedBlog.seo?.metaTitle || updatedBlog.title,
    description: updatedBlog.seo?.metaDescription || updatedBlog.description,
    keywords: updatedBlog.seo?.keywords?.join(', ') || updatedBlog.tags?.join(', '),
    openGraph: {
      title: updatedBlog.title,
      description: updatedBlog.description,
      images: [updatedBlog.image],
      type: 'article',
      publishedTime: updatedBlog.createdAt,
      authors: [updatedBlog.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: updatedBlog.title,
      description: updatedBlog.description,
      images: [updatedBlog.image],
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  const [result, breadcrumbData] = await Promise.all([
    getBlogBySlug(slug),
    getBreadcrumbData()
  ]);
  
  if (!result?.updatedBlog) {
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
      <BlogDetailClient blog={updatedBlog} relatedBlogs={updatedRelatedBlogs} />
    </main>
  );
}