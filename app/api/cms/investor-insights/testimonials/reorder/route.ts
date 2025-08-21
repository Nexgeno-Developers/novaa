// app/api/cms/investor-insights/testimonials/reorder/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InvestorInsights from '@/models/InvestorInsights';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { testimonials } = await request.json();

    if (!Array.isArray(testimonials)) {
      return NextResponse.json(
        { error: 'Testimonials must be an array' },
        { status: 400 }
      );
    }

    const investorInsights = await InvestorInsights.findOne({ isActive: true });

    if (!investorInsights) {
      return NextResponse.json(
        { error: 'Investor insights not found' },
        { status: 404 }
      );
    }

    // Update the order of testimonials
    const updatedTestimonials = testimonials.map((testimonial, index) => ({
      ...testimonial,
      order: index + 1
    }));

    investorInsights.testimonials = updatedTestimonials;
    await investorInsights.save();

    return NextResponse.json({
      success: true,
      testimonials: investorInsights.testimonials
    });
  } catch (error) {
    console.error('Error reordering testimonials:', error);
    return NextResponse.json(
      { error: 'Failed to reorder testimonials' },
      { status: 500 }
    );
  }
}