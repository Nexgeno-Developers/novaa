// app/api/cms/home/route.ts
import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import HomePage from '@/models/HomePage';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET() {
  try {
    await connectDB();
    
    let homePage = await HomePage.findOne();
    if (!homePage) {
      // Create default home page data
      homePage = await HomePage.create({
        heroSection: {
          mediaType: 'image',
          mediaUrl: '/images/hero.jpg',
          title: 'Experience Unparalleled',
          subtitle: 'Luxury in Thailand',
          highlightedWords: [
            { 
              word: 'Luxury in Thailand', 
              style: { 
                color: '#C3912F',
                fontWeight: 'bold',
                background: 'linear-gradient(45deg, #C3912F, #F5E7A8, #C3912F)',
                fontFamily: 'font-cinzel'
              } 
            }
          ],
          ctaButton: {
            text: 'Explore Properties',
            href: '/projects',
            isActive: false,
          },
          overlayOpacity: 0.4,
          overlayColor: '#01292B',
          titleFontFamily: 'font-cinzel',
          subtitleFontFamily: 'font-cinzel',
           titleFontSize: 'text-3xl md:text-5xl',
          subtitleFontSize: 'text-xl md:text-3xl',
          titleGradient: 'none', // Add this
          subtitleGradient: 'none' // Add this
        }
      });
    }
    
    return Response.json(homePage);
  } catch (error) {
    console.error('Home page fetch error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return Response.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const updateData = await request.json();
    
    let homePage = await HomePage.findOne();
    if (!homePage) {
      homePage = new HomePage(updateData);
    } else {
      Object.assign(homePage, updateData);
    }
    
    await homePage.save();
    
    return Response.json(homePage);
  } catch (error) {
    console.error('Home page update error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}