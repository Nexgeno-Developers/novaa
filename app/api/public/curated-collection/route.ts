import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Section from '@/models/Section';
import Category from '@/models/Category';

export async function GET() {
  try {
    await connectDB();
    
    // Fetch curated collection section from home page
    const section = await Section.findOne({
      pageSlug: 'home',
      slug: 'curated-collection',
      status: 'active'
    }).lean() as any; // Type assertion to handle MongoDB lean() typing issues
    
    // Fetch all active categories for the tabs
    const categories = await Category.find({ 
      isActive: true 
    })
    .sort({ order: 1 })
    .lean();

    if (!section) {
      // Return default structure if section doesn't exist
      return NextResponse.json({
        success: true,
        data: {
          collection: {
            title: "CURATED COLLECTION",
            description: "Every property we list is handpicked, backed by deep research, developer due diligence, and real investment potential.",
            isActive: true,
            items: {}
          },
          categories: categories || [],
          projects: {}
        }
      });
    }

    // Safely access content properties
    const content = section.content || {};
    
    // Transform section data to match expected format
    const transformedData = {
      collection: {
        title: content.title || "CURATED COLLECTION",
        description: content.description || "",
        isActive: content.isActive ?? true,
        items: content.items || {}
      },
      categories: categories || [],
      projects: content.items || {} // For backward compatibility
    };
    
    return NextResponse.json({
      success: true,
      data: transformedData
    });
    
  } catch (error) {
    console.error('Public curated collection fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch curated collection data'
    }, { status: 500 });
  }
}