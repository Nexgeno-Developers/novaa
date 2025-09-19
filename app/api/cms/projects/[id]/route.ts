import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidateTag, revalidatePath } from "next/cache";

// Helper function to revalidate all project-related caches
async function revalidateProjectCaches(projectSlug?: string, oldSlug?: string) {
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
    "/", // Home page
    "/project", // Projects page
  ];

  if (projectSlug) {
    pathsToRevalidate.push(`/project-detail/${projectSlug}`);
  }

  if (oldSlug && oldSlug !== projectSlug) {
    pathsToRevalidate.push(`/project-detail/${oldSlug}`);
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
  let updatedProject : any = null;
  let oldSlug : any = null;
  
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

    oldSlug = currentProject.slug;

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
    };

    // Add projectDetail if provided
    if (projectDetail) {
      updateData.projectDetail = projectDetail;
    }

    // Update the project
    updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: "Project not found after update" },
        { status: 404 }
      );
    }

    console.log("Project updated successfully:", {
      projectId: id,
      projectName: updatedProject.name,
      newSlug: updatedProject.slug,
      oldSlug: oldSlug,
      slugChanged: oldSlug !== updatedProject.slug,
      timestamp: new Date().toISOString(),
    });

    // Return success response immediately
    const response = NextResponse.json({ 
      success: true, 
      data: updatedProject 
    });

    // Trigger cache revalidation asynchronously (don't wait for it)
    setImmediate(async () => {
      try {
        const revalidationResults = await revalidateProjectCaches(updatedProject.slug, oldSlug);
        console.log("Cache revalidation completed:", {
          projectId: id,
          revalidationResults,
          timestamp: new Date().toISOString(),
        });
      } catch (revalidationError) {
        console.error("Cache revalidation failed:", revalidationError);
      }
    });

    return response;

  } catch (error: any) {
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

    console.log("Project deleted successfully:", {
      projectId: id,
      deletedProject: project.name,
      deletedSlug: project.slug,
      timestamp: new Date().toISOString(),
    });

    // Return success response immediately
    const response = NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });

    // Trigger cache revalidation asynchronously
    setImmediate(async () => {
      try {
        const revalidationResults = await revalidateProjectCaches(project.slug);
        console.log("Delete cache revalidation completed:", {
          projectId: id,
          revalidationResults,
          timestamp: new Date().toISOString(),
        });
      } catch (revalidationError) {
        console.error("Delete cache revalidation failed:", revalidationError);
      }
    });

    return response;

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}