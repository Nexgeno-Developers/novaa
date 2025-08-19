// app/api/upload/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getTokenFromRequest, verifyToken } from '@/lib/auth';
import { FileUploadService } from '@/lib/fileUpload';
import { addMediaItem } from '@/redux/slices/mediaSlice';
import { useAppDispatch } from '@/redux/hooks';

const uploadService = new FileUploadService();

export async function POST(request: NextRequest) {

  const dispatch = useAppDispatch();
  try {
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file received' 
      }, { status: 400 });
    }

    // Upload file using the service
    const result = await uploadService.uploadFile(file);

    if (!result.success) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 });
    }
    // dispatch(addMediaItem(result.data)); 


    return NextResponse.json(result);

  } catch (error) {
    console.error('Upload route error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}

// DELETE endpoint to remove uploaded files
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const token = getTokenFromRequest(request);
    if (!token || !verifyToken(token)) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json({ 
        success: false, 
        error: 'Filename is required' 
      }, { status: 400 });
    }

    // Delete file using the service
    const success = await uploadService.deleteFile(filename);

    return NextResponse.json({ 
      success,
      message: success ? 'File deleted successfully' : 'Failed to delete file'
    });

  } catch (error) {
    console.error('Delete route error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Internal server error' 
    }, { status: 500 });
  }
}