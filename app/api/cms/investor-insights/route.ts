// app/api/cms/investor-insights/route.ts
import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import InvestorInsights from '@/models/InvestorInsights';

export async function GET() {
  try {
    await connectDB();
    
    let investorInsights = await InvestorInsights.findOne({ isActive: true });
    
    // If no data exists, create default data
    if (!investorInsights) {
      const defaultData = {
        content: {
          mainTitle: "Insights for the",
          highlightedTitle: "Discerning Investor",
          description: "Stay informed with trending stories, industry updates, and thoughtful articles curated just for you."
        },
        testimonials: [
          {
            quote: "Luxury residential properties in 2024 with heavy property demand averaging 25% increase while rental yields in prime areas reached 7.8%, making it a new destination for HNIs.",
            content: "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors",
            designation: "2024 Market Analysis",
            src: "/images/invest-three.png",
            order: 1
          },
          {
            quote: "Commercial real estate opportunities showing 15% growth in Q3 2024, with office spaces in prime locations commanding premium rents.",
            content: "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors", 
            designation: "Q3 2024 Report",
            src: "/images/invest-four.png",
            order: 2
          },
          {
            quote: "Sustainable developments and green building initiatives are driving new investment patterns with 20% higher appreciation rates.",
            content: "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors",
            designation: "Green Investment Trends", 
            src: "/images/invest-three.png",
            order: 3
          },
          {
            quote: "Smart city developments and infrastructure projects are creating new opportunities for forward-thinking investors.",
            content: "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors",
            designation: "Future Development",
            src: "/images/invest-two.png",
            order: 4
          },
          {
            quote: "Residential townships with integrated amenities showing consistent 12% annual growth in tier-2 cities across India.",
            content: "Phuket Tourism Market Report 2024: Real Numbers for Savvy Investors", 
            designation: "Growth Markets",
            src: "/images/invest-one.png",
            order: 5
          }
        ],
        isActive: true
      };

      investorInsights = await InvestorInsights.create(defaultData);
    }

    return NextResponse.json(investorInsights);
  } catch (error: any) {
    console.error('Error fetching investor insights:', error);
    return NextResponse.json(
      { error: 'Failed to fetch investor insights' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const body = await request.json();

    const investorInsights = await InvestorInsights.create(body);
    return NextResponse.json(investorInsights);
  } catch (error: any) {
    console.error('Error creating investor insights:', error);
    return NextResponse.json(
      { error: 'Failed to create investor insights' },
      { status: 500 }
    );
  }
}