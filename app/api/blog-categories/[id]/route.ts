import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import BlogCategory from "@/models/BlogCategory";
import Blog from "@/models/Blog";
import { revalidateTag } from 'next/cache';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const data = await request.json();
    const { id } = await params;

    // Check if slug already exists for other categories
    const existingCategory = await BlogCategory.findOne({
      slug: data.slug,
      _id: { $ne: id },
    });

    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: "Category with this slug already exists" },
        { status: 400 }
      );
    }

    // Get the old category data before updating
    const oldCategory = await BlogCategory.findById(id);
    if (!oldCategory) {
      return NextResponse.json(
        { success: false, error: "Blog category not found" },
        { status: 404 }
      );
    }

    const category = await BlogCategory.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    // Update category name in all related blogs if title changed
    if (data.title && data.title !== oldCategory.title) {
      await Blog.updateMany({ category: id }, { categoryName: data.title });
    }

    // Revalidate all related caches
    revalidateTag('blog-categories');
    revalidateTag('blog-sections'); // Blog listing page
    revalidateTag('blogs'); // Blog data that includes category info
    
    // If slug changed, revalidate any specific category-related caches
    if (data.slug && data.slug !== oldCategory.slug) {
      revalidateTag(`category-${oldCategory.slug}`);
      revalidateTag(`category-${data.slug}`);
    }

    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error updating blog category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update blog category" },
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

    // Get category info before deleting for cache invalidation
    const category = await BlogCategory.findById(id);
    if (!category) {
      return NextResponse.json(
        { success: false, error: "Blog category not found" },
        { status: 404 }
      );
    }

    // Check if category is being used by any blogs
    const blogsUsingCategory = await Blog.countDocuments({ category: id });

    if (blogsUsingCategory > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `Cannot delete category. It is being used by ${blogsUsingCategory} blog(s)`,
        },
        { status: 400 }
      );
    }

    await BlogCategory.findByIdAndDelete(id);

    // Revalidate all related caches
    revalidateTag('blog-categories');
    revalidateTag('blog-sections'); // Blog listing page
    revalidateTag('blogs'); // Blog data that includes category info
    revalidateTag(`category-${category.slug}`); // Specific category cache

    return NextResponse.json({
      success: true,
      message: "Blog category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting blog category:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete blog category" },
      { status: 500 }
    );
  }
}