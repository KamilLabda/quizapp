import { NextRequest, NextResponse } from 'next/server';
import { getShortenedUrl } from '@/lib/shorteners';

/**
 * API endpoint to shorten URLs with quiz-based rotation
 * This allows client-side components to get shortened URLs
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { url, quizId } = body;

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      );
    }

    // Use quizId for consistent shortener rotation
    const shortenedUrl = await getShortenedUrl(url, quizId);

    return NextResponse.json({ shortenedUrl });
  } catch (error) {
    console.error('Error shortening URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

