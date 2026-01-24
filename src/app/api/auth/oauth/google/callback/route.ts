import { NextRequest, NextResponse } from 'next/server';
import { generateToken, setAuthToken } from '@/lib/auth';
import { getUserByEmail, getUserByOAuthProvider, createUser } from '@/lib/db';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const BASE_URL = process.env.NEXTAUTH_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

function resolveSafeRedirectUrl(rawRedirect: string | undefined, baseUrl: string): string {
  // Default fallback
  const fallback = new URL('/surveys', baseUrl).toString();
  if (!rawRedirect) return fallback;

  try {
    // Allow relative paths like "/surveys" by resolving against BASE_URL
    const resolved = new URL(rawRedirect, baseUrl);
    const base = new URL(baseUrl);

    // Prevent open-redirects: only allow same-origin redirects
    if (resolved.origin !== base.origin) return fallback;

    return resolved.toString();
  } catch {
    return fallback;
  }
}

interface GoogleUserInfo {
  id: string;
  email: string;
  verified_email: boolean;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    // Check for OAuth errors
    if (error) {
      return NextResponse.redirect(`${BASE_URL}/login?error=oauth_cancelled`);
    }

    if (!code || !state) {
      return NextResponse.redirect(`${BASE_URL}/login?error=invalid_request`);
    }

    // Verify state
    const storedState = request.cookies.get('oauth-state')?.value;
    if (!storedState || storedState !== state) {
      return NextResponse.redirect(`${BASE_URL}/login?error=invalid_state`);
    }

    if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
      return NextResponse.redirect(`${BASE_URL}/login?error=oauth_not_configured`);
    }

    const callbackUrl = `${BASE_URL}/api/auth/oauth/google/callback`;

    // Exchange authorization code for access token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: callbackUrl,
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Token exchange failed:', await tokenResponse.text());
      return NextResponse.redirect(`${BASE_URL}/login?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user info from Google
    const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(`${BASE_URL}/login?error=userinfo_failed`);
    }

    const userInfo: GoogleUserInfo = await userInfoResponse.json();

    if (!userInfo.verified_email) {
      return NextResponse.redirect(`${BASE_URL}/login?error=email_not_verified`);
    }

    // Check if user exists by OAuth provider ID
    let user = await getUserByOAuthProvider('google', userInfo.id);

    // If not found, check by email
    if (!user) {
      const existingUserByEmail = await getUserByEmail(userInfo.email);
      
      if (existingUserByEmail) {
        // Link OAuth to existing account
        // For now, we'll create a new account if email exists but OAuth doesn't match
        // In a production app, you might want to link accounts or prompt the user
        return NextResponse.redirect(`${BASE_URL}/login?error=email_already_exists`);
      }

      // Create new user
      const username = userInfo.given_name?.toLowerCase().replace(/\s+/g, '') || 
                      userInfo.email.split('@')[0] || 
                      `user${Date.now()}`;

      user = await createUser({
        email: userInfo.email,
        username: username.substring(0, 30), // Ensure username fits
        points: 0,
        oauthProvider: 'google',
        oauthProviderId: userInfo.id,
      });
    }

    // Get redirect URL from cookie (may be relative like "/surveys")
    const redirectCookie = request.cookies.get('oauth-redirect')?.value;
    const redirectTo = resolveSafeRedirectUrl(redirectCookie, BASE_URL);
    
    // Generate token and set cookie
    const token = generateToken({ userId: user.id, email: user.email });
    const response = NextResponse.redirect(redirectTo);
    
    // Set auth token cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    // Clear OAuth state and redirect cookies
    response.cookies.delete('oauth-state');
    response.cookies.delete('oauth-redirect');

    return response;
  } catch (error) {
    console.error('OAuth callback error:', error);
    return NextResponse.redirect(`${BASE_URL}/login?error=oauth_failed`);
  }
}
