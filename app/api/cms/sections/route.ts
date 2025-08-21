import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET - Fetch sections for a specific page
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const url = new URL(request.url);
    const pageSlug = url.searchParams.get('pageSlug');
    
    if (!pageSlug) {
      return Response.json({ message: 'Page slug is required' }, { status: 400 });
    }
    
    // Always sort by order when fetching
    const sections = await Section.find({ pageSlug }).sort({ order: 1 });
    
    return Response.json(sections);
  } catch (error) {
    console.error('Sections fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update section order (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { sections } = await request.json();

    if (!Array.isArray(sections) || sections.length === 0) {
      return Response.json({ message: 'Sections array is required.' }, { status: 400 });
    }
    
    // Update each section's order
    const updatePromises = sections.map((section) =>
      Section.findByIdAndUpdate(section._id, { order: section.order })
    );
    
    await Promise.all(updatePromises);

    // After all updates are done, re-fetch the sections in the correct order
    // to ensure the response to the client is correctly sorted.
    const pageSlug = sections[0].pageSlug;
    const sortedSections = await Section.find({ pageSlug }).sort({ order: 1 });
    
    return Response.json(sortedSections); // Return the newly sorted list

  } catch (error) {
    console.error('Sections update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new section (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const sectionData = await request.json();
    
    // Get the next order number for this page
    const lastSection = await Section.findOne({ pageSlug: sectionData.pageSlug }).sort({ order: -1 });
    const nextOrder = lastSection ? lastSection.order + 1 : 1;
    
    const section = await Section.create({
      ...sectionData,
      order: nextOrder,
    });
    
    return Response.json(section, { status: 201 });
  } catch (error) {
    console.error('Section creation error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
