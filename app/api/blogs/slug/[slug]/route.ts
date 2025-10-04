import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Blog from "@/models/Blog";
import BlogCategory from "@/models/BlogCategory"; // Explicitly import to ensure schema registration
import { Admin } from "@/models/Admin"; // Explicitly import for author population

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await connectDB();
    const { slug } = await params;

    // Validate slug
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid slug provided" },
        { status: 400 }
      );
    }

    console.log("Fetching blog with slug:", slug);

    // First try with populate, if it fails due to schema issues, try without
    let blog: any;
    let relatedBlogs: any[] = [];

    try {
      blog = await Blog.findOne({
        slug: slug.trim().toLowerCase(),
        isActive: true,
      })
        .populate("category", "title slug")
        .populate("author", "name avatar")
        .lean()
        .maxTimeMS(10000);

      console.log("Blog found:", !!blog);

      if (!blog) {
        return NextResponse.json(
          { success: false, error: "Blog not found" },
          { status: 404 }
        );
      }

      // Get related blogs from the same category
      relatedBlogs = await Blog.find({
        category: (blog as any).category?._id,
        _id: { $ne: (blog as any)._id },
        isActive: true,
      })
        .populate("category", "title slug")
        .populate("author", "name avatar")
        .sort({ createdAt: -1 })
        .limit(4)
        .lean();
    } catch (populateError) {
      console.log("Populate failed, trying without populate:", populateError);
      // Fallback: fetch blog without populate
      blog = await Blog.findOne({
        slug: slug.trim().toLowerCase(),
        isActive: true,
      })
        .lean()
        .maxTimeMS(10000);

      if (!blog) {
        return NextResponse.json(
          { success: false, error: "Blog not found" },
          { status: 404 }
        );
      }

      // If we found a blog but couldn't populate, fetch related data separately
      if ((blog as any).category) {
        try {
          const category = await BlogCategory.findById(
            (blog as any).category
          ).lean();
          const author = (blog as any).author
            ? await Admin.findById((blog as any).author).lean()
            : null;

          (blog as any).category =
            category && !Array.isArray(category)
              ? {
                  _id: (category as any)._id.toString(),
                  title: (category as any).title,
                  slug: (category as any).slug,
                }
              : (blog as any).category;

          (blog as any).author = author
            ? {
                _id: (author as any)._id.toString(),
                name: (author as any).name,
                avatar: (author as any).avatar,
              }
            : (blog as any).author;
        } catch (relatedError) {
          console.log("Related data fetch failed:", relatedError);
          // Keep original data if we can't fetch details
        }
      }

      // Get related blogs without populate
      try {
        relatedBlogs = await Blog.find({
          category: (blog as any).category?._id,
          _id: { $ne: (blog as any)._id },
          isActive: true,
        })
          .sort({ createdAt: -1 })
          .limit(4)
          .lean();

        // Fetch related data for related blogs too
        for (const relatedBlog of relatedBlogs) {
          if ((relatedBlog as any).category) {
            try {
              const category = await BlogCategory.findById(
                (relatedBlog as any).category
              ).lean();
              const author = (relatedBlog as any).author
                ? await Admin.findById((relatedBlog as any).author).lean()
                : null;

              (relatedBlog as any).category = category
                ? {
                    _id: (category as any)._id.toString(),
                    title: (category as any).title,
                    slug: (category as any).slug,
                  }
                : (relatedBlog as any).category;

              (relatedBlog as any).author = author
                ? {
                    _id: (author as any)._id.toString(),
                    name: (author as any).name,
                    avatar: (author as any).avatar,
                  }
                : (relatedBlog as any).author;
            } catch (error) {
              console.log("Related blog data fetch failed:", error);
            }
          }
        }
      } catch (error) {
        console.log("Related blogs fetch failed:", error);
      }
    }

    // Convert ObjectId to string for JSON serialization
    const serializedBlog = JSON.parse(JSON.stringify(blog));
    const serializedRelatedBlogs = JSON.parse(JSON.stringify(relatedBlogs));

    // Ensure categoryName is set (in case it's not in the database)
    if (serializedBlog.category && !serializedBlog.categoryName) {
      serializedBlog.categoryName = serializedBlog.category.title;
    }

    // Ensure categoryName is set for related blogs
    serializedRelatedBlogs.forEach((relatedBlog: any) => {
      if (
        relatedBlog.category &&
        relatedBlog.category.title &&
        !relatedBlog.categoryName
      ) {
        relatedBlog.categoryName = relatedBlog.category.title;
      }
    });

    // Increment view count (this should not be cached)
    try {
      await Blog.findByIdAndUpdate(serializedBlog._id, {
        $inc: { views: 1 },
      });
    } catch (error) {
      console.error("Error incrementing view count:", error);
      // Don't fail the request if view count update fails
    }

    console.log("Blog data processed successfully");

    return NextResponse.json({
      success: true,
      data: {
        blog: serializedBlog,
        relatedBlogs: serializedRelatedBlogs,
      },
    });
  } catch (error) {
    console.error("Error fetching blog by slug:", error);

    // Return specific error messages for debugging
    if (error instanceof Error) {
      if (error.message.includes("timeout")) {
        return NextResponse.json(
          { success: false, error: "Database timeout" },
          { status: 504 }
        );
      } else if (error.message.includes("connection")) {
        return NextResponse.json(
          { success: false, error: "Database connection failed" },
          { status: 503 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to fetch blog" },
      { status: 500 }
    );
  }
}
