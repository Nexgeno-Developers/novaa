import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/mongodb";
import Enquiry from "@/models/Enquiry";

// GET - Fetch all enquiries
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const search = searchParams.get("search");

    // Build query filter
    const filter: any = {};
    if (status && status !== "all") filter.status = status;
    if (priority && priority !== "all") filter.priority = priority;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { emailAddress: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } },
        { phoneNo: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;

    // Get enquiries with pagination
    const enquiries = await Enquiry.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    // Get total count for pagination
    const totalEnquiries = await Enquiry.countDocuments(filter);
    const totalPages = Math.ceil(totalEnquiries / limit);

    // Get status counts
    const statusCounts = await Enquiry.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const statusSummary = {
      total: totalEnquiries,
      new: statusCounts.find((s) => s._id === "new")?.count || 0,
      contacted: statusCounts.find((s) => s._id === "contacted")?.count || 0,
      interested: statusCounts.find((s) => s._id === "interested")?.count || 0,
      closed: statusCounts.find((s) => s._id === "closed")?.count || 0,
    };

    return NextResponse.json({
      success: true,
      data: {
        enquiries,
        pagination: {
          currentPage: page,
          totalPages,
          totalEnquiries,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        statusSummary,
      },
    });
  } catch (error) {
    console.error("Error fetching enquiries:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch enquiries" },
      { status: 500 }
    );
  }
}

// POST - Create new enquiry
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fullName, emailAddress, phoneNo, location, message, pageUrl } =
      body;

    // Validation - phoneNo and location are mandatory
    if (!fullName || !phoneNo || !location) {
      return NextResponse.json(
        {
          success: false,
          message: "Full name, phone number, and location are required",
        },
        { status: 400 }
      );
    }

    // Validate phone number format
    const phoneRegex = /^[+]?[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phoneNo)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid phone number format",
        },
        { status: 400 }
      );
    }

    // Validate email if provided
    if (emailAddress && emailAddress.trim() !== "") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailAddress)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid email address format",
          },
          { status: 400 }
        );
      }
    }

    // Check if phone number already exists
    const existingEnquiry = await Enquiry.findOne({ phoneNo });
    if (existingEnquiry) {
      return NextResponse.json(
        {
          success: false,
          message: "An enquiry with this phone number already exists",
        },
        { status: 409 }
      );
    }

    // Create new enquiry
    const enquiryData: any = {
      fullName,
      phoneNo,
      location,
      status: "new",
      priority: "medium",
    };

    // Only add email if provided
    if (emailAddress && emailAddress.trim() !== "") {
      enquiryData.emailAddress = emailAddress;
    }

    // Only add message if provided
    if (message && message.trim() !== "") {
      enquiryData.message = message;
    }

    // Only add pageUrl if provided
    if (pageUrl && pageUrl.trim() !== "") {
      enquiryData.pageUrl = pageUrl;
    }

    const enquiry = await Enquiry.create(enquiryData);

    return NextResponse.json(
      {
        success: true,
        message: "Enquiry submitted successfully",
        data: enquiry,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating enquiry:", error);
    console.error("Error name:", error.name);
    console.error("Error message:", error.message);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to submit enquiry",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
