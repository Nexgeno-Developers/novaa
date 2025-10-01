import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function PATCH(request: NextRequest) {
  try {
    await connectDB();
    
    const { categories } = await request.json();
    
    if (!Array.isArray(categories)) {
      return NextResponse.json(
        { success: false, message: 'Invalid categories data' },
        { status: 400 }
      );
    }

    // Batch update using bulkWrite for better performance
    const bulkOps = categories.map((cat: any, index: number) => ({
      updateOne: {
        filter: { _id: cat._id },
        update: { $set: { order: index } },
      },
    }));
    
    await Category.bulkWrite(bulkOps);
    
    return NextResponse.json({
      success: true,
      message: 'Categories reordered successfully',
    });
  } catch (error) {
    console.error('Error reordering categories:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to reorder categories' },
      { status: 500 }
    );
  }
}