// api/cms/projects/[id]/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidateTag, revalidatePath } from "next/cache";

// Helper function to revalidate all project-related caches
function revalidateProjectCaches(projectId?: string) {
  const tagsToRevalidate = [
    "projects", // Project data cache
    "categories", // Category data cache
    "project-sections", // Project page sections cache
    "sections", // General sections cache
    "home-sections", // Home page sections cache - KEY FIX!
    "home-page-sections", // Alternative home page cache key - KEY FIX!
    "project-details", // Project detail pages cache
  ];

  // Add specific project cache tag if projectId provided
  if (projectId) {
    tagsToRevalidate.push(`project-${projectId}`);
  }

  // Revalidate cache tags
  tagsToRevalidate.forEach((tag) => {
    console.log(`Revalidating tag: ${tag}`);
    revalidateTag(tag);
  });

  // Also revalidate specific paths for good measure
  revalidatePath(`/project-detail/${projectId}`);
  revalidatePath("/"); // Home page
  revalidatePath("/project"); // Projects page

  return tagsToRevalidate;
}

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

    // Revalidate ALL project-related caches including home page
    const revalidatedTags = revalidateProjectCaches(id);

    console.log("Project updated and caches revalidated:", {
      projectId: id,
      projectName: project.name,
      revalidatedTags,
      timestamp: new Date().toISOString(),
    });

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

    // Revalidate ALL project-related caches including home page
    const revalidatedTags = revalidateProjectCaches();

    console.log("Project deleted and caches revalidated:", {
      projectId: id,
      deletedProject: project.name,
      revalidatedTags,
      timestamp: new Date().toISOString(),
    });

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
