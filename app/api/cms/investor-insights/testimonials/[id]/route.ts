import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InvestorInsights from '@/models/InvestorInsights';
// Define an interface for the expected route parameters
interface RouteParams {
  id: string;
}
export async function PUT(
  request: NextRequest,
  context: { params: Promise<RouteParams> } 
) {
  try {
    await connectDB();
    const testimonialData = await request.json();
    const { id } = await context.params; // Destructure id from params

    const investorInsights = await InvestorInsights.findOne({ isActive: true });

    if (!investorInsights) {
      return NextResponse.json(
        { error: 'Investor insights not found' },
        { status: 404 }
      );
    }

    const testimonialIndex = investorInsights.testimonials.findIndex(
      (t: { _id: { toString: () => string } }) => t._id.toString() === id
    );

    if (testimonialIndex === -1) {
      return NextResponse.json(
        { error: 'Testimonial not found' },
        { status: 404 }
      );
    }

    // Update the testimonial by merging new data
    investorInsights.testimonials[testimonialIndex] = {
      ...investorInsights.testimonials[testimonialIndex].toObject(),
      ...testimonialData,
    };

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
  context: { params: Promise<RouteParams>  }
) {
  try {
    await connectDB();
    const { id } = await context.params;

    const investorInsights = await InvestorInsights.findOne({ isActive: true });

    if (!investorInsights) {
      return NextResponse.json(
        { error: 'Investor insights not found' },
        { status: 404 }
      );
    }

    const testimonialIndex = investorInsights.testimonials.findIndex(
      (t: { _id: { toString: () => string } }) => t._id.toString() === id
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

    return NextResponse.json({ success: true, message: "Testimonial deleted successfully." });
  } catch (error) {
    console.error('Error deleting testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to delete testimonial' },
      { status: 500 }
    );
  }
}
