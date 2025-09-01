import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Page from '@/models/Page';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET - Fetch all pages (admin only)
export async function GET() {
  try {
    await connectDB();
    
    const pages = await Page.find({})
      .sort({ order: 1, createdAt: -1 })
      .lean();
    
    console.log('Fetched pages:', pages.length);
    return Response.json(pages);
  } catch (error) {
    console.error('Pages fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create new page (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const pageData = await request.json();
    
    // Check if slug already exists
    const existingPage = await Page.findOne({ slug: pageData.slug });
    if (existingPage) {
      return Response.json({ message: 'Page with this slug already exists' }, { status: 400 });
    }

    const page = new Page(pageData);
    await page.save();
    
    return Response.json(page, { status: 201 });
  } catch (error) {
    console.error('Page creation error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update page (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { _id, ...updateData } = await request.json();
    
    const page = await Page.findByIdAndUpdate(_id, updateData, { new: true });
    if (!page) {
      return Response.json({ message: 'Page not found' }, { status: 404 });
    }
    
    return Response.json(page);
  } catch (error) {
    console.error('Page update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// DELETE - Delete page (admin only)
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const pageId = searchParams.get('id');
    
    if (!pageId) {
      return Response.json({ message: 'Page ID is required' }, { status: 400 });
    }

    const page = await Page.findByIdAndDelete(pageId);
    if (!page) {
      return Response.json({ message: 'Page not found' }, { status: 404 });
    }
    
    return Response.json({ message: 'Page deleted successfully' });
  } catch (error) {
    console.error('Page deletion error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}