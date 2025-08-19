// app/api/cms/properties/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Properties from '@/models/Properties';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET handler to fetch the Properties page content
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();

    // There should only be one 'Properties' document. We find it or create it.
    let propertiesContent = await Properties.findOne();
    if (!propertiesContent) {
      propertiesContent = await new Properties().save(); // Create a default document if none exists
    }

    return NextResponse.json({ success: true, data: propertiesContent });
  } catch (error) {
    console.error('Error fetching Properties content:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

// POST handler to update the Properties page content
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const body = await request.json();

    // Find the single document and update it, or create it if it doesn't exist (upsert)
    const updatedContent = await Properties.findOneAndUpdate({}, body, {
      new: true,
      upsert: true, // Creates a new doc if no document matches the filter
    });

    return NextResponse.json({ success: true, data: updatedContent });
  } catch (error) {
    console.error('Error updating Properties content:', error);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}