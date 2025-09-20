import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidateTag, revalidatePath } from "next/cache";

// Helper function to revalidate all project-related caches
function revalidateProjectCaches(projectSlug?: string, oldSlug?: string) {
  const tagsToRevalidate = [
    "projects",
    "categories",
    "project-sections",
    "sections",
    "home-sections",
    "home-page-sections",
    "project-details",
  ];

  // Add slug-specific cache tags
  if (projectSlug) {
    tagsToRevalidate.push(`project-slug-${projectSlug}`);
  tagsToRevalidate.push(`project-detail-${projectSlug}`);
  }

  // Also clear old slug cache if slug changed
  if (oldSlug && oldSlug !== projectSlug) {
    tagsToRevalidate.push(`project-slug-${oldSlug}`);
    tagsToRevalidate.push(`project-detail-${oldSlug}`);
  }

  // Revalidate cache tags
  tagsToRevalidate.forEach((tag) => {
    console.log(`Revalidating tag: ${tag}`);
    revalidateTag(tag);
  });

  // Revalidate specific slug-based paths
  if (projectSlug) {
    revalidatePath(`/project-detail/${projectSlug}`);
  }

  // Also revalidate old slug path if changed
  if (oldSlug && oldSlug !== projectSlug) {
    revalidatePath(`/project-detail/${oldSlug}`);
  }

  revalidatePath("/");
  revalidatePath("/project");

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

    // Get the current project to check if slug changed
    const currentProject = await Project.findById(id);
    if (!currentProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    const oldSlug = currentProject.slug;

    // Extract all fields including slug and projectDetail
    const {
      name,
      slug,
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

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { success: false, error: "Project name is required" },
        { status: 400 }
      );
    }

    if (!description) {
      return NextResponse.json(
        { success: false, error: "Project description is required" },
        { status: 400 }
      );
    }

    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Project slug is required" },
        { status: 400 }
      );
    }

    const updateData: any = {
      name,
      slug, // Add this line
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

    // Revalidate ALL project-related caches including old and new slug paths
    const revalidatedTags = revalidateProjectCaches(project.slug, oldSlug);

    console.log("Project updated and caches revalidated:", {
      projectId: id,
      projectName: project.name,
      newSlug: project.slug,
      oldSlug: oldSlug,
      slugChanged: oldSlug !== project.slug,
      revalidatedTags,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error : any) {
    console.error("Error updating project:", error);
    
    // Handle specific validation errors
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

    // Handle duplicate key errors (slug already exists)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "Project with this slug already exists" },
        { status: 400 }
      );
    }

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

    // Revalidate ALL project-related caches including the deleted project's slug
    const revalidatedTags = revalidateProjectCaches(project.slug);

    console.log("Project deleted and caches revalidated:", {
      projectId: id,
      deletedProject: project.name,
      deletedSlug: project.slug,
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
