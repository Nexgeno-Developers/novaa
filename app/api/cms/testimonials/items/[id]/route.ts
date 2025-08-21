// app/api/cms/testimonials/items/[id]/route.js
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonials from '@/models/Testimonials';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(request : NextRequest, { params } : RouteParams) {
  try {
    await dbConnect();
    const testimonialData = await request.json();
    const { id } = params;
    
    const { name, role, rating, quote, avatar } = testimonialData;
    
    if (!name || !role || !quote || !avatar) {
      return NextResponse.json(
        { success: false, error: 'Name, role, quote, and avatar are required' },
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

    const testimonialIndex = testimonials.testimonials.findIndex((t: { id: string; }) => t.id === id);
    
    if (testimonialIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Update the testimonial
    testimonials.testimonials[testimonialIndex] = {
      ...testimonials.testimonials[testimonialIndex].toObject(),
      name,
      role,
      rating: rating || 5,
      quote,
      avatar
    };

    await testimonials.save();

    return NextResponse.json({
      success: true,
      testimonial: testimonials.testimonials[testimonialIndex]
    });
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(request : NextRequest, { params } : RouteParams) {
  try {
    await dbConnect();
    const { id } = params;

    const testimonials = await Testimonials.findOne({ sectionId: 'testimonials-section' });
    
    if (!testimonials) {
      return NextResponse.json(
        { success: false, error: 'Testimonials section not found' },
        { status: 404 }
      );
    }

    const testimonialIndex = testimonials.testimonials.findIndex((t: { id: string; }) => t.id === id);
    
    if (testimonialIndex === -1) {
      return NextResponse.json(
        { success: false, error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    testimonials.testimonials.splice(testimonialIndex, 1);
    await testimonials.save();

    return NextResponse.json({
      success: true,
      message: 'Testimonial deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}