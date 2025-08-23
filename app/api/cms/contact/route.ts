import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Contact from '@/models/Contact';

// GET handler to fetch contact data
export async function GET() {
  try {
    await dbConnect();
    let contactData = await Contact.findOne({ sectionId: 'contact-section' });

    if (!contactData) {
      // If no data exists, create it with default values
      contactData = new Contact({
        sectionId: 'contact-section',
      });
      await contactData.save();
    }

    return NextResponse.json({ success: true, data: contactData }, { status: 200 });
  } catch (error) {
    console.error('Error fetching contact data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: 'Server Error', details: errorMessage }, { status: 500 });
  }
}

// POST handler to update contact data
export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const body = await req.json();

    const updatedContactData = await Contact.findOneAndUpdate(
      { sectionId: 'contact-section' },
      body,
      { new: true, upsert: true, runValidators: true }
    );

    return NextResponse.json({ success: true, data: updatedContactData }, { status: 200 });
  } catch (error) {
    console.error('Error updating contact data:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ success: false, error: 'Server Error', details: errorMessage }, { status: 500 });
  }
}
