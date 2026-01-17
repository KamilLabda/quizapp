import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserOfferwallTransactions, getUserOfferwallStats } from '@/lib/db';

/**
 * GET handler for user offerwall history
 * Returns transaction history and statistics for the authenticated user
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get('limit') || '50', 10);
    const offset = parseInt(searchParams.get('offset') || '0', 10);

    // Validate pagination parameters
    if (limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 100' },
        { status: 400 }
      );
    }

    if (offset < 0) {
      return NextResponse.json(
        { error: 'Offset must be >= 0' },
        { status: 400 }
      );
    }

    // Get user transactions
    const transactions = await getUserOfferwallTransactions(
      currentUser.userId,
      limit,
      offset
    );

    // Get user statistics
    const stats = await getUserOfferwallStats(currentUser.userId);

    return NextResponse.json({
      success: true,
      transactions,
      stats,
      pagination: {
        limit,
        offset,
        total: stats.totalCompletions,
      },
    });
  } catch (error) {
    console.error('Error fetching offerwall history:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch offerwall history',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
