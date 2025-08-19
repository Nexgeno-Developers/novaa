// app/api/cms/testimonials/route.js
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonials from '@/models/Testimonials';

export async function GET() {
  try {
    await dbConnect();
    
    let testimonials = await Testimonials.findOne({ sectionId: 'testimonials-section' });
    console.log(testimonials)
    // If no testimonials section exists, create a default one
    if (!testimonials) {
      testimonials = new Testimonials({
        sectionId: 'testimonials-section',
        content: {
          title: 'What Our Elite Clients Say',
          description: 'Real stories from real people who trust us'
        },
      testimonials: []
      });
      await testimonials.save();
    }

    // Sort testimonials by order
    if (testimonials.testimonials) {
      testimonials.testimonials.sort((a, b) => a.order - b.order);
    }

    return NextResponse.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error fetching testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch testimonials' },
      { status: 500 }
    );
  }
}

export async function PUT(request : NextRequest) {
  try {
    await dbConnect();
    const updates = await request.json();
    
    const testimonials = await Testimonials.findOneAndUpdate(
      { sectionId: 'testimonials-section' },
      updates,
      { new: true, runValidators: true }
    );

    if (!testimonials) {
      return NextResponse.json(
        { success: false, error: 'Testimonials section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error updating testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonials' },
      { status: 500 }
    );
  }
}