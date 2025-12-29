import { NextRequest, NextResponse } from 'next/server';
import { getSurveyById, hasUserCompletedSurvey } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getTodayDate } from '@/lib/points';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const survey = await getSurveyById(id);

    if (!survey) {
      return NextResponse.json(
        { error: 'Survey not found' },
        { status: 404 }
      );
    }

    if (!survey.isActive) {
      return NextResponse.json(
        { error: 'Survey is not active' },
        { status: 403 }
      );
    }

    const currentUser = await getCurrentUser();
    let isCompleted = false;

    if (currentUser) {
      const today = getTodayDate();
      isCompleted = await hasUserCompletedSurvey(currentUser.userId, id, today);
    }

    return NextResponse.json({
      survey: {
        id: survey.id,
        title: survey.title,
        description: survey.description,
        points: survey.points,
        questions: survey.questions,
        isCompleted,
      },
    });
  } catch (error) {
    console.error('Error fetching survey:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

