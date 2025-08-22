// app/api/cms/breadcrumb/[slug]/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Breadcrumb from '@/models/Breadcrumb';

interface RouteParams {
  slug : string;
}

// GET: Fetch breadcrumb settings for a SPECIFIC slug
export async function GET(request: Request, context: { params: Promise<RouteParams> } ){
  const {slug} = await context.params;
  await dbConnect();
  try {
    let breadcrumb = await Breadcrumb.findOne({ pageSlug: slug });
    // If no settings exist for this slug, return a default structure
    if (!breadcrumb) {
      return NextResponse.json({
        pageSlug: slug,
        title: `${slug.replace('-', ' ')} Title`, // e.g., "contact us Title"
        description: '<p>Please fill out this content.</p>',
        backgroundImageUrl: '/images/bg1.webp',
      }, { status: 200 });
    }
    return NextResponse.json(breadcrumb, { status: 200 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to fetch breadcrumb data', details: errorMessage }, { status: 500 });  }
}

// PUT: Update breadcrumb settings for a SPECIFIC slug
export async function PUT(request: Request,  context: { params: Promise<RouteParams> }) {
  const { slug } = await context.params;
  console.log("Slug" , slug);
  await dbConnect();
  try {
    const body = await request.json();
    const { title, description, backgroundImageUrl } = body;

    const updatedBreadcrumb = await Breadcrumb.findOneAndUpdate(
      { pageSlug: slug },
      { title, description, backgroundImageUrl, pageSlug: slug }, // Ensure slug is set
      { new: true, upsert: true, runValidators: true } // upsert is key here!
    );

    return NextResponse.json(updatedBreadcrumb, { status: 200 });
  } catch (error) {
const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ error: 'Failed to update breadcrumb data', details: errorMessage }, { status: 500 });  }
}