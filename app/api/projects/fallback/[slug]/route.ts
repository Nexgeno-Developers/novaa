import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import Category from "@/models/Category"; // Import to ensure schema registration

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    // Validate slug
    if (!slug || typeof slug !== "string" || slug.trim().length === 0) {
      return NextResponse.json(
        { success: false, error: "Invalid slug provided" },
        { status: 400 }
      );
    }

    await connectDB();

    const project = await Project.findOne({
      slug: slug.trim().toLowerCase(),
      isActive: true,
    })
      .populate("category", "name _id")
      .lean()
      .maxTimeMS(20000); // 20 second timeout for fallback

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Convert ObjectId to string for JSON serialization
    const serializedProject = JSON.parse(JSON.stringify(project));

    return NextResponse.json({
      success: true,
      data: serializedProject,
    });
  } catch (error) {
    console.error("Error in fallback API:", error);

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
      } else if (error.message.includes("Schema hasn't been registered")) {
        return NextResponse.json(
          { success: false, error: "Schema registration error" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}
