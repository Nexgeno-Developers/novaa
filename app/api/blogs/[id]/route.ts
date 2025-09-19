import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import BlogCategory from '@/models/BlogCategory';
import { revalidateTag, revalidatePath } from 'next/cache';

// Helper function to revalidate all blog-related caches
async function revalidateBlogCaches(blogSlug?: string, oldSlug?: string) {
  const tagsToRevalidate = [
    'blogs',
    'blog-sections',
    'blog-categories',
    'sections'
  ];

  // Add slug-specific cache tags
  if (blogSlug) {
    tagsToRevalidate.push(`blog-${blogSlug}`);
    tagsToRevalidate.push(`blog-detail-${blogSlug}`);
  }

  // Also clear old slug cache if slug changed
  if (oldSlug && oldSlug !== blogSlug) {
    tagsToRevalidate.push(`blog-${oldSlug}`);
    tagsToRevalidate.push(`blog-detail-${oldSlug}`);
  }

  // Revalidate cache tags with error handling
  const revalidationPromises = tagsToRevalidate.map(async (tag) => {
    try {
      console.log(`Revalidating tag: ${tag}`);
      revalidateTag(tag);
      return { tag, success: true };
    } catch (error) {
      console.error(`Failed to revalidate tag ${tag}:`, error);
      return { tag, success: false, error };
    }
  });

  // Revalidate specific paths with error handling
  const pathsToRevalidate = [
    "/blog", // Blog listing page
  ];

  if (blogSlug) {
    pathsToRevalidate.push(`/blog/${blogSlug}`);
  }

  if (oldSlug && oldSlug !== blogSlug) {
    pathsToRevalidate.push(`/blog/${oldSlug}`);
  }

  const pathPromises = pathsToRevalidate.map(async (path) => {
    try {
      console.log(`Revalidating path: ${path}`);
      revalidatePath(path);
      return { path, success: true };
    } catch (error) {
      console.error(`Failed to revalidate path ${path}:`, error);
      return { path, success: false, error };
    }
  });

  // Wait for all revalidations to complete
  const [tagResults, pathResults] = await Promise.allSettled([
    Promise.all(revalidationPromises),
    Promise.all(pathPromises)
  ]);

  return {
    tags: tagResults.status === 'fulfilled' ? tagResults.value : [],
    paths: pathResults.status === 'fulfilled' ? pathResults.value : [],
    tagsToRevalidate,
    pathsToRevalidate
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    const blog = await Blog.findById(id).populate('category', 'title slug');
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: blog
    });
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  let updatedBlog : any = null;
  let oldSlug : any = null;
  
  try {
    await connectDB();
    const data = await request.json();
    const { id } = await params;
    
    // Get the CURRENT blog data before updating
    const currentBlog = await Blog.findById(id);
    if (!currentBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    oldSlug = currentBlog.slug;
    
    // Check if slug already exists for OTHER blogs (conflict check)
    const slugConflict = await Blog.findOne({ 
      slug: data.slug,
      _id: { $ne: id }
    });
    
    if (slugConflict) {
      return NextResponse.json(
        { success: false, error: 'Blog with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Verify category exists if category is being updated
    if (data.category) {
      const category = await BlogCategory.findById(data.category);
      if (!category) {
        return NextResponse.json(
          { success: false, error: 'Selected category does not exist' },
          { status: 400 }
        );
      }
      data.categoryName = category.title;
    }
    
    updatedBlog = await Blog.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('category', 'title slug');

    if (!updatedBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found after update' },
        { status: 404 }
      );
    }

    console.log("Blog updated successfully:", {
      blogId: id,
      blogTitle: updatedBlog.title,
      newSlug: updatedBlog.slug,
      oldSlug: oldSlug,
      slugChanged: oldSlug !== updatedBlog.slug,
      timestamp: new Date().toISOString(),
    });

    // Return success response immediately
    const response = NextResponse.json({
      success: true,
      data: updatedBlog
    });

    // Trigger cache revalidation asynchronously (don't wait for it)
    setImmediate(async () => {
      try {
        const revalidationResults = await revalidateBlogCaches(updatedBlog.slug, oldSlug);
        console.log("Blog update cache revalidation completed:", {
          blogId: id,
          revalidationResults,
          timestamp: new Date().toISOString(),
        });
      } catch (revalidationError) {
        console.error("Blog update cache revalidation failed:", revalidationError);
      }
    });

    return response;
    
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    
    // Get blog data BEFORE deleting for better cache invalidation
    const blog = await Blog.findById(id);
    
    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }
    
    // Now delete the blog
    await Blog.findByIdAndDelete(id);

    console.log("Blog deleted successfully:", {
      blogId: id,
      deletedBlog: blog.title,
      deletedSlug: blog.slug,
      timestamp: new Date().toISOString(),
    });

    // Return success response immediately
    const response = NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });

    // Trigger cache revalidation asynchronously
    setImmediate(async () => {
      try {
        const revalidationResults = await revalidateBlogCaches(blog.slug);
        console.log("Blog deletion cache revalidation completed:", {
          blogId: id,
          revalidationResults,
          timestamp: new Date().toISOString(),
        });
      } catch (revalidationError) {
        console.error("Blog deletion cache revalidation failed:", revalidationError);
      }
    });

    return response;
    
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}