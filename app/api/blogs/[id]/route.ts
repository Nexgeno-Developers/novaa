import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import BlogCategory from '@/models/BlogCategory';
import { revalidatePath, revalidateTag } from 'next/cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }>  }
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
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    await connectDB();
    const data = await request.json();
    const { id } = await params;

    //  Get the CURRENT blog data before updating
    const currentBlog = await Blog.findById(id);
    if (!currentBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

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

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      data,
      { new: true, runValidators: true }
    ).populate('category', 'title slug');

    // Revalidate caches
    revalidatePath('blogs');
    revalidatePath('blog-sections'); // This will revalidate blog listing page

    // Invalidate cache for the CURRENT blog's slug (before update)
    revalidatePath(`blog-${currentBlog.slug}`);

    // If slug changed, also invalidate new slug cache
    if (updatedBlog.slug !== currentBlog.slug) {
      revalidatePath(`blog-${updatedBlog.slug}`);
    }

    return NextResponse.json({
      success: true,
      data: updatedBlog
    });
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
  { params }: { params: Promise<{ id: string }>  }
) {
  try {
    await connectDB();
    const { id } = await params;

    // : Get blog data BEFORE deleting for better cache invalidation
    const blog = await Blog.findById(id);

    if (!blog) {
      return NextResponse.json(
        { success: false, error: 'Blog not found' },
        { status: 404 }
      );
    }

    // Now delete the blog
    await Blog.findByIdAndDelete(id);

    // Revalidate caches
    revalidatePath('blogs');
    revalidatePath('blog-sections'); // This will revalidate blog listing page

    // Invalidate specific blog detail page cache
    revalidatePath(`blog-${blog.slug}`);

    return NextResponse.json({
      success: true,
      message: 'Blog deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog' },
      { status: 500 }
    );
  }
}