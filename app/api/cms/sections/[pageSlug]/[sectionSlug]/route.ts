import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET - Fetch a specific section
export async function GET(request: NextRequest, { params }: { params: { pageSlug: string; sectionSlug: string } }) {
  try {
    await connectDB();
    
    const { pageSlug, sectionSlug } = await params;
    
    const section = await Section.findOne({ pageSlug, slug: sectionSlug });
    
    if (!section) {
      return Response.json({ message: 'Section not found' }, { status: 404 });
    }
    
    return Response.json(section);
  } catch (error) {
    console.error('Section fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update a specific section (admin only)
export async function PUT(request: NextRequest, { params }: { params: { pageSlug: string; sectionSlug: string } }) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { pageSlug, sectionSlug } = params;
    const updateData = await request.json();
    
    const section = await Section.findOneAndUpdate(
      { pageSlug, slug: sectionSlug },
      { 
        ...updateData,
        updatedAt: new Date(),
      },
      { new: true }
    );
    
    if (!section) {
      return Response.json({ message: 'Section not found' }, { status: 404 });
    }
    
    return Response.json(section);
  } catch (error) {
    console.error('Section update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete a specific section (admin only)
export async function DELETE(request: NextRequest, { params }: { params: { pageSlug: string; sectionSlug: string } }) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const { pageSlug, sectionSlug } = params;
    
    const section = await Section.findOneAndDelete({ pageSlug, slug: sectionSlug });
    
    if (!section) {
      return Response.json({ message: 'Section not found' }, { status: 404 });
    }
    
    return Response.json({ message: 'Section deleted successfully' });
  } catch (error) {
    console.error('Section deletion error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}