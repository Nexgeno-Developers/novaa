import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Category from '@/models/Category';
import { revalidateTag } from 'next/cache';

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find({}).sort({ order: 1 , name : 1});
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, isActive, order } = await request.json();
    
    const slug = name.toLowerCase().replace(/\s+/g, '-');
    const category = await Category.create({
      name,
      slug,
      isActive,
      order
    });

    // Revalidate caches that depend on categories
    revalidateTag('categories');
    revalidateTag('project-sections');
    revalidateTag('sections');
    
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create category' }, { status: 500 });
  }
}