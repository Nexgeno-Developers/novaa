// import { NextResponse } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Project from "@/models/Project";
// import { revalidateTag, revalidatePath } from "next/cache";

// // Helper function to revalidate all project-related caches
// function revalidateProjectCaches(projectSlug?: string, oldSlug?: string) {
//   const tagsToRevalidate = [
//     "projects",
//     "categories",
//     "project-sections",
//     "sections",
//     "home-sections",
//     "home-page-sections",
//     "project-details",
//   ];

//   // Add slug-specific cache tags
//   if (projectSlug) {
//     tagsToRevalidate.push(`project-slug-${projectSlug}`);
//   tagsToRevalidate.push(`project-detail-${projectSlug}`);
//   }

//   // Also clear old slug cache if slug changed
//   if (oldSlug && oldSlug !== projectSlug) {
//     tagsToRevalidate.push(`project-slug-${oldSlug}`);
//     tagsToRevalidate.push(`project-detail-${oldSlug}`);
//   }

//   // Revalidate cache tags
//   tagsToRevalidate.forEach((tag) => {
//     console.log(`Revalidating tag: ${tag}`);
//     revalidateTag(tag);
//   });

//   // Revalidate specific slug-based paths
//   if (projectSlug) {
//     revalidatePath(`/project-detail/${projectSlug}`);
//   }

//   // Also revalidate old slug path if changed
//   if (oldSlug && oldSlug !== projectSlug) {
//     revalidatePath(`/project-detail/${oldSlug}`);
//   }

//   revalidatePath("/");
//   revalidatePath("/project");

//   return tagsToRevalidate;
// }

// export async function GET(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const { id } = await params;

//     const project = await Project.findById(id).populate("category");

//     if (!project) {
//       return NextResponse.json(
//         { success: false, error: "Project not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, data: project });
//   } catch (error) {
//     console.error("Error fetching project:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to fetch project" },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const { id } = await params;
//     const data = await request.json();

//     // Get the current project to check if slug changed
//     const currentProject = await Project.findById(id);
//     if (!currentProject) {
//       return NextResponse.json(
//         { success: false, error: "Project not found" },
//         { status: 404 }
//       );
//     }

//     const oldSlug = currentProject.slug;

//     // Extract all fields including slug and projectDetail
//     const {
//       name,
//       slug,
//       price,
//       images,
//       location,
//       description,
//       badge,
//       category,
//       categoryName,
//       isActive,
//       order,
//       projectDetail,
//     } = data;

//     // Validate required fields
//     if (!name) {
//       return NextResponse.json(
//         { success: false, error: "Project name is required" },
//         { status: 400 }
//       );
//     }

//     if (!description) {
//       return NextResponse.json(
//         { success: false, error: "Project description is required" },
//         { status: 400 }
//       );
//     }

//     if (!slug) {
//       return NextResponse.json(
//         { success: false, error: "Project slug is required" },
//         { status: 400 }
//       );
//     }

//     const updateData: any = {
//       name,
//       slug, // Add this line
//       price,
//       images,
//       location,
//       description,
//       badge,
//       category,
//       categoryName,
//       isActive,
//       order,
//     };

//     // Add projectDetail if provided
//     if (projectDetail) {
//       updateData.projectDetail = projectDetail;
//     }

//     const project = await Project.findByIdAndUpdate(id, updateData, {
//       new: true,
//       runValidators: true,
//     }).populate("category");

//     if (!project) {
//       return NextResponse.json(
//         { success: false, error: "Project not found" },
//         { status: 404 }
//       );
//     }

//     // Revalidate ALL project-related caches including old and new slug paths
//     const revalidatedTags = revalidateProjectCaches(project.slug, oldSlug);

//     console.log("Project updated and caches revalidated:", {
//       projectId: id,
//       projectName: project.name,
//       newSlug: project.slug,
//       oldSlug: oldSlug,
//       slugChanged: oldSlug !== project.slug,
//       revalidatedTags,
//       timestamp: new Date().toISOString(),
//     });

//     return NextResponse.json({ success: true, data: project });
//   } catch (error : any) {
//     console.error("Error updating project:", error);
    
//     // Handle specific validation errors
//     if (error.name === 'ValidationError') {
//       const validationErrors = Object.values(error.errors).map((err: any) => err.message);
//       return NextResponse.json(
//         { success: false, error: `Validation failed: ${validationErrors.join(', ')}` },
//         { status: 400 }
//       );
//     }

//     // Handle duplicate key errors (slug already exists)
//     if (error.code === 11000) {
//       return NextResponse.json(
//         { success: false, error: "Project with this slug already exists" },
//         { status: 400 }
//       );
//     }

//     return NextResponse.json(
//       { success: false, error: "Failed to update project" },
//       { status: 500 }
//     );
//   }
// }

// export async function DELETE(
//   request: Request,
//   { params }: { params: Promise<{ id: string }> }
// ) {
//   try {
//     await connectDB();
//     const { id } = await params;

//     const project = await Project.findByIdAndDelete(id);

//     if (!project) {
//       return NextResponse.json(
//         { success: false, error: "Project not found" },
//         { status: 404 }
//       );
//     }

//     // Revalidate ALL project-related caches including the deleted project's slug
//     const revalidatedTags = revalidateProjectCaches(project.slug);

