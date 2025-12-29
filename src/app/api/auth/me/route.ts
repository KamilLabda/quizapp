import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { getUserById } from '@/lib/db';

export async function GET() {
  const currentUser = await getCurrentUser();
  
  if (!currentUser) {
    return NextResponse.json(
      { error: 'Not authenticated' },
      { status: 401 }
    );
  }

  const user = await getUserById(currentUser.userId);
  if (!user) {
    return NextResponse.json(
      { error: 'User not found' },
      { status: 404 }
    );
  }

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      username: user.username,
      points: user.points,
    },
  });
}

