import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getVideoAdReward } from '@/lib/db';
import { getTodayDate, checkAndResetDailyLimits, getUserPoints, MAX_VIDEO_ADS_PER_DAY } from '@/lib/points';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    const today = getTodayDate();
    await checkAndResetDailyLimits(currentUser.userId);

    const reward = await getVideoAdReward(currentUser.userId, today);
    const totalPoints = await getUserPoints(currentUser.userId);

    return NextResponse.json({
      adsWatchedToday: reward.count,
      remainingToday: Math.max(0, MAX_VIDEO_ADS_PER_DAY - reward.count),
      totalPoints,
    });
  } catch (error) {
    console.error('Video ads stats error:', error);
    return NextResponse.json(
      { error: 'Failed to load video ad stats. Please try again.' },
      { status: 500 }
    );
  }
}

