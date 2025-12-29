import { NextResponse } from 'next/server';
import { getAllSurveys } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getTodayDate, checkAndResetDailyLimits } from '@/lib/points';
import { hasUserCompletedSurvey } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const activeOnly = searchParams.get('activeOnly') === 'true';
    
    const surveys = await getAllSurveys(activeOnly);
    const currentUser = await getCurrentUser();
    const today = getTodayDate();

    if (currentUser) {
      await checkAndResetDailyLimits(currentUser.userId);
    }

    // Check which surveys user has completed today
    const surveysWithStatus = await Promise.all(
      surveys.map(async (survey) => {
        let isCompleted = false;
        if (currentUser) {
          isCompleted = await hasUserCompletedSurvey(currentUser.userId, survey.id, today);
        }
        return {
          id: survey.id,
          title: survey.title,
          description: survey.description,
          points: survey.points,
          questionCount: survey.questions.length,
          isCompleted,
        };
      })
    );

    return NextResponse.json({ surveys: surveysWithStatus });
  } catch (error) {
    console.error('Error fetching surveys:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

