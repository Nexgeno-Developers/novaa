// api/cms/projects/route.ts
import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidateTag } from "next/cache";

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

    // Extract all fields including projectDetail with gateway section
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

    // Create default project detail structure with gateway section
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

    // Revalidate caches that depend on projects
    revalidateTag("projects");
    revalidateTag("project-sections");
    revalidateTag("sections");
    revalidateTag("project-details"); // For all project detail pages

    return NextResponse.json({ success: true, data: populatedProject });
  } catch (error) {
    console.error("Error creating project:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create project" },
      { status: 500 }
    );
  }
}
