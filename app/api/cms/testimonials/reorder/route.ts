// app/api/cms/testimonials/reorder/route.js
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonials from '@/models/Testimonials';

export async function PUT(request : NextRequest) {
  try {
    await dbConnect();
    const { testimonials: reorderedTestimonials } = await request.json();
    
    if (!Array.isArray(reorderedTestimonials)) {
      return NextResponse.json(
        { success: false, error: 'Invalid testimonials data' },
        { status: 400 }
      );
    }

    const testimonials = await Testimonials.findOne({ sectionId: 'testimonials-section' });
    
    if (!testimonials) {
      return NextResponse.json(
        { success: false, error: 'Testimonials section not found' },
        { status: 404 }
      );
    }

    // Update the order of each testimonial
    const updatedTestimonials = reorderedTestimonials.map((testimonial, index) => ({
      ...testimonial,
      order: index
    }));

    testimonials.testimonials = updatedTestimonials;
    await testimonials.save();

    return NextResponse.json({
      success: true,
      testimonials: updatedTestimonials
    });
  } catch (error) {
    console.error('Error reordering testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to reorder testimonials' },
      { status: 500 }
    );
  }
}