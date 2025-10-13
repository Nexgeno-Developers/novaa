// app/api/cms/projects/clone/route.ts

import { NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Project from "@/models/Project";
import { revalidatePath } from "next/cache";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { projectId } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { success: false, error: "Project ID is required" },
        { status: 400 }
      );
    }

    // Fetch the original project
    const originalProject = await Project.findById(projectId).populate("category");
    
    if (!originalProject) {
      return NextResponse.json(
        { success: false, error: "Project not found" },
        { status: 404 }
      );
    }

    // Generate unique name
    const originalName = originalProject.name;
    const escapedName = originalName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const copyPattern = new RegExp(`^${escapedName} \\(Copy( \\d+)?\\)$`);
    
    const existingCopies = await Project.find({ 
      name: copyPattern 
    }).sort({ name: 1 });

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

    // Generate unique slug from the new name
    const baseSlug = newName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    let newSlug = baseSlug;
    let slugCounter = 1;
    
    // Check slug uniqueness
    while (await Project.findOne({ slug: newSlug })) {
      newSlug = `${baseSlug}-${slugCounter}`;
      slugCounter++;
    }

    // Prepare cloned project data
    const clonedData = {
      name: newName,
      slug: newSlug,
      price: originalProject.price,
      images: [...originalProject.images], // Clone array
      location: originalProject.location,
      description: originalProject.description,
      badge: originalProject.badge,
      category: originalProject.category._id,
      categoryName: originalProject.categoryName,
      isActive: false, // Set to inactive by default
      order: originalProject.order,
      projectDetail: originalProject.projectDetail ? JSON.parse(JSON.stringify(originalProject.projectDetail)) : undefined
    };

    // Create the cloned project
    const clonedProject = await Project.create(clonedData);

    // Populate the category for the response
    const populatedClonedProject = await Project.findById(clonedProject._id).populate("category");

    // Revalidate relevant paths
    revalidatePath("/", "page");
    revalidatePath("/project", "page");
    revalidatePath("/api/cms/projects", "page");
    revalidatePath("/api/public/curated-collection", "page");

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
    });
  } catch (error: any) {
    console.error("Error cloning project:", error);

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
        { success: false, error: "Failed to generate unique slug for cloned project" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to clone project" },
      { status: 500 }
    );
  }
}