//     console.log("Project deleted and caches revalidated:", {
//       projectId: id,
//       deletedProject: project.name,
//       deletedSlug: project.slug,
//       revalidatedTags,
//       timestamp: new Date().toISOString(),
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Project deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting project:", error);
//     return NextResponse.json(
//       { success: false, error: "Failed to delete project" },
//       { status: 500 }
//     );
//   }
// }

// api/cms/projects/[id]/route.ts - Enhanced version with cache event notifications
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidateTag, revalidatePath } from "next/cache";

// Helper to validate if fresh cache is ready
async function validateCacheRefresh(slug: string, maxAttempts: number = 3): Promise<boolean> {
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Try to fetch the updated project to verify cache is working
      await connectDB();
      const project = await Project.findOne({ slug, isActive: true })
        .populate("category", "name _id")
        .lean();
      
      if (project) {
        console.log(`[CACHE_VALIDATION] Cache validation successful for ${slug} on attempt ${attempt}`);
        return true;
      }
    } catch (error) {
      console.log(`[CACHE_VALIDATION] Validation attempt ${attempt} failed for ${slug}:`, error);
    }
    
    if (attempt < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second between attempts
    }
  }
  
  console.log(`[CACHE_VALIDATION] Cache validation failed for ${slug} after ${maxAttempts} attempts`);
  return false;
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

    // Extract and validate fields
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

    if (!name || !description || !slug) {
      return NextResponse.json(
        { success: false, error: "Required fields missing" },
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

    // Return response immediately with cache refresh status
    const response = NextResponse.json({ 
      success: true, 
      data: project,
      message: "Project updated successfully",
      cacheRefresh: {
        status: "in-progress",
        slug: project.slug,
        oldSlug: oldSlug !== project.slug ? oldSlug : null
      }
    });

    // Enhanced background cache revalidation with validation
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

        const slugSpecificTags = [];
        if (project.slug) {
          slugSpecificTags.push(`project-slug-${project.slug}`);
          slugSpecificTags.push(`project-detail-${project.slug}`);
        }

        if (oldSlug && oldSlug !== project.slug) {
          slugSpecificTags.push(`project-slug-${oldSlug}`);
          slugSpecificTags.push(`project-detail-${oldSlug}`);
        }

        const allTags = [...baseTagsToRevalidate, ...slugSpecificTags];

        // Phase 1: Revalidate cache tags
        console.log(`[CACHE_REFRESH] Starting cache revalidation for project ${id}`);
        for (const tag of allTags) {
          try {
            console.log(`[CACHE_REFRESH] Revalidating tag: ${tag}`);
            revalidateTag(tag);
            await new Promise(resolve => setTimeout(resolve, 10));
          } catch (error) {
            console.error(`[CACHE_REFRESH] Error revalidating tag ${tag}:`, error);
          }
        }

        // Phase 2: Revalidate paths
        const pathsToRevalidate = ["/", "/project"];
        
        if (project.slug) {
          pathsToRevalidate.push(`/project-detail/${project.slug}`);
        }
        
        if (oldSlug && oldSlug !== project.slug) {
          pathsToRevalidate.push(`/project-detail/${oldSlug}`);
        }

        for (const path of pathsToRevalidate) {
          try {
            console.log(`[CACHE_REFRESH] Revalidating path: ${path}`);
            revalidatePath(path);
            await new Promise(resolve => setTimeout(resolve, 50));
          } catch (error) {
            console.error(`[CACHE_REFRESH] Error revalidating path ${path}:`, error);
          }
        }

        // Phase 3: Validate cache is working
        console.log(`[CACHE_REFRESH] Validating cache refresh for ${project.slug}`);
        const cacheValidated = await validateCacheRefresh(project.slug);

        if (cacheValidated) {
          console.log(`[CACHE_REFRESH] Cache refresh completed successfully for project ${id}`);
          
          // Emit cache refresh completion event (if using WebSockets or Server-Sent Events)
          // You can implement this based on your setup
          // io.emit(`cache-refreshed-project-${project.slug}`, { success: true });
          
        } else {
          console.error(`[CACHE_REFRESH] Cache validation failed for project ${id}`);
        }

        console.log("Background cache revalidation completed:", {
          projectId: id,
          success: cacheValidated,
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
    
    if (error.name === 'ValidationError') {
      const validationErrors = Object.values(error.errors).map((err: any) => err.message);
      return NextResponse.json(
        { success: false, error: `Validation failed: ${validationErrors.join(', ')}` },
        { status: 400 }
      );
    }

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

// Similar pattern for GET and DELETE methods...
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

    const response = NextResponse.json({
      success: true,
      message: "Project deleted successfully",
    });

    // Background cache cleanup
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
            console.log(`[CACHE_CLEANUP] Revalidating tag: ${tag}`);
            revalidateTag(tag);
            await new Promise(resolve => setTimeout(resolve, 10));
          } catch (error) {
            console.error(`[CACHE_CLEANUP] Error revalidating tag ${tag}:`, error);
          }
        }

        const pathsToRevalidate = ["/", "/project", `/project-detail/${project.slug}`];
        for (const path of pathsToRevalidate) {
          try {
            console.log(`[CACHE_CLEANUP] Revalidating path: ${path}`);
            revalidatePath(path);
            await new Promise(resolve => setTimeout(resolve, 50));
          } catch (error) {
            console.error(`[CACHE_CLEANUP] Error revalidating path ${path}:`, error);
          }
        }

        console.log("Background cache cleanup after deletion completed");
      } catch (error) {
        console.error("Background cache cleanup failed:", error);
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