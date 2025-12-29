import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getVideoAdReward, incrementVideoAdReward } from '@/lib/db';
import { getTodayDate, checkAndResetDailyLimits, addPoints, POINTS_PER_VIDEO_AD, MAX_VIDEO_ADS_PER_DAY } from '@/lib/points';
import { logAnalyticsEvent } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const today = getTodayDate();
    await checkAndResetDailyLimits(currentUser.userId);

    const reward = await getVideoAdReward(currentUser.userId, today);

    if (reward.count >= MAX_VIDEO_ADS_PER_DAY) {
      return NextResponse.json(
        { error: `You have already watched ${MAX_VIDEO_ADS_PER_DAY} video ads today` },
        { status: 400 }
      );
    }

    // Increment count and add points
    const updatedReward = await incrementVideoAdReward(currentUser.userId, today);
    const newPoints = await addPoints(currentUser.userId, POINTS_PER_VIDEO_AD);

    // Log analytics
    await logAnalyticsEvent({
      type: 'video_ad_watch',
      userId: currentUser.userId,
      metadata: { count: updatedReward.count },
    });

    return NextResponse.json({
      success: true,
      pointsEarned: POINTS_PER_VIDEO_AD,
      newTotalPoints: newPoints,
      adsWatchedToday: updatedReward.count,
      remainingToday: MAX_VIDEO_ADS_PER_DAY - updatedReward.count,
    });
  } catch (error) {
    console.error('Error watching video ad:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

