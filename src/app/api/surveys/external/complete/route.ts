import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getTodayDate, checkAndResetDailyLimits, addPoints } from '@/lib/points';
import { updateDailyLimit, recordSurveyCompletion, hasUserCompletedSurvey } from '@/lib/db';
import { getUserIP, getUserAgent, getReferrer } from '@/lib/external-surveys';
import { logAnalyticsEvent } from '@/lib/db';
import { z } from 'zod';

const completeSchema = z.object({
  surveyId: z.string(),
  providerId: z.string(),
  points: z.number().optional(),
  sessionTime: z.number().optional(), // in seconds
  responses: z.record(z.string(), z.any()).optional(), // Optional survey responses
});

/**
 * API endpoint to record completion of external survey
 * Called when user completes a survey from external provider via iframe
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
    const { surveyId, providerId, points, sessionTime, responses } = completeSchema.parse(body);

    // Check daily limit
    const today = getTodayDate();
    await checkAndResetDailyLimits(currentUser.userId);
    
    const isCompleted = await hasUserCompletedSurvey(currentUser.userId, surveyId, today);
    if (isCompleted) {
      return NextResponse.json(
        { error: 'You have already completed this survey today' },
        { status: 400 }
      );
    }

    // Get user tracking data
    const ipAddress = getUserIP(request);
    const userAgent = getUserAgent(request);
    const referrer = getReferrer(request);

    // Record completion with user tracking data
    await recordSurveyCompletion({
      userId: currentUser.userId,
      surveyId,
      completedAt: new Date().toISOString(),
      responses: responses || {},
      userData: {
        ipAddress: ipAddress || undefined,
        sessionTime: sessionTime,
        userAgent: userAgent || undefined,
        referrer: referrer || undefined,
      },
    });

    // Update daily limit
    await updateDailyLimit(currentUser.userId, today, {
      surveysCompleted: [surveyId],
    });

    // Add points (use provided points or default)
    const pointsToAdd = points || 10;
    const newPoints = await addPoints(currentUser.userId, pointsToAdd);

    // Log analytics
    await logAnalyticsEvent({
      type: 'external_survey_complete',
      userId: currentUser.userId,
      surveyId,
      metadata: {
        providerId,
        pointsEarned: pointsToAdd,
        sessionTime,
        ipAddress,
        userAgent,
        referrer,
      },
    });

    return NextResponse.json({
      success: true,
      pointsEarned: pointsToAdd,
      newTotalPoints: newPoints,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error completing external survey:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

