// app/api/cms/projects/clone/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidatePath } from "next/cache";

export const maxDuration = 30; // Critical for Vercel serverless
export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    console.log("Starting clone operation...");
    
    // Parse request body
    const body = await request.json();
    const { projectId } = body;

    if (!projectId) {
      console.error("No projectId provided");
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    console.log("Connecting to database...");
    await connectDB();

    console.log("Fetching original project:", projectId);
    // Fetch the original project with lean() for better performance
    const originalProject = await Project.findById(projectId)
      .populate("category")
      .lean()
      .exec() as any;
    
    if (!originalProject) {
      console.error("Project not found:", projectId);
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    console.log("Original project found:", originalProject.name);

    // Generate unique name
    const originalName = originalProject.name;
    const escapedName = originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const copyPattern = new RegExp(`^${escapedName} \\(Copy( \\d+)?\\)$`);
    
    console.log("Finding existing copies...");
    const existingCopies = await Project.find({ 
      name: copyPattern 
    })
    .select('name') // Only fetch name field for performance
    .sort({ name: 1 })
    .lean()
    .exec();

    let newName: string;
    if (existingCopies.length === 0) {
      newName = `${originalName} (Copy)`;
    } else {
      // Extract copy numbers and find the highest
      const copyNumbers = existingCopies
        .map(p => {
          const match = p.name.match(/\(Copy( (\d+))?\)$/);
          if (!match) return 0;
          return match[2] ? parseInt(match[2]) : 1;
        })
        .filter(n => !isNaN(n));
      
      const maxNumber = Math.max(...copyNumbers, 0);
      newName = `${originalName} (Copy ${maxNumber + 1})`;
    }

    console.log("New name generated:", newName);

    // Generate unique slug from the new name
    const baseSlug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let newSlug = baseSlug;
    let slugCounter = 1;
    
    console.log("Checking slug uniqueness...");
    // Check slug uniqueness with a limit to prevent infinite loop
    let attempts = 0;
    const maxAttempts = 100;
    
    while (attempts < maxAttempts) {
      const existingSlug = await Project.findOne({ slug: newSlug })
        .select('_id')
        .lean()
        .exec();
      
      if (!existingSlug) break;
      
      newSlug = `${baseSlug}-${slugCounter}`;
      slugCounter++;
      attempts++;
    }

    if (attempts >= maxAttempts) {
      console.error("Failed to generate unique slug after", maxAttempts, "attempts");
      return NextResponse.json(
        { success: false, error: "Failed to generate unique slug. Please try again." },
        { status: 500 }
      );
    }

    console.log("New slug generated:", newSlug);

    // Prepare cloned project data - remove _id and other mongoose fields
    const { _id, __v, createdAt, updatedAt, ...projectData } = originalProject as any;
    const src = originalProject as any;
    
    const clonedData = {
      ...projectData,
      name: newName,
      slug: newSlug,
      isActive: false, // Set to inactive by default
      // Ensure category is just the ID
      category: typeof src?.category === 'object'
        ? (src.category as any)._id
        : src.category,
      // Deep clone projectDetail if it exists
      projectDetail: src.projectDetail
        ? JSON.parse(JSON.stringify(src.projectDetail))
        : undefined,
      // Clone images array
      images: Array.isArray(src.images)
        ? [...src.images]
        : []
    };

    console.log("Creating cloned project...");
    // Create the cloned project
    const clonedProject = await Project.create(clonedData);

    console.log("Cloned project created:", clonedProject._id);

    // Populate the category for the response
    const populatedClonedProject = await Project.findById(clonedProject._id)
      .populate("category")
      .lean()
      .exec();

    // Revalidate relevant paths
    try {
      revalidatePath("/", "page");
      revalidatePath("/project", "page");
      revalidatePath("/api/cms/projects", "page");
      revalidatePath("/api/public/curated-collection", "page");
    } catch (revalidateError) {
      console.error("Revalidation error (non-critical):", revalidateError);
      // Continue even if revalidation fails
    }

    console.log("Project cloned successfully:", {
      originalId: projectId,
      originalName: originalName,
      clonedId: clonedProject._id,
      clonedName: newName,
      clonedSlug: newSlug,
      timestamp: new Date().toISOString(),
    });

    return NextResponse.json({ 
      success: true, 
      data: populatedClonedProject,
      message: `Project cloned as "${newName}"` 
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("Error cloning project - Full error:", error);
    console.error("Error stack:", error.stack);
    console.error("Error name:", error.name);
    console.error("Error code:", error.code);

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

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Failed to generate unique slug for cloned project. Please try again." 
        },
        { status: 400 }
      );
    }

    // Handle MongoDB connection errors
    if (error.name === "MongooseError" || error.name === "MongoError") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Database connection error. Please try again." 
        },
        { status: 503 }
      );
    }

    // Handle timeout errors
    if (error.message?.includes("timeout") || error.code === "ETIMEDOUT") {
      return NextResponse.json(
        { 
          success: false, 
          error: "Request timeout. The project may be too large to clone. Try reducing data size." 
        },
        { status: 504 }
      );
    }

    // Generic error response with more details in development
    const isDevelopment = process.env.NODE_ENV === "development";
    
    return NextResponse.json(
      { 
        success: false, 
        error: isDevelopment 
          ? `Failed to clone project: ${error.message}` 
          : "Failed to clone project. Please try again or contact support.",
        ...(isDevelopment && { details: error.stack })
      },
      { status: 500 }
    );
  }
}