import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, generateToken, setAuthToken } from '@/lib/auth';
import { createUser, getUserByEmail } from '@/lib/db';
import { verifyHCaptcha } from '@/lib/hcaptcha';
import { getUserIP } from '@/lib/external-surveys';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email(),
  username: z.string().min(3).max(30),
  password: z.string().min(6),
  hcaptchaToken: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, username, password, hcaptchaToken } = registerSchema.parse(body);

    // Verify hCaptcha
    const ipAddress = getUserIP(request);
    const hcaptchaResult = await verifyHCaptcha(hcaptchaToken, ipAddress || undefined);
    if (!hcaptchaResult.success) {
      return NextResponse.json(
        { error: hcaptchaResult.error || 'Captcha verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }

    // Create user
    const passwordHash = await hashPassword(password);
    const user = await createUser({
      email,
      username,
      passwordHash,
      points: 0,
    });

    // Generate token and set cookie
    const token = generateToken({ userId: user.id, email: user.email });
    await setAuthToken(token);

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        points: user.points,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input', details: error.issues },
        { status: 400 }
      );
    }
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

