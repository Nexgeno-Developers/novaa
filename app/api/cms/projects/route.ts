import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidateTag, revalidatePath } from "next/cache";

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({})
      .populate("category")
      .sort({ order: 1 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const data = await request.json();

    // Extract all fields including slug and projectDetail
    const {
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

    // Create default project detail structure
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
        description:
          "Secure high returns with exclusive, time-sensitive opportunities.",
        backgroundImage: "",
        plans: [],
      },
      gateway: {
        title: "A place to come home to",
        subtitle: "and a location that",
        highlightText: "holds its value.",
        description:
          "Set between Layan and Bangtao, this address offers more than scenery.",
        sectionTitle: "Your Gateway to Paradise",
        sectionDescription:
          "Perfectly positioned where tropical elegance meets modern convenience.",
        backgroundImage: "",
        mapImage: "",
        categories: [],
      },
    };

    const project = await Project.create({
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
      projectDetail: projectDetail || defaultProjectDetail,
    });

    const populatedProject = await Project.findById(project._id).populate(
      "category"
    );

    // Revalidate ALL caches that depend on projects
    const tagsToRevalidate = [
      "projects",
      "categories",
      "project-sections",
      "sections",
      "home-sections",
      "home-page-sections",
      "project-details",
      `project-slug-${slug}`, // Add slug-specific cache tag
      `project-detail-${slug}` // Add slug-specific cache tag
    ];

    // Revalidate cache tags
    tagsToRevalidate.forEach(tag => {
      console.log(`Revalidating tag: ${tag}`);
      revalidateTag(tag);
    });

    // Revalidate specific paths
    revalidatePath('/'); // Home page
    revalidatePath('/project'); // Projects page
    revalidatePath(`/project-detail/${slug}`); // New project detail page

    console.log('Project created and caches revalidated:', {
      projectId: project._id,
      projectSlug: slug,
      revalidatedTags: tagsToRevalidate,
      timestamp: new Date().toISOString()
    });

    return NextResponse.json({ success: true, data: populatedProject });
  } catch (error : any) {
    console.error("Error creating project:", error);
    
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
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}