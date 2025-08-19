// app/api/cms/testimonials/content/route.js
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonials from '@/models/Testimonials';

export async function PUT(request  : NextRequest) {
  try {
    await dbConnect();
    const { title, description } = await request.json();

    if (!title || !description) {
      return NextResponse.json(
        { success: false, error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const testimonials = await Testimonials.findOneAndUpdate(
      { sectionId: 'testimonials-section' },
      {
        $set: {
          'content.title': title,
          'content.description': description
        }
      },
      { new: true, runValidators: true }
    );

    if (!testimonials) {
      // Create new if doesn't exist
      const newTestimonials = new Testimonials({
        sectionId: 'testimonials-section',
        content: { title, description },
        testimonials: []
      });
      await newTestimonials.save();
      
      return NextResponse.json({
        success: true,
        content: { title, description }
      });
    }

    return NextResponse.json({
      success: true,
      content: testimonials.content
    });
  } catch (error) {
    console.error('Error updating testimonials content:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update content' },
      { status: 500 }
    );
  }
}