// api/cms/projects/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidateTag } from "next/cache";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const project = await Project.findById(id).populate("category");

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Error fetching project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch project" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const data = await request.json();

    // Extract all fields including projectDetail
    const {
      name,
      price,
      images,
      location,
      description,
      badge,
      category,
      categoryName,
      isActive,
      order,
      projectDetail,
    } = data;

    const updateData: any = {
      name,
      price,
      images,
      location,
      description,
      badge,
      category,
      categoryName,
      isActive,
      order,
    };

    // Add projectDetail if provided
    if (projectDetail) {
      updateData.projectDetail = projectDetail;
    }

    const project = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    revalidateTag("projects");
    revalidateTag("project-sections");
    revalidateTag("sections");
    revalidateTag(`project-${id}`); // Revalidate specific project detail page
    revalidateTag('project-details');

    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    console.error("Error updating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;

    const project = await Project.findByIdAndDelete(id);

    if (!project) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    revalidateTag("projects");
    revalidateTag("project-sections");
    revalidateTag("sections");

    return NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}
