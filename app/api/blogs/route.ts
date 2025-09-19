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

    console.log("Blog created successfully:", {
      blogId: blog._id,
      blogTitle: blog.title,
      blogSlug: blog.slug,
      timestamp: new Date().toISOString(),
    });

    // Return success response immediately
    const response = NextResponse.json({
      success: true,
      data: blog
    }, { status: 201 });

    // Trigger cache revalidation asynchronously
    setImmediate(async () => {
      try {
        const revalidationResults = await revalidateBlogCaches(blog.slug);
        console.log("Blog creation cache revalidation completed:", {
          blogId: blog._id,
          revalidationResults,
          timestamp: new Date().toISOString(),
        });
      } catch (revalidationError) {
        console.error("Blog creation cache revalidation failed:", revalidationError);
      }
    });

    return response;
    
  } catch (error) {
    console.error('Error creating blog:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog' },
      { status: 500 }
    );
  }
}