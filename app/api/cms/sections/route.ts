import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET - Fetch sections for a page (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const { searchParams } = new URL(request.url);
    const pageSlug = searchParams.get('pageSlug');
    
    if (!pageSlug) {
      return Response.json({ message: 'Page slug is required' }, { status: 400 });
    }
    
    const sections = await Section.find({ pageSlug })
      .sort({ order: 1 })
      .lean();
    
    console.log(`Fetched ${sections.length} sections for page: ${pageSlug}`);
    return Response.json(sections);
  } catch (error) {
    console.error('Sections fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new section (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const sectionData = await request.json();
    
    // Check if section with same slug exists for this page
    const existingSection = await Section.findOne({
      pageSlug: sectionData.pageSlug,
      slug: sectionData.slug
    });
    
    if (existingSection) {
      return Response.json(
        { message: 'Section with this slug already exists for this page' },
        { status: 400 }
      );
    }

    const section = new Section(sectionData);
    await section.save();
    
    return Response.json(section, { status: 201 });
  } catch (error) {
    console.error('Section creation error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update sections order or bulk update (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { sections } = await request.json();
    
    if (!sections || !Array.isArray(sections)) {
      return Response.json({ message: 'Sections array is required' }, { status: 400 });
    }

    // Update order for each section
    const updatePromises = sections.map((section, index) =>
      Section.findByIdAndUpdate(
        section._id,
        { order: index + 1 },
        { new: true }
      )
    );

    const updatedSections = await Promise.all(updatePromises);
    
    return Response.json(updatedSections);
  } catch (error) {
    console.error('Sections order update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}