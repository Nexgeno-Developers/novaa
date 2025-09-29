import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";

export async function POST(request: Request) {
  try {
    const { slug } = await request.json();

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
    }).lean();

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        exists: true,
        project: {
          _id: (project as any)._id,
          name: (project as any).name,
          slug: (project as any).slug,
          isActive: (project as any).isActive,
        },
      },
    });
  } catch (error) {
    console.error("Error validating project slug:", error);
    return NextResponse.json(
      { success: false, error: "Failed to validate project slug" },
      { status: 500 }
    );
  }
}
