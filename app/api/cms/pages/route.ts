import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Page from '@/models/Page';
import Section from '@/models/Section';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { defaultAboutSections, defaultContactSections, defaultHomeSections } from '@/app/admin/layout';


// GET - Fetch all pages (admin only)
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const pages = await Page.find().sort({ createdAt: -1 });
    
    return Response.json(pages);
  } catch (error) {
    console.error('Pages fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST - Create a new page (admin only)
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const pageData = await request.json();
    
    // Create the page
    const page = await Page.create(pageData);
    
    // If it's a home page, create default sections
    if (page.slug === 'home') {
      const sections = defaultHomeSections.map(section => ({
        ...section,
        pageSlug: page.slug,
      }));
      
      await Section.insertMany(sections);
    }

    if(page.slug === 'about-us') {
      const sections = defaultAboutSections.map(section => ({
        ...section,
        pageSlug: page.slug,
      }));
      
      await Section.insertMany(sections);
    }

    if(page.slug === 'contact-us') {
      const sections = defaultContactSections.map(section => ({
        ...section,
        pageSlug: page.slug,
      }));
      
      await Section.insertMany(sections);
    }
    
    return Response.json(page, { status: 201 });
  } catch (error) {
    console.error('Page creation error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

