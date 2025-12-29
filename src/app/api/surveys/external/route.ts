import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { buildSurveyIframeUrl, getUserIP, getUserAgent, getReferrer } from '@/lib/external-surveys';
import { ExternalSurvey } from '@/types';
import { logAnalyticsEvent } from '@/lib/db';

/**
 * API endpoint to get iframe URL for external survey
 * This endpoint builds the iframe URL with user data for companies
 */
export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { surveyId, providerId, iframeUrl } = body;

    if (!surveyId || !iframeUrl) {
      return NextResponse.json(
        { error: 'surveyId and iframeUrl are required' },
        { status: 400 }
      );
    }

    // Build iframe URL with user data
    const urlWithUserData = await buildSurveyIframeUrl(
      {
        id: surveyId,
        providerId: providerId || 'unknown',
        iframeUrl,
        title: body.title || 'Survey',
        points: body.points || 10,
        isActive: true,
        userData: {
          userId: currentUser.userId,
          email: currentUser.email,
          username: currentUser.email, // Use email as username if not available
        },
      },
      request
    );

    // Log survey start with user tracking
    const ipAddress = getUserIP(request);
    const userAgent = getUserAgent(request);
    const referrer = getReferrer(request);

    await logAnalyticsEvent({
      type: 'external_survey_start',
      userId: currentUser.userId,
      surveyId,
      metadata: {
        providerId,
        ipAddress,
        userAgent,
        referrer,
      },
    });

    return NextResponse.json({
      success: true,
      iframeUrl: urlWithUserData,
    });
  } catch (error) {
    console.error('Error building external survey URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

