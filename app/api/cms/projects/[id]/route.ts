import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Project from '@/models/Project';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }>  }) {
  try {
    await connectDB();
    const {id} = await params;
    const { name, price, images, location, description, badge, category, categoryName, isActive, order } = await request.json();
    
    const project = await Project.findByIdAndUpdate(
      id,
      { name, price, images, location, description, badge, category, categoryName, isActive, order },
      { new: true }
    ).populate('category');
    
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: project });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }>  }) {
  try {
    await connectDB();
    const {id} = await params
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}