import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidateTag, revalidatePath } from "next/cache";

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

    console.log("Project updated successfully:", {
      projectId: id,
      projectName: project.name,
      newSlug: project.slug,
      oldSlug: oldSlug,
      slugChanged: oldSlug !== project.slug,
      timestamp: new Date().toISOString(),
    });

    // Return response immediately
    const response = NextResponse.json({ 
      success: true, 
      data: project,
      message: "Project updated successfully"
    });

    // Background cache revalidation (non-blocking)
    setImmediate(async () => {
      try {
        const baseTagsToRevalidate = [
          "projects",
          "categories",
          "home-sections",
          "project-sections",
          "sections",
          "project-details",
        ];

        // Add slug-specific cache tags
        const slugSpecificTags = [];
        if (project.slug) {
          slugSpecificTags.push(`project-slug-${project.slug}`);
          slugSpecificTags.push(`project-detail-${project.slug}`);
        }

        // Also clear old slug cache if slug changed
        if (oldSlug && oldSlug !== project.slug) {
          slugSpecificTags.push(`project-slug-${oldSlug}`);
          slugSpecificTags.push(`project-detail-${oldSlug}`);
        }

        const allTags = [...baseTagsToRevalidate, ...slugSpecificTags];

        // Revalidate cache tags with small delays
        for (const tag of allTags) {
          try {
            console.log(`Revalidating tag: ${tag}`);
            revalidateTag(tag);
            await new Promise(resolve => setTimeout(resolve, 10));
          } catch (error) {
            console.error(`Error revalidating tag ${tag}:`, error);
          }
        }

        // Revalidate specific paths with delays
        const pathsToRevalidate = ["/", "/project"];
        
        if (project.slug) {
          pathsToRevalidate.push(`/project-detail/${project.slug}`);
        }
        
        if (oldSlug && oldSlug !== project.slug) {
          pathsToRevalidate.push(`/project-detail/${oldSlug}`);
        }

        for (const path of pathsToRevalidate) {
          try {
            console.log(`Revalidating path: ${path}`);
            revalidatePath(path);
            await new Promise(resolve => setTimeout(resolve, 50));
          } catch (error) {
            console.error(`Error revalidating path ${path}:`, error);
          }
        }

        console.log("Background cache revalidation completed for updated project:", {
          projectId: id,
          allTags,
          pathsToRevalidated: pathsToRevalidate,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Background cache revalidation failed:", error);
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

    // Return response immediately
    const response = NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });

    // Background cache revalidation (non-blocking)
    setImmediate(async () => {
      try {
        const tagsToRevalidate = [
          "projects",
          "categories",
          "home-sections",
          "project-sections",
          "sections",
          "project-details",
          `project-slug-${project.slug}`,
          `project-detail-${project.slug}`,
        ];

        for (const tag of tagsToRevalidate) {
          try {
            console.log(`Revalidating tag after deletion: ${tag}`);
            revalidateTag(tag);
            await new Promise(resolve => setTimeout(resolve, 10));
          } catch (error) {
            console.error(`Error revalidating tag ${tag}:`, error);
          }
        }

        const pathsToRevalidate = ["/", "/project", `/project-detail/${project.slug}`];
        for (const path of pathsToRevalidate) {
          try {
            console.log(`Revalidating path after deletion: ${path}`);
            revalidatePath(path);
            await new Promise(resolve => setTimeout(resolve, 50));
          } catch (error) {
            console.error(`Error revalidating path ${path}:`, error);
          }
        }

        console.log("Background cache revalidation after deletion completed");
      } catch (error) {
        console.error("Background cache revalidation after deletion failed:", error);
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