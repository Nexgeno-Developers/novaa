import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InvestorInsights from '@/models/InvestorInsights';

// Define type for params
interface RouteParams {
  params: {
    id: string;
  };
}

export async function PUT(  request: NextRequest, { params }: RouteParams) {
  try {
    await connectDB();
    const testimonialData = await request.json();
    const { id } = params;

    const investorInsights = await InvestorInsights.findOne({ isActive: true });

    if (!investorInsights) {
      return NextResponse.json(
        { error: 'Investor insights not found' },
        { status: 404 }
      );
    }

    const testimonialIndex = investorInsights.testimonials.findIndex(
      (t: { _id: { toString: () => string; }; }) => t._id.toString() === id
    );

    if (testimonialIndex === -1) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Update the testimonial
    Object.assign(investorInsights.testimonials[testimonialIndex], testimonialData);
    await investorInsights.save();

    return NextResponse.json(investorInsights.testimonials[testimonialIndex]);
  } catch (error) {
    console.error('Error updating testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to update testimonial' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await connectDB();
    const { id } = params;

    const investorInsights = await InvestorInsights.findOne({ isActive: true });

    if (!investorInsights) {
      return NextResponse.json(
        { error: 'Investor insights not found' },
        { status: 404 }
      );
    }

    const testimonialIndex = investorInsights.testimonials.findIndex(
      (t: { _id: { toString: () => string; }; }) => t._id.toString() === id
    );

    if (testimonialIndex === -1) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Remove the testimonial
    investorInsights.testimonials.splice(testimonialIndex, 1);
    await investorInsights.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}