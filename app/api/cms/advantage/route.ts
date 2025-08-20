// app/api/cms/novaa-advantage/route.ts
import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb'; // Assuming you have a dbConnect utility
import NovaaAdvantage from '@/models/NovaaAdvantage';

// GET handler to fetch the advantage section data
export async function GET() {
  await connectDB();
  try {
    let advantageData = await NovaaAdvantage.findOne({});
    // If no data exists, created a default one to avoid errors on the frontend
    if (!advantageData) {
      advantageData = await new NovaaAdvantage({
        title: "THE NOVAA",
        highlightedTitle: "ADVANTAGE",
        description: "At Novaa, we redefine the investment experience by offering end-to-end solutions tailored for HNIs",
        backgroundImage: "/advantage-section-images/background.png",
        logoImage: "/advantage-section-images/logo.png",
        advantages: [
          { title: "Scouting Excellence", description: "<p>We identify prime properties in high-growth areas, ensuring maximum returns and flexibility.</p>", icon: "/advantage-section-images/icon-one.png", order: 0 },
          { title: "Freehold & Rental Income Support", description: "<p>Secure freehold ownership and set up rentals or your rental income with guaranteed returns.</p>", icon: "/advantage-section-images/icon-two.png", order: 1 },
          { title: "Unmatched Transparency", description: "<p>Every transaction is clear and documented, ensuring you gain the complete peace of mind.</p>", icon: "/advantage-section-images/icon-three.png", order: 2 },
          { title: "Bureaucratic Ease", description: "<p>We manage all regulatory processes, so you can focus on enjoying your investment.</p>", icon: "/advantage-section-images/icon-four.png", order: 3 },
          { title: "Visa & Legal Assistance", description: "<p>From residency programs to legal consultations, we provide comprehensive support.</p>", icon: "/advantage-section-images/icon-five.png", order: 4 },
          { title: "Expert Curation", description: "<p>Early property selection and exclusive access to the best developments of the global elite.</p>", icon: "/advantage-section-images/icon-six.png", order: 5 },
        ],
      }).save();
    }
    
    return NextResponse.json(advantageData);
  } catch (error) {
    console.error('Failed to fetch Novaa Advantage data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT handler to update the advantage section data
export async function PUT(request: Request) {
  await connectDB();
  try {
    const body = await request.json();
    
    // Use findOneAndUpdate with upsert:true to create the document if it doesn't exist,
    // or update it if it does.
    const updatedData = await NovaaAdvantage.findOneAndUpdate(
      {}, // An empty filter will match the first document
      body, 
      { new: true, upsert: true, runValidators: true }
    );
    
    return NextResponse.json(updatedData);
  } catch (error) {
    console.error('Failed to update Novaa Advantage data:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}