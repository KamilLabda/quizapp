import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { recordSurveyCompletion, updateDailyLimit } from '@/lib/db';
import { getTodayDate, checkAndResetDailyLimits, addPoints } from '@/lib/points';
import { logAnalyticsEvent } from '@/lib/db';
import { z } from 'zod';

const migrateSchema = z.object({
  completions: z.array(z.object({
    surveyId: z.string(),
    completedAt: z.string(),
    responses: z.record(z.string(), z.any()),
    points: z.number(),
    userData: z.object({
      ipAddress: z.string().optional(),
      sessionTime: z.number().optional(),
      userAgent: z.string().optional(),
      referrer: z.string().optional(),
    }).optional(),
  })),
});

/**
 * API endpoint to migrate guest survey completions to authenticated user account
 * Called after user logs in to save their guest survey data
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
    const { completions } = migrateSchema.parse(body);

    if (completions.length === 0) {
      return NextResponse.json({
        success: true,
        migrated: 0,
        totalPoints: 0,
      });
    }

    const today = getTodayDate();
    await checkAndResetDailyLimits(currentUser.userId);

    let totalPoints = 0;
    const surveyIds: string[] = [];

    // Migrate each completion
    for (const completion of completions) {
      // Check if already completed today (prevent duplicates)
      const { hasUserCompletedSurvey } = await import('@/lib/db');
      const isCompleted = await hasUserCompletedSurvey(
        currentUser.userId,
        completion.surveyId,
        today
      );

      if (!isCompleted) {
        // Record completion
        await recordSurveyCompletion({
          userId: currentUser.userId,
          surveyId: completion.surveyId,
          completedAt: completion.completedAt,
          responses: completion.responses,
          userData: completion.userData,
        });

        surveyIds.push(completion.surveyId);
        totalPoints += completion.points;

        // Log analytics
        await logAnalyticsEvent({
          type: 'survey_complete',
          userId: currentUser.userId,
          surveyId: completion.surveyId,
          metadata: {
            migrated: true,
            responseCount: Object.keys(completion.responses).length,
          },
        });
      }
    }

    // Update daily limits
    if (surveyIds.length > 0) {
      await updateDailyLimit(currentUser.userId, today, {
        surveysCompleted: surveyIds,
      });
    }

    // Add all points at once
    if (totalPoints > 0) {
      await addPoints(currentUser.userId, totalPoints);
    }

    return NextResponse.json({
      success: true,
      migrated: surveyIds.length,
      totalPoints,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error migrating guest data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

