import { NextRequest, NextResponse } from 'next/server';
import { verifyPassword, generateToken, setAuthToken } from '@/lib/auth';
import { getUserByEmail } from '@/lib/db';
import { verifyHCaptcha } from '@/lib/hcaptcha';
import { getUserIP } from '@/lib/external-surveys';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  hcaptchaToken: z.string().min(1),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, hcaptchaToken } = loginSchema.parse(body);

    // Verify hCaptcha
    const ipAddress = getUserIP(request);
    const hcaptchaResult = await verifyHCaptcha(hcaptchaToken, ipAddress || undefined);
    if (!hcaptchaResult.success) {
      return NextResponse.json(
        { error: hcaptchaResult.error || 'Captcha verification failed. Please try again.' },
        { status: 400 }
      );
    }

    // Get user
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password (skip for OAuth users)
    if (!user.passwordHash) {
      return NextResponse.json(
        { error: 'This account uses Google sign-in. Please use the Google button to login.' },
        { status: 401 }
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

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
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

