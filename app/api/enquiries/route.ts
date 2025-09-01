import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Enquiry from '@/models/Enquiry';
import { email } from 'zod';

// GET - Fetch all enquiries
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const search = searchParams.get('search');

    // Build query filter
    const filter: any = {};
    if (status && status !== 'all') filter.status = status;
    if (priority && priority !== 'all') filter.priority = priority;
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { emailAddress: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { investmentLocation: { $regex: search, $options: 'i' } },
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
          _id: '$status',
          count: { $sum: 1 },
        },
      },
    ]);

    const statusSummary = {
      total: totalEnquiries,
      new: statusCounts.find(s => s._id === 'new')?.count || 0,
      contacted: statusCounts.find(s => s._id === 'contacted')?.count || 0,
      interested: statusCounts.find(s => s._id === 'interested')?.count || 0,
      closed: statusCounts.find(s => s._id === 'closed')?.count || 0,
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
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

// POST - Create new enquiry
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const {
      fullName,
      emailAddress,
      phoneNo,
      country,
      investmentLocation,
      message,
    } = body;

    // Validation
    if (!fullName || !emailAddress || !country || !investmentLocation) {
      return NextResponse.json(
        { success: false, message: 'Required fields are missing' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEnquiry = await Enquiry.findOne({ emailAddress });
    if (existingEnquiry) {
      return NextResponse.json(
        { success: false, message: 'An enquiry with this phone number already exists' },
        { status: 409 }
      );
    }

    // Create new enquiry
    const enquiry = await Enquiry.create({
      fullName,
      emailAddress,
      phoneNo,
      country,
      investmentLocation,
      message,
      status: 'new',
      priority: 'medium',
    });

    return NextResponse.json({
      success: true,
      message: 'Enquiry submitted successfully',
      data: enquiry,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to submit enquiry' },
      { status: 500 }
    );
  }
}