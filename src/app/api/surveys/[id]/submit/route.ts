import { NextRequest, NextResponse } from 'next/server';
import { getSurveyById, hasUserCompletedSurvey, recordSurveyCompletion, updateDailyLimit } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getTodayDate, checkAndResetDailyLimits, addPoints, POINTS_PER_SURVEY } from '@/lib/points';
import { logAnalyticsEvent } from '@/lib/db';
import { getUserIP, getUserAgent, getReferrer } from '@/lib/external-surveys';
import { z } from 'zod';

const submitSchema = z.object({
  responses: z.record(z.string(), z.any()), // questionId -> response
  startTime: z.number().optional(), // Start time for session tracking
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser();
    const { id } = await params;
    const survey = await getSurveyById(id);

    if (!survey || !survey.isActive) {
      return NextResponse.json(
        { error: 'Survey not found or not active' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { responses, startTime } = submitSchema.parse(body);

    // Validate required questions
    const requiredQuestions = survey.questions.filter(q => q.required);
    for (const question of requiredQuestions) {
      if (!responses[question.id] || responses[question.id] === '') {
        return NextResponse.json(
          { error: `Question "${question.question}" is required` },
          { status: 400 }
        );
      }
    }

    // Get user tracking data for companies
    const ipAddress = getUserIP(request);
    const userAgent = getUserAgent(request);
    const referrer = getReferrer(request);
    
    // Calculate session time (if available from metadata)
    const sessionTime = startTime ? Math.floor((Date.now() - startTime) / 1000) : undefined;

    const completionData = {
      surveyId: id,
      completedAt: new Date().toISOString(),
      responses,
      points: survey.points || POINTS_PER_SURVEY,
      userData: {
        ipAddress: ipAddress || undefined,
        sessionTime: sessionTime,
        userAgent: userAgent || undefined,
        referrer: referrer || undefined,
      },
    };

    // If user is authenticated, save to database
    if (currentUser) {
      const today = getTodayDate();
      await checkAndResetDailyLimits(currentUser.userId);
      
      const isCompleted = await hasUserCompletedSurvey(currentUser.userId, id, today);
      if (isCompleted) {
        return NextResponse.json(
          { error: 'You have already completed this survey today' },
          { status: 400 }
        );
      }

      // Record completion with user tracking data
      await recordSurveyCompletion({
        userId: currentUser.userId,
        ...completionData,
      });

      // Update daily limit
      await updateDailyLimit(currentUser.userId, today, {
        surveysCompleted: [id],
      });

      // Add points
      const newPoints = await addPoints(currentUser.userId, completionData.points);

      // Log analytics
      await logAnalyticsEvent({
        type: 'survey_complete',
        userId: currentUser.userId,
        surveyId: id,
        metadata: { responseCount: Object.keys(responses).length },
      });

      return NextResponse.json({
        success: true,
        pointsEarned: completionData.points,
        newTotalPoints: newPoints,
        requiresLogin: false,
      });
    } else {
      // Guest user - return completion data to be stored in localStorage
      // Frontend will handle storing and prompting for login after first survey
      return NextResponse.json({
        success: true,
        pointsEarned: completionData.points,
        guestCompletion: completionData,
        requiresLogin: true, // Prompt for login after first survey
      });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Error submitting survey:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

