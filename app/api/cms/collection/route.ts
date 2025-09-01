import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import CuratedCollection from '@/models/CuratedCollection';

export async function GET() {
  try {
    await connectDB();
    const collection = await CuratedCollection.findOne({}) || await CuratedCollection.create({});
    return NextResponse.json({ success: true, data: collection });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch curated collection' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    await connectDB();
    const { title, description, isActive } = await request.json();
    
    const collection = await CuratedCollection.findOneAndUpdate(
      {},
      { title, description, isActive },
      { new: true, upsert: true }
    );
    
    return NextResponse.json({ success: true, data: collection });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update curated collection' }, { status: 500 });
  }
}
