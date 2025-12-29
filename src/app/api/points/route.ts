import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserPoints } from '@/lib/points';

export async function GET() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const points = await getUserPoints(currentUser.userId);
  return NextResponse.json({ points });
}

