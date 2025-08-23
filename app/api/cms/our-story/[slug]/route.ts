import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import OurStory from '@/models/OurStory';

interface RouteParams {
  slug: string;
}

// GET: Fetch our story for a specific slug
export async function GET(request: Request, context: { params: Promise<RouteParams> }) {
  const { slug } = await context.params;
  await dbConnect();
  try {
    let ourStory = await OurStory.findOne({ pageSlug: slug });

    if (!ourStory) {
      // Return a default structure if none exists
      return NextResponse.json({
        pageSlug: slug,
        title: 'OUR STORY',
        description: '<p>Please fill out this content.</p>',
        mediaType: 'video',
        mediaUrl: ''
      }, { status: 200 });
    }
    return NextResponse.json(ourStory, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch our story section data', details: errorMessage }, { status: 500 });
  }
}

// PUT: Update our story section for a specific slug
export async function PUT(request: Request,  context: { params: Promise<RouteParams> }) {
  const { slug } = await context.params;
  await dbConnect();
  try {
    const body = await request.json();
    
    const updatedOurStorySection = await OurStory.findOneAndUpdate(
      { pageSlug: slug },
      { ...body, pageSlug: slug },
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json(updatedOurStorySection, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to update our story section data', details: errorMessage }, { status: 500 });
  }
}