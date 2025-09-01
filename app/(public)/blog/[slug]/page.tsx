import { notFound } from 'next/navigation';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import BlogCategory from '@/models/BlogCategory';
import Section from '@/models/Section';
import BreadcrumbsSection from '@/components/client/BreadcrumbsSection';
import BlogDetailClient from '@/components/client/BlogDetailClient';

async function getBlogBySlug(slug: string) {
  try {
    await connectDB();
    
    const blog = await Blog.findOne({ slug, isActive: true })
      .populate('category', 'title slug')
    
    if (!blog) {
      return null;
    }
    
    // Get related blogs from the same category
    const relatedBlogs = await Blog.find({
      category: blog.category._id,
      _id: { $ne: blog._id },
      isActive: true
    })
      .sort({ createdAt: -1 })
      .limit(4)
    
    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    
    return { blog, relatedBlogs };
  } catch (error) {
    console.error('Error fetching blog:', error);
    return null;
  }
}

async function getBreadcrumbData() {
  try {
    await connectDB();
    
    const breadcrumbSection = await Section.findOne({
      pageSlug: 'blog',
      type: 'breadcrumb',
      status: 'active',
      'settings.isVisible': true
    })
    
    return breadcrumbSection;
  } catch (error) {
    console.error('Error fetching breadcrumb data:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }>  }) {
  const {slug} = await params
  const result = await getBlogBySlug(slug);
  
  if (!result?.blog) {
    return {
      title: 'Blog Not Found',
      description: 'The requested blog post could not be found.'
    };
  }
  
  const { blog } = result;
  
  return {
    title: blog.seo?.metaTitle || blog.title,
    description: blog.seo?.metaDescription || blog.description,
    keywords: blog.seo?.keywords?.join(', ') || blog.tags?.join(', '),
    openGraph: {
      title: blog.title,
      description: blog.description,
      images: [blog.image],
      type: 'article',
      publishedTime: blog.createdAt,
      authors: [blog.author.name],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.description,
      images: [blog.image],
    }
  };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }>  }) {
    const {slug} = await params

  const [result, breadcrumbData] = await Promise.all([
    getBlogBySlug(slug),
    getBreadcrumbData()
  ]);
  
  if (!result?.blog) {
    notFound();
  }
  
  const { blog, relatedBlogs } = result;
  
  return (
    <main className="relative">
      {breadcrumbData && (
        <BreadcrumbsSection 
          {...breadcrumbData.content} 
          pageSlug={breadcrumbData.pageSlug}
        />
      )}
      <BlogDetailClient blog={blog} relatedBlogs={relatedBlogs} />
    </main>
  );
}