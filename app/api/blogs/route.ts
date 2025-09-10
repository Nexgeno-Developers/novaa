import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Blog from '@/models/Blog';
import BlogCategory from '@/models/BlogCategory';
import { revalidateTag } from 'next/cache';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '10');
    const page = parseInt(searchParams.get('page') || '1');
    const search = searchParams.get('search');
    const status = searchParams.get('status'); // 'active', 'inactive', or 'all'
    
    // Build query
    const query: any = {};
    
    if (category && category !== 'all') {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    // If status is 'all' or not provided, don't filter by status
    
    // Calculate skip for pagination
    const skip = (page - 1) * limit;
    
    // Execute queries
    const [blogs, totalCount] = await Promise.all([
      Blog.find(query)
        .populate('category', 'title slug')
        .sort({ order: 1, createdAt: -1 })
        .skip(skip)
        .limit(limit),
      Blog.countDocuments(query)
    ]);
    
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      success: true,
      data: blogs,
      pagination: {
        currentPage: page,
        totalPages,
        totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blogs' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Check if slug already exists
    const existingBlog = await Blog.findOne({ slug: data.slug });
    if (existingBlog) {
      return NextResponse.json(
        { success: false, error: 'Blog with this slug already exists' },
        { status: 400 }
      );
    }
    
    // Verify category exists
    const category = await BlogCategory.findById(data.category);
    if (!category) {
      return NextResponse.json(
        { success: false, error: 'Selected category does not exist' },
        { status: 400 }
      );
    }
    
    // Add category name to blog data
    data.categoryName = category.title;
    
    const blog = new Blog(data);
    await blog.save();
    
    // Populate category for response
    await blog.populate('category', 'title slug');

    // Revalidate caches
    revalidateTag('blogs');
    revalidateTag('blog-sections'); // This will revalidate blog listing page
    
    return NextResponse.json({
      success: true,
      data: blog
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}
