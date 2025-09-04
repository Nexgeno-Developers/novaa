// api/cms/projects/route.ts
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
    const data = await request.json();
    
    // Extract basic fields and projectDetail
    const {
      name,
      price,
      images,
      location,
      description,
      badge,
      category,
      categoryName,
      isActive,
      order,
      projectDetail
    } = data;
    
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
      order,
      projectDetail: projectDetail || {
        hero: {
          backgroundImage: "",
          title: name,
          subtitle: "",
          scheduleMeetingButton: "Schedule a meeting",
          getBrochureButton: "Get Brochure",
          brochurePdf: ""
        },
        projectHighlights: {
          backgroundImage: "",
          description: "",
          highlights: []
        },
        keyHighlights: {
          backgroundImage: "",
          description: "",
          highlights: []
        },
        modernAmenities: {
          title: "MODERN AMENITIES FOR A BALANCED LIFESTYLE",
          description: "",
          amenities: []
        },
        masterPlan: {
          title: "",
          subtitle: "",
          description: "",
          backgroundImage: "",
          tabs: []
        },
        investmentPlans: {
          title: "LIMITED-TIME INVESTMENT PLANS",
          description: "Secure high returns with exclusive, time-sensitive opportunities.",
          backgroundImage: "",
          plans: []
        }
      }
    });
    
    const populatedProject = await Project.findById(project._id).populate('category');
    return NextResponse.json({ success: true, data: populatedProject });
  } catch (error) {
    console.error('Error creating project:', error);
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
  }
}