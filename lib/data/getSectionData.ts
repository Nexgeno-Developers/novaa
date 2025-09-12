// app/api/revalidate/route.ts
import { revalidateTag, revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { secret, tags, paths } = await request.json();

    // Verify the secret (recommended for security)
    if (secret !== process.env.REVALIDATION_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
    }

    // Revalidate cache tags
    if (tags && Array.isArray(tags)) {
      tags.forEach((tag: string) => {
        console.log(`Revalidating tag: ${tag}`);
        revalidateTag(tag);
      });
    }

    // Revalidate specific paths
    if (paths && Array.isArray(paths)) {
      paths.forEach((path: string) => {
        console.log(`Revalidating path: ${path}`);
        revalidatePath(path);
      });
    }

    return NextResponse.json({ 
      message: 'Revalidated successfully',
      revalidatedTags: tags,
      revalidatedPaths: paths,
      timestamp: new Date().toISOString()
    });
  } catch (error : any) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { message: 'Error revalidating', error: error.message },
      { status: 500 }
    );
  }
}