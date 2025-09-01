import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }>  }) {
  try {
    await connectDB();
    const {id} = await params
    const { name, isActive, order } = await request.json();
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    
    const category = await Category.findByIdAndUpdate(
      id,
      { name, slug, isActive, order },
      { new: true }
    );
    
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }>  }) {
  try {
    await connectDB();
    const {id} = await params
    const category = await Category.findByIdAndDelete(id);
    
    if (!category) {
      return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete category' }, { status: 500 });
  }
}