import { NextRequest } from 'next/server';
import connectDB from '@/lib/mongodb';
import {Admin} from '@/models/Admin';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();
    
    const token = getTokenFromRequest(request);
    if (!token) {
      return Response.json({ message: 'No token provided' }, { status: 401 });
    }
    
    const decoded = await verifyToken(token); // ✅ await
if (!decoded) {
  return Response.json({ message: 'Invalid token' }, { status: 401 });
}

// decoded.adminId is now a string
const admin = await Admin.findById(decoded.adminId).select('-password');
    
    if (!admin) {
      return Response.json({ message: 'Admin not found' }, { status: 401 });
    }
    
    return Response.json({
      success: true,
      user: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    });
  } catch (error) {
    console.error('Auth verification error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}