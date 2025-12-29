import { NextRequest, NextResponse } from 'next/server';
import { getAdForPosition } from '@/lib/ads';
import { AdPosition, AdType } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position') as AdPosition;
    const type = searchParams.get('type') as AdType | null;
    const surveyId = searchParams.get('surveyId') || undefined; // Survey ID for rotation

    if (!position) {
      return NextResponse.json(
        { error: 'Position parameter is required' },
        { status: 400 }
      );
    }

    // Pass surveyId for survey-based ad rotation
    const adCode = await getAdForPosition(position, type || undefined, surveyId);

    return NextResponse.json({ adCode });
  } catch (error) {
    console.error('Error fetching ad:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

