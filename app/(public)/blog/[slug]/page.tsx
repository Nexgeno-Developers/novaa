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
      .populate('author', 'name avatar') // Make sure to populate author if it's a reference
    
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
      .populate('author', 'name avatar') // Populate author for related blogs too
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
    updatedRelatedBlogs.forEach((relatedBlog: any) => {
      if (relatedBlog.category && !relatedBlog.categoryName) {
        relatedBlog.categoryName = relatedBlog.category.title;
      }
    });
    
    // Increment view count
    await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });
    
    return { updatedBlog, updatedRelatedBlogs };
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