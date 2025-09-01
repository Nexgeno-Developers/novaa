import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function GET() {
  try {
    await connectDB();
    const projects = await Project.find({}).populate('category').sort({ order: 1 });
    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, price, images, location, description, badge, category, categoryName, isActive, order } = await request.json();
    
    const project = await Project.create({
      name,
      price,
      images,
      location,
      description,
      badge,
      category,
      categoryName,
      isActive,
      order
    });
    
    const populatedProject = await Project.findById(project._id).populate('category');
    return NextResponse.json({ success: true, data: populatedProject });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}