import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Breadcrumb from '@/models/Breadcrumb';

// GET: Fetch the current breadcrumb settings
export async function GET() {
  await connectDB();
  try {
    let breadcrumb = await Breadcrumb.findOne({});
    // If no settings exist, create a default one
    if (!breadcrumb) {
      breadcrumb = await new Breadcrumb().save();
    }
    return NextResponse.json(breadcrumb, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch breadcrumb data', details: errorMessage }, { status: 500 });
  }
}

// PUT: Update the breadcrumb settings
export async function PUT(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    const { title, description, backgroundImageUrl } = body;

    // Use findOneAndUpdate with upsert:true to create if it doesn't exist
    const updatedBreadcrumb = await Breadcrumb.findOneAndUpdate(
      {}, // an empty filter will match the first document
      { title, description, backgroundImageUrl },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updatedBreadcrumb, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to update breadcrumb data', details: errorMessage }, { status: 500 });
  }
}