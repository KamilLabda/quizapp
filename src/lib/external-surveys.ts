/**
 * External Survey API Integration
 * Handles integration with external survey providers via iframe
 */

import { ExternalSurveyProvider, ExternalSurvey } from '@/types';
import { getCurrentUser } from './auth';

/**
 * Get user's IP address from request headers
 */
export function getUserIP(request: Request): string | null {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  return null;
}

/**
 * Get user agent from request
 */
export function getUserAgent(request: Request): string | null {
  return request.headers.get('user-agent') || null;
}

/**
 * Get referrer from request
 */
export function getReferrer(request: Request): string | null {
  return request.headers.get('referer') || null;
}

/**
 * Build iframe URL with user data for external survey provider
 */
export async function buildSurveyIframeUrl(
  survey: ExternalSurvey,
  request: Request
): Promise<string> {
  const user = await getCurrentUser();
  const ipAddress = getUserIP(request);
  const userAgent = getUserAgent(request);
  const referrer = getReferrer(request);
  
  // Build URL with user data parameters
  const url = new URL(survey.iframeUrl);
  
  // Add user identification
  if (user) {
    url.searchParams.set('user_id', user.userId);
    url.searchParams.set('email', user.email);
    // Optional: Add username if provider supports it
    // url.searchParams.set('username', user.username);
  }
  
  // Add tracking data (optional, based on provider requirements)
  if (ipAddress) {
    url.searchParams.set('ip', ipAddress);
  }
  
  if (userAgent) {
    url.searchParams.set('user_agent', userAgent);
  }
  
  if (referrer) {
    url.searchParams.set('referrer', referrer);
  }
  
  // Add session identifier
  url.searchParams.set('session_id', crypto.randomUUID());
  url.searchParams.set('timestamp', Date.now().toString());
  
  return url.toString();
}

/**
 * Track survey start with user data
 */
export interface SurveyStartData {
  userId: string;
  surveyId: string;
  providerId: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  startTime: number;
}

/**
 * Track survey completion with user data
 */
export interface SurveyCompleteData {
  userId: string;
  surveyId: string;
  providerId: string;
  ipAddress?: string;
  userAgent?: string;
  sessionTime: number; // in seconds
  responses?: Record<string, any>;
  pointsEarned: number;
}

