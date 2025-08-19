// app/api/cms/about/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import About from '@/models/About';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET handler to fetch the About Us page content
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // There should only be one 'About' document. We find it or create it.
    let aboutContent = await About.findOne();
    if (!aboutContent) {
      aboutContent = await new About().save(); // Create a default document if none exists
    }

    return NextResponse.json({ success: true, data: aboutContent });
  } catch (error) {
    console.error('Error fetching About content:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST handler to update the About Us page content
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    // Find the single document and update it, or create it if it doesn't exist (upsert)
    const updatedContent = await About.findOneAndUpdate({}, body, {
      new: true,
      upsert: true, // Creates a new doc if no document matches the filter
    });

    return NextResponse.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error('Error updating About content:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}