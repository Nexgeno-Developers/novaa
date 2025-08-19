import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import WhyInvest from '@/models/WhyInvest';
import { verifyToken, getTokenFromRequest } from '@/lib/auth';

// GET: Fetch the Why Invest Us content
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    
    // Find one document. We create a default if it doesn't exist.
    let whyInvestData = await WhyInvest.findOne();

    if (!whyInvestData) {
      whyInvestData = await new WhyInvest().save();
    }

    return NextResponse.json({ success: true, data: whyInvestData });
  } catch (error) {
    console.error("GET WhyInvest Error:", error);
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// POST: Update the Why Invest Us content (Upsert logic)
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    const body = await request.json();

    // Using findOneAndUpdate with upsert:true creates the document if it doesn't exist.
    const updatedData = await WhyInvest.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    return NextResponse.json({ success: true, data: updatedData });
  } catch (error: any) {
    console.error("POST WhyInvest Error:", error);
    return NextResponse.json({ success: false, message: error.message || 'Server error' }, { status: 500 });
  }
}