import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import Navbar from '@/models/Navbar';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

// GET - Fetch navbar data (public)
export async function GET() {
  try {
    await connectDB();
    
    let navbar = await Navbar.findOne();
    if (!navbar) {
      // Create default navbar if none exists
      navbar = await Navbar.create({
        logo: { url: '/images/logo.png', alt: 'Novaa Real Estate' },
        items: [
          { label: 'Home', href: '/', order: 1, isActive: true },
          { label: 'About Us', href: '/about-us', order: 2, isActive: true },
          { label: 'Projects', href: '/project', order: 3, isActive: true },
          { label: 'Blog', href: '/blog', order: 4, isActive: true },
          { label: 'Contact Us', href: '/contact-us', order: 5, isActive: true },
        ],
      });
    }
    
    return Response.json(navbar);
  } catch (error) {
    console.error('Navbar fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update navbar (admin only)
export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const updateData = await request.json();
    
    let navbar = await Navbar.findOne();
    if (!navbar) {
      navbar = new Navbar(updateData);
    } else {
      Object.assign(navbar, updateData);
    }
    
    await navbar.save();
    
    return Response.json(navbar);
  } catch (error) {
    console.error('Navbar update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}