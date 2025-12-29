import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

// GET - Fetch all enquiries for export (no pagination)
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Get all enquiries without pagination
    const enquiries = await Enquiry.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      data: enquiries,
    });
  } catch (error) {
    console.error("Error fetching enquiries for export:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

