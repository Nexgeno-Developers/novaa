import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Page from '@/models/Page';
import Section from '@/models/Section';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { defaultAboutSections, defaultContactSections, defaultHomeSections } from '@/lib/defaultPages';
import { initializeDefaultPages } from '@/lib/defaultPages';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }

    let pages = await Page.find().sort({ createdAt: -1 });

    // console.log("Pages" , pages) 

    // If no pages exist, initialize them here
    if (pages.length === 0) {
      console.log("No pages found, initializing defaults...");
      await initializeDefaultPages();
      pages = await Page.find().sort({ createdAt: -1 });
    }

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
      
      const inserted = await Section.insertMany(sections);
      console.log("Inserted home section " , inserted.length)
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

