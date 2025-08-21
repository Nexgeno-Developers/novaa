// app/api/cms/investor-insights/testimonials/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InvestorInsights from '@/models/InvestorInsights';
import { Types } from 'mongoose';

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const testimonialData = await request.json();

    if (!testimonialData.quote || !testimonialData.content || !testimonialData.designation || !testimonialData.src) {
      return NextResponse.json(
        { error: 'All testimonial fields are required' },
        { status: 400 }
      );
    }

    let investorInsights = await InvestorInsights.findOne({ isActive: true });

    if (!investorInsights) {
      // Create new document if doesn't exist
      investorInsights = await InvestorInsights.create({
        content: {
          mainTitle: "Insights for the",
          highlightedTitle: "Discerning Investor",
          description: "Stay informed with trending stories, industry updates, and thoughtful articles curated just for you."
        },
        testimonials: [],
        isActive: true
      });
    }

    // Set order to be the next number
    const nextOrder = investorInsights.testimonials.length > 0 
      ? Math.max(...investorInsights.testimonials.map((t: { order: number; }) => t.order)) + 1 
      : 1;

    const newTestimonial = {
      _id: new Types.ObjectId(),
      ...testimonialData,
      order: testimonialData.order ?? nextOrder
    };

    investorInsights.testimonials.push(newTestimonial);
    await investorInsights.save();

    return NextResponse.json(newTestimonial);
  } catch (error) {
    console.error('Error adding testimonial:', error);
    return NextResponse.json(
      { error: 'Failed to add testimonial' },
      { status: 500 }
    );
  }
}