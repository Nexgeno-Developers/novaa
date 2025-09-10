import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import BlogCategory from '@/models/BlogCategory';
import { revalidateTag } from 'next/cache';

export async function GET() {
  try {
    await connectDB();
    const categories = await BlogCategory.find().sort({ order: 1, createdAt: -1 });
    
    return NextResponse.json({
      success: true,
      data: categories
    });
  } catch (error) {
    console.error('Error fetching blog categories:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Check if slug already exists
    const existingCategory = await BlogCategory.findOne({ slug: data.slug });
    if (existingCategory) {
      return NextResponse.json(
        { success: false, error: 'Category with this slug already exists' },
        { status: 400 }
      );
    }
    
    const category = new BlogCategory(data);
    await category.save();

    // Revalidate caches
    revalidateTag('blog-categories');
    revalidateTag('blog-sections'); // This will revalidate blog listing page
    
    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog category:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog category' },
      { status: 500 }
    );
  }
}
