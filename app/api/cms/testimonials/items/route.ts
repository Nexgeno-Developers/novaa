// app/api/cms/testimonials/items/route.js
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Testimonials from '@/models/Testimonials';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request : NextRequest) {
  try {
    await dbConnect();
    const testimonialData = await request.json();
    
    const { name, role, rating, quote, avatar } = testimonialData;
    
    if (!name || !role || !quote || !avatar) {
      return NextResponse.json(
        { success: false, error: 'Name, role, quote, and avatar are required' },
        { status: 400 }
      );
    }

    let testimonials = await Testimonials.findOne({ sectionId: 'testimonials-section' });
    
    if (!testimonials) {
      testimonials = new Testimonials({
        sectionId: 'testimonials-section',
        content: {
          title: 'What Our Elite Clients Say',
          description: 'Real stories from real people who trust us'
        },
        testimonials: []
      });
    }

    // Get next order number
    const maxOrder = testimonials.testimonials.length > 0 
      ? Math.max(...testimonials.testimonials.map(t => t.order))
      : -1;

    const newTestimonial = {
      id: uuidv4(),
      name,
      role,
      rating: rating || 5,
      quote,
      avatar,
      order: maxOrder + 1,
      isActive: true
    };

    testimonials.testimonials.push(newTestimonial);
    await testimonials.save();

    return NextResponse.json({
      success: true,
      testimonial: newTestimonial
    });
  } catch (error) {
    console.error('Error creating testimonial:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create testimonial' },
      { status: 500 }
    );
  }
}