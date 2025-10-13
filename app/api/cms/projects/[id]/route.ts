// app/api/cms/projects/[id]/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidatePath } from "next/cache";

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

    // Comprehensive revalidation for updated projects with stale-while-revalidate
    // This triggers background revalidation while serving stale content
    revalidatePath(`/project-detail/${project.slug}`, "page");

    // If slug changed, also revalidate old path
    if (oldSlug !== project.slug) {
      revalidatePath(`/project-detail/${oldSlug}`, "page");
      revalidatePath(`/api/projects/slug/${oldSlug}`, "page");
      revalidatePath(`/api/cms/projects/slug/${oldSlug}`, "page");
    }

    // Revalidate listing pages
    revalidatePath("/", "page");
    revalidatePath("/project", "page");

    // Revalidate API routes
    revalidatePath(`/api/projects/slug/${project.slug}`, "page");
    revalidatePath(`/api/cms/projects/slug/${project.slug}`, "page");
    revalidatePath("/api/cms/projects", "page");
    revalidatePath("/api/public/curated-collection", "page");

    console.log("Project updated and paths revalidated:", {
      projectId: id,
      projectName: project.name,
      newSlug: project.slug,
      oldSlug: oldSlug,
      slugChanged: oldSlug !== project.slug,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ success: true, data: project });
  } catch (error: any) {
    console.error("Error updating project:", error);

    // Handle specific validation errors
    if (error.name === "ValidationError") {
      const validationErrors = Object.values(error.errors).map(
        (err: any) => err.message
      );
      return NextResponse.json(
        {
          success: false,
          error: `Validation failed: ${validationErrors.join(", ")}`,
        },
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

    // Comprehensive revalidation for deleted projects with stale-while-revalidate
    revalidatePath(`/project-detail/${project.slug}`, "page");
    revalidatePath("/", "page");
    revalidatePath("/project", "page");
    revalidatePath(`/api/projects/slug/${project.slug}`, "page");
    revalidatePath(`/api/cms/projects/slug/${project.slug}`, "page");
    revalidatePath("/api/cms/projects", "page");
    revalidatePath("/api/public/curated-collection", "page");

    console.log("Project deleted and paths revalidated:", {
      projectId: id,
      deletedProject: project.name,
      deletedSlug: project.slug,
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
