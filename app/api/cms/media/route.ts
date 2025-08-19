import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { CloudinaryService } from '@/lib/cloudinaryUpload';

const cloudinaryService = new CloudinaryService();

// GET - Fetch media files with pagination and search
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query') || undefined;
    const typeParam = searchParams.get('type');
    
    // Handle the type parameter properly
    const type = (typeParam && typeParam !== 'all') ? typeParam as 'image' | 'video' : undefined;
    
    const limit = parseInt(searchParams.get('limit') || '20');
    const cursor = searchParams.get('cursor') || undefined;

    console.log('API received params:', { query, type, limit, cursor });

    // Use alternative search method for better query handling
    const result = query 
      ? await cloudinaryService.searchFilesAlternative(query, type, limit, cursor)
      : await cloudinaryService.searchFiles(undefined, type, limit, cursor);

    console.log("API sending result:", {
      resourceCount: result.resources.length,
      totalCount: result.total_count,
      hasNextCursor: !!result.next_cursor
    });

    return NextResponse.json({
      success: true,
      data: result
    });

  } catch (error) {
    console.error('Media fetch error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch media files'
    }, { status: 500 });
  }
}

// POST - Upload new media file
export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || undefined;

    if (!file) {
      return NextResponse.json({
        success: false,
        error: 'No file received'
      }, { status: 400 });
    }

    // Validate file size (50MB limit)
    if (file.size > 50 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        error: 'File size must be less than 50MB'
      }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
      'video/mp`4', 'video/webm', 'video/mov', 'video/avi'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json({
        success: false,
        error: `File type ${file.type} is not allowed`
      }, { status: 400 });
    }

    const result = await cloudinaryService.uploadFile(file, folder);

    if (!result.success) {
      return NextResponse.json({
        success: false,
        error: result.error
      }, { status: 400 });
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Media upload error:', error);
    return NextResponse.json({
      success: false,
      error: 'Upload failed'
    }, { status: 500 });
  }
}

// DELETE - Delete media file
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { public_id, resource_type } = await request.json();

    if (!public_id) {
      return NextResponse.json({
        success: false,
        error: 'Public ID is required'
      }, { status: 400 });
    }

    console.log("Deleting file:", public_id, resource_type);

    const success = await cloudinaryService.deleteFile(public_id, resource_type || 'image');

    console.log("Delete success:", success);

    return NextResponse.json({
      success,
      message: success ? 'File deleted successfully' : 'Failed to delete file'
    });

  } catch (error) {
    console.error('Media delete error:', error);
    return NextResponse.json({
      success: false,
      error: 'Delete failed'
    }, { status: 500 });
  }
}