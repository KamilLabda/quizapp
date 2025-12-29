/**
 * Guest Session Management
 * Handles temporary storage of survey completions for unauthenticated users
 * Data is stored in localStorage and migrated to database after login
 */

export interface GuestSurveyCompletion {
  surveyId: string;
  completedAt: string;
  responses: Record<string, any>;
  points: number;
  userData?: {
    ipAddress?: string;
    sessionTime?: number;
    userAgent?: string;
    referrer?: string;
  };
}

const GUEST_SESSION_KEY = 'guest_survey_completions';
const GUEST_SESSION_COUNT_KEY = 'guest_survey_count';

/**
 * Get all guest survey completions from localStorage
 */
export function getGuestCompletions(): GuestSurveyCompletion[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(GUEST_SESSION_KEY);
    if (!stored) return [];
    return JSON.parse(stored) as GuestSurveyCompletion[];
  } catch (error) {
    console.error('Error reading guest completions:', error);
    return [];
  }
}

/**
 * Add a survey completion to guest session
 */
export function addGuestCompletion(completion: GuestSurveyCompletion): void {
  if (typeof window === 'undefined') return;
  
  try {
    const completions = getGuestCompletions();
    // Check if already completed (prevent duplicates)
    const exists = completions.some(c => c.surveyId === completion.surveyId);
    if (!exists) {
      completions.push(completion);
      localStorage.setItem(GUEST_SESSION_KEY, JSON.stringify(completions));
      
      // Update count
      const count = getGuestSurveyCount();
      localStorage.setItem(GUEST_SESSION_COUNT_KEY, String(count + 1));
    }
  } catch (error) {
    console.error('Error saving guest completion:', error);
  }
}

/**
 * Get count of guest survey completions
 */
export function getGuestSurveyCount(): number {
  if (typeof window === 'undefined') return 0;
  
  try {
    const count = localStorage.getItem(GUEST_SESSION_COUNT_KEY);
    return count ? parseInt(count, 10) : 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Check if user has completed at least one survey as guest
 */
export function hasGuestCompletions(): boolean {
  return getGuestSurveyCount() > 0;
}

/**
 * Clear all guest completions (after migration to database)
 */
export function clearGuestCompletions(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(GUEST_SESSION_KEY);
    localStorage.removeItem(GUEST_SESSION_COUNT_KEY);
  } catch (error) {
    console.error('Error clearing guest completions:', error);
  }
}

/**
 * Get total points from guest completions
 */
export function getGuestTotalPoints(): number {
  const completions = getGuestCompletions();
  return completions.reduce((total, completion) => total + completion.points, 0);
}

