// app/api/cms/faq/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // Assuming you have a dbConnect utility
import Faq from '@/models/Faq';

// GET handler to fetch the FAQ section data
export async function GET() {
  await connectDB();
  try {
    // There should only be one document for this section.
    let faqData = await Faq.findOne({});
    
    // If no data exists, create a default one to avoid errors on the frontend
    if (!faqData) {
      faqData = await new Faq({
        title: "faq",
        description: "Here are some frequently asked questions.",
        backgroundImage: "/clients/bg.png",
        faqs: [
          { question: "What is the first question?", answer: "<p>This is the answer to the first question.</p>", order: 0 },
          { question: "What is the second question?", answer: "<p>This is the answer to the second question.</p>", order: 1 },
        ],
      }).save();
    }
    
    return NextResponse.json(faqData);
  } catch (error) {
    console.error('Failed to fetch FAQ data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT handler to update the FAQ section data
export async function PUT(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    
    // Use findOneAndUpdate with upsert:true to create or update the single document
    const updatedData = await Faq.findOneAndUpdate(
      {}, // An empty filter will match the first document
      body, 
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to update FAQ data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}