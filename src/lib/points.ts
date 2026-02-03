/**
 * Points system utilities
 * Handles daily reset at midnight (not per-user 24-hour windows)
 */

import { format, startOfDay, isAfter, isBefore } from 'date-fns';
import { getUserById, updateUser, getDailyLimit } from './db';

export const POINTS_PER_QUIZ = 10;
export const POINTS_PER_SURVEY = 10;
export const POINTS_PER_VIDEO_AD = 1;
export const MAX_VIDEO_ADS_PER_DAY = 25;
export const MAX_VIDEO_ADS_PER_15_MIN = 5;

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayDate(): string {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Check if we need to reset user's daily limits
 * Resets happen at midnight, not per-user 24-hour windows
 */
export async function checkAndResetDailyLimits(userId: string): Promise<void> {
  const user = await getUserById(userId);
  if (!user) return;

  const today = getTodayDate();
  const lastResetDate = user.lastResetDate || today;
  
  // If last reset was before today, reset the date
  if (lastResetDate !== today) {
    await updateUser(userId, { lastResetDate: today });
  }
}

/**
 * Add points to user
 */
export async function addPoints(userId: string, points: number): Promise<number> {
  const user = await getUserById(userId);
  if (!user) throw new Error('User not found');

  const newPoints = user.points + points;
  await updateUser(userId, { points: newPoints });
  return newPoints;
}

/**
 * Get user's current points
 */
export async function getUserPoints(userId: string): Promise<number> {
  const user = await getUserById(userId);
  if (!user) return 0;
  return user.points;
}

