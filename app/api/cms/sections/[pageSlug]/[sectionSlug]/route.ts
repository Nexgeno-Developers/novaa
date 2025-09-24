// import { NextRequest } from "next/server";
// import connectDB from "@/lib/mongodb";
// import Section from "@/models/Section";
// import { getTokenFromRequest, verifyToken } from "@/lib/auth";
// import { revalidateTag } from "next/cache";

// // GET - Fetch specific section (admin only)
// export async function GET(
//   request: NextRequest,
//   { params }: { params: Promise<{ pageSlug: string; sectionSlug: string }> }
// ) {
//   try {
//     await connectDB();

//     const { pageSlug, sectionSlug } = await params;

//     const section = await Section.findOne({
//       pageSlug: decodeURIComponent(pageSlug),
//       slug: decodeURIComponent(sectionSlug),
//     }).lean();

//     if (!section) {
//       return Response.json({ message: "Section not found" }, { status: 404 });
//     }

//     return Response.json(section);
//   } catch (error) {
//     console.error("Section fetch error:", error);
//     return Response.json({ message: "Internal server error" }, { status: 500 });
//   }
// }

// // PUT - Update specific section (admin only)
// export async function PUT(
//   request: NextRequest,
//   { params }: { params: Promise<{ pageSlug: string; sectionSlug: string }> }
// ) {
//   try {
//     await connectDB();

//     // Verify admin authentication
//     const token = getTokenFromRequest(request);
//     if (!token || !verifyToken(token)) {
//       return Response.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { pageSlug, sectionSlug } = await params;
//     const updateData = await request.json();

//     const section = await Section.findOneAndUpdate(
//       {
//         pageSlug: decodeURIComponent(pageSlug),
//         slug: decodeURIComponent(sectionSlug),
//       },
//       updateData,
//       { new: true }
//     );

//     if (!section) {
//       return Response.json({ message: "Section not found" }, { status: 404 });
//     }

//     // Revalidate cache for the specific page and general sections
//     revalidateTag("sections");
//     const decodedPageSlug = decodeURIComponent(pageSlug);
//     revalidateTag(`${decodedPageSlug}-sections`);

//     return Response.json(section);
//   } catch (error) {
//     console.error("Section update error:", error);
//     return Response.json({ message: "Internal server error" }, { status: 500 });
//   }
// }

// // DELETE - Delete specific section (admin only)
// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: Promise<{ pageSlug: string; sectionSlug: string }> }
// ) {
//   try {
//     await connectDB();

//     // Verify admin authentication
//     const token = getTokenFromRequest(request);
//     if (!token || !verifyToken(token)) {
//       return Response.json({ message: "Unauthorized" }, { status: 401 });
//     }

//     const { pageSlug, sectionSlug } = await params;

//     const section = await Section.findOneAndDelete({
//       pageSlug: decodeURIComponent(pageSlug),
//       slug: decodeURIComponent(sectionSlug),
//     });

//     if (!section) {
//       return Response.json({ message: "Section not found" }, { status: 404 });
//     }

//     // Revalidate cache for the specific page and general sections
//     revalidateTag("sections");
//     const decodedPageSlug = decodeURIComponent(pageSlug);
//     revalidateTag(`${decodedPageSlug}-sections`);

//     return Response.json({ message: "Section deleted successfully" });
//   } catch (error) {
//     console.error("Section deletion error:", error);
//     return Response.json({ message: "Internal server error" }, { status: 500 });
//   }
// }

import { NextRequest } from "next/server";
import connectDB from "@/lib/mongodb";
import Section from "@/models/Section";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { revalidatePath, revalidateTag } from "next/cache";

// GET - Fetch specific section (admin only)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pageSlug: string; sectionSlug: string }> }
) {
  try {
    await connectDB();

    const { pageSlug, sectionSlug } = await params;

    const section = await Section.findOne({
      pageSlug: decodeURIComponent(pageSlug),
      slug: decodeURIComponent(sectionSlug),
    }).lean();

    if (!section) {
      return Response.json({ message: "Section not found" }, { status: 404 });
    }

    return Response.json(section);
  } catch (error) {
    console.error("Section fetch error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// PUT - Update specific section (admin only)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ pageSlug: string; sectionSlug: string }> }
) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageSlug, sectionSlug } = await params;
    const updateData = await request.json();

    const section = await Section.findOneAndUpdate(
      {
        pageSlug: decodeURIComponent(pageSlug),
        slug: decodeURIComponent(sectionSlug),
      },
      updateData,
      { new: true, runValidators: true }
    );

    if (!section) {
      return Response.json({ message: "Section not found" }, { status: 404 });
    }

    // Add a small delay to ensure DB write is complete
    await new Promise(resolve => setTimeout(resolve, 500));

    const decodedPageSlug = decodeURIComponent(pageSlug);
    
    // CRITICAL: Revalidate the actual page paths
    try {
      // Map pageSlug to actual route paths
      const pathsToRevalidate: string[] = [];
      
      if (decodedPageSlug === 'home') {
        pathsToRevalidate.push('/');
      } else if (decodedPageSlug === 'project') {
        pathsToRevalidate.push('/project');
      } else {
        pathsToRevalidate.push(`/${decodedPageSlug}`);
      }
      
      // Revalidate all affected paths
      for (const path of pathsToRevalidate) {
        await revalidatePath(path, 'page');
        console.log(`Revalidated path: ${path}`);
      }
      
      // Also revalidate tags for backward compatibility
      await revalidateTag("sections");
      await revalidateTag(`${decodedPageSlug}-sections`);
      
      console.log('Section update revalidation completed:', {
        section: sectionSlug,
        page: decodedPageSlug,
        paths: pathsToRevalidate,
        timestamp: new Date().toISOString()
      });
      
    } catch (revalidateError) {
      console.error('Revalidation error:', revalidateError);
      // Don't fail the request if revalidation fails
    }

    return Response.json({ 
      success: true,
      data: section,
      message: 'Section updated successfully. Changes will appear shortly.'
    });
    
  } catch (error) {
    console.error("Section update error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Delete specific section (admin only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ pageSlug: string; sectionSlug: string }> }
) {
  try {
    await connectDB();

    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { pageSlug, sectionSlug } = await params;

    const section = await Section.findOneAndDelete({
      pageSlug: decodeURIComponent(pageSlug),
      slug: decodeURIComponent(sectionSlug),
    });

    if (!section) {
      return Response.json({ message: "Section not found" }, { status: 404 });
    }

    // Add a small delay to ensure DB operation is complete
    await new Promise(resolve => setTimeout(resolve, 500));

    const decodedPageSlug = decodeURIComponent(pageSlug);
    
    // Revalidate the actual page paths
    try {
      if (decodedPageSlug === 'home') {
        await revalidatePath('/', 'page');
      } else if (decodedPageSlug === 'project') {
        await revalidatePath('/project', 'page');
      } else {
        await revalidatePath(`/${decodedPageSlug}`, 'page');
      }
      
      // Also revalidate tags
      await revalidateTag("sections");
      await revalidateTag(`${decodedPageSlug}-sections`);
      
    } catch (revalidateError) {
      console.error('Revalidation error:', revalidateError);
    }

    return Response.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Section deletion error:", error);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}