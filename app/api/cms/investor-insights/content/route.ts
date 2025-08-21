// app/api/cms/investor-insights/content/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InvestorInsights from '@/models/InvestorInsights';

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Content is required' },
        { status: 400 }
      );
    }

    let investorInsights = await InvestorInsights.findOne({ isActive: true });

    if (!investorInsights) {
      // Create new document if doesn't exist
      investorInsights = await InvestorInsights.create({
        content,
        testimonials: [],
        isActive: true
      });
    } else {
      // Update existing document
      investorInsights.content = content;
      await investorInsights.save();
    }

    return NextResponse.json({
      success: true,
      content: investorInsights.content
    });
  } catch (error) {
    console.error('Error updating investor insights content:', error);
    return NextResponse.json(
      { error: 'Failed to update content' },
      { status: 500 }
    );
  }
}