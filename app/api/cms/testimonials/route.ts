import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Testimonials from "@/models/Testimonials";

// Default testimonials data
const defaultTestimonials = [
  {
    name: "Mr. David Chen",
    role: "Business Magnate, Singapore",
    rating: 5,
    quote:
      "From visa assistance to legal paperwork, Novaa handled everything flawlessly. A truly luxurious experience. — Mr. David Chen, Business Magnate, Singapore",
    avatar: "/testimonials/image-one.png",
    demo: "Demo",
    order: 1,
  },
  {
    name: "Mr. Arjun Mehta",
    role: "Entrepreneur, Mumbai",
    rating: 5,
    quote:
      "Novaa transformed my investment journey. Their transparency and end-to-end support made owning a luxury property in Phuket effortless. — Mr. Arjun Mehra, Entrepreneur, Mumbai",
    avatar: "/testimonials/image-two.png",
    demo: "Demo",
    order: 2,
  },
  {
    name: "Ms. Elena Volkov",
    role: "Investor, London",
    rating: 5,
    quote:
      "The rental income from my Layan Verde property exceeded my expectations. Novaa management is impeccable. — Ms. Elena Volkov, Investor, London",
    avatar: "/testimonials/image-three.png",
    demo: "Demo",
    order: 3,
  },
  {
    name: "Ms. Olivia Martinez",
    role: "Investor, Spain",
    rating: 5,
    quote:
      "Novaa’s expertise gave me full confidence. Seamless process from start to finish. — Ms. Olivia Martinez, Investor, Spain",
    avatar: "/testimonials/image-one.png",
    demo: "Demo",
    order: 4,
  },
  {
    name: "Mr. Alexander Ivanov",
    role: "Entrepreneur, Russia",
    rating: 5,
    quote:
      "Owning property in Phuket was my dream. Novaa made it reality with zero hassle. — Mr. Alexander Ivanov, Entrepreneur, Russia",
    avatar: "/testimonials/image-three.png",
    demo: "Demo",
    order: 5,
  },
  {
    name: "Ms. Sarah Lee",
    role: "Investor, Hong Kong",
    rating: 5,
    quote:
      "Fantastic rental returns, outstanding service. Novaa is unmatched in property investment. — Ms. Sarah Lee, Investor, Hong Kong",
    avatar: "/testimonials/image-two.png",
    demo: "Demo",
    order: 6,
  },
];

export async function GET() {
  try {
    await connectDB();

    let testimonials = await Testimonials.findOne({
      sectionId: "testimonials-section",
    });

    // If no section exists, create default one
    if (!testimonials) {
      testimonials = new Testimonials({
        sectionId: "testimonials-section",
        content: {
          title: "What Our Elite Clients Say",
          description: "Real stories from real people who trust us",
        },
        testimonials: defaultTestimonials,
      });
      await testimonials.save();
    }

    // Sort testimonials by order
    if (testimonials.testimonials) {
      testimonials.testimonials.sort((a: { order: number; }, b: { order: number; }) => a.order - b.order);
    }

    return NextResponse.json({
      success: true,
      data: testimonials,
    });
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch testimonials" },
      { status: 500 }
    );
  }
}

export async function PUT(request : NextRequest) {
  try {
    await connectDB();
    const updates = await request.json();
    
    const testimonials = await Testimonials.findOneAndUpdate(
      { sectionId: 'testimonials-section' },
      updates,
      { new: true, runValidators: true }
    );

    if (!testimonials) {
      return NextResponse.json(
        { success: false, error: 'Testimonials section not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: testimonials
    });
  } catch (error) {
    console.error('Error updating testimonials:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update testimonials' },
      { status: 500 }
    );
  }
}