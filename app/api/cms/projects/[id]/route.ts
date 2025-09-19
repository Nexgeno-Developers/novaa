import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidateTag, revalidatePath } from "next/cache";

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

    // Extract all fields
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

    if (projectDetail) {
      updateData.projectDetail = projectDetail;
    }

    // Update the project
    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("category");

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: "Project not found after update" },
        { status: 404 }
      );
    }

    console.log(`[CMS UPDATE] Project updated: ${updatedProject.name} (${updatedProject.slug})`);

    // IMMEDIATE cache invalidation - this is the key!
    try {
      console.log("[REVALIDATION] Starting cache invalidation...");
      
      // Revalidate cache tags (this clears the unstable_cache)
      revalidateTag("projects");
      revalidateTag("project-details");
      
      // Revalidate specific paths
      revalidatePath(`/project-detail/${updatedProject.slug}`);
      
      // If slug changed, also revalidate old path
      if (oldSlug && oldSlug !== updatedProject.slug) {
        revalidatePath(`/project-detail/${oldSlug}`);
      }
      
      // Revalidate home page and projects listing
      revalidatePath("/");
      revalidatePath("/project");
      
      console.log("[REVALIDATION] Cache invalidation completed successfully");
      
    } catch (revalidateError) {
      console.error("[REVALIDATION ERROR]", revalidateError);
      // Continue with response even if revalidation fails
    }

    return NextResponse.json({ 
      success: true, 
      data: updatedProject,
      message: "Project updated and cache invalidated"
    });

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

// Also update POST method for consistency
export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

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

    if (!name || !slug) {
      return NextResponse.json(
        { success: false, error: "Name and slug are required" },
        { status: 400 }
      );
    }

    const defaultProjectDetail = {
      hero: {
        backgroundImage: "",
        title: name,
        subtitle: "",
        scheduleMeetingButton: "Schedule a meeting",
        getBrochureButton: "Get Brochure",
        brochurePdf: "",
      },
      projectHighlights: {
        backgroundImage: "",
        description: "",
        highlights: [],
      },
      keyHighlights: {
        backgroundImage: "",
        description: "",
        highlights: [],
      },
      modernAmenities: {
        title: "MODERN AMENITIES FOR A BALANCED LIFESTYLE",
        description: "",
        amenities: [],
      },
      masterPlan: {
        title: "",
        subtitle: "",
        description: "",
        backgroundImage: "",
        tabs: [],
      },
      investmentPlans: {
        title: "LIMITED-TIME INVESTMENT PLANS",
        description: "Secure high returns with exclusive, time-sensitive opportunities.",
        backgroundImage: "",
        plans: [],
      },
      gateway: {
        title: "A place to come home to",
        subtitle: "and a location that",
        highlightText: "holds its value.",
        description: "Set between Layan and Bangtao, this address offers more than scenery.",
        sectionTitle: "Your Gateway to Paradise",
        sectionDescription: "Perfectly positioned where tropical elegance meets modern convenience.",
        backgroundImage: "",
        mapImage: "",
        categories: [],
      },
    };

    const project = await Project.create({
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
      projectDetail: projectDetail || defaultProjectDetail,
    });

    const populatedProject = await Project.findById(project._id).populate("category");

    console.log(`[CMS CREATE] New project created: ${populatedProject.name} (${populatedProject.slug})`);

    // Immediate cache invalidation for new project
    try {
      revalidateTag("projects");
      revalidateTag("project-details");
      revalidatePath("/");
      revalidatePath("/project");
      revalidatePath(`/project-detail/${slug}`);
      
      console.log("[REVALIDATION] Cache invalidated for new project");
    } catch (revalidateError) {
      console.error("[REVALIDATION ERROR]", revalidateError);
    }

    return NextResponse.json({ 
      success: true, 
      data: populatedProject,
      message: "Project created and cache invalidated"
    });

  } catch (error: any) {
    console.error("Error creating project:", error);
    
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
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
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

    console.log(`[CMS DELETE] Project deleted: ${project.name} (${project.slug})`);

    // Immediate cache invalidation for deleted project
    try {
      revalidateTag("projects");
      revalidateTag("project-details");
      revalidatePath("/");
      revalidatePath("/project");
      revalidatePath(`/project-detail/${project.slug}`);
      
      console.log("[REVALIDATION] Cache invalidated for deleted project");
    } catch (revalidateError) {
      console.error("[REVALIDATION ERROR]", revalidateError);
    }

    return NextResponse.json({
      success: true,
      message: "Project deleted and cache invalidated",
    });

  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete project" },
      { status: 500 }
    );
  }
}