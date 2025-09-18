import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const slug = searchParams.get('slug');
    const excludeId = searchParams.get('excludeId'); // For edit mode

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const query: any = { slug };
    if (excludeId) {
      query._id = { $ne: excludeId };
    }

    const existingProject = await Project.findOne(query);

    return NextResponse.json({
      success: true,
      exists: !!existingProject,
      data: existingProject ? { name: existingProject.name, slug: existingProject.slug } : null
    });
  } catch (error) {
    console.error("Error checking slug:", error);
    return NextResponse.json(
      { success: false, error: "Failed to check slug" },
      { status: 500 }
    );
  }
}