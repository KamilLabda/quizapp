// Core types for the survey application

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  points: number;
  createdAt: string;
  lastResetDate: string; // Date when points were last reset
}

export interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  points: number;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface SurveyQuestion {
  id: string;
  question: string;
  type: 'text' | 'multiple-choice' | 'rating' | 'yes-no';
  options?: string[]; // For multiple-choice
  required: boolean;
}

export interface UserSurveyCompletion {
  userId: string;
  surveyId: string;
  completedAt: string;
  responses: Record<string, any>;
  // User tracking data for companies
  userData?: {
    ipAddress?: string;
    sessionTime?: number; // in seconds
    userAgent?: string;
    referrer?: string;
  };
}

export interface DailyLimit {
  userId: string;
  date: string; // YYYY-MM-DD format
  surveysCompleted: string[]; // Array of survey IDs
  videoAdsWatched: number; // Count of video ads watched today
}

export interface AdConfig {
  id: string;
  network: AdNetwork;
  type: AdType;
  position: AdPosition;
  code: string; // Ad code/script
  isActive: boolean;
  priority: number; // For rotation priority
}

export type AdNetwork = 'adsterra' | 'propellerads' | 'admaven' | 'dummy';
export type AdType = 'banner' | 'interstitial' | 'native' | 'sticky' | 'video' | 'pop-under' | 'in-article';
export type AdPosition = 'top' | 'bottom' | 'sidebar' | 'sidebar-left' | 'sidebar-right' | 'between-questions' | 'result-page' | 'interstitial';

export interface LinkShortener {
  id: string;
  name: string;
  apiKey?: string;
  apiUrl?: string;
  isActive: boolean;
  priority: number;
}

export interface AnalyticsEvent {
  id: string;
  type: 'survey_view' | 'survey_complete' | 'ad_click' | 'shortlink_use' | 'video_ad_watch' | 'external_survey_start' | 'external_survey_complete';
  userId?: string;
  surveyId?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

export interface VideoAdReward {
  userId: string;
  date: string; // YYYY-MM-DD
  count: number; // Number of ads watched today
}

// External Survey API Integration
export interface ExternalSurveyProvider {
  id: string;
  name: string;
  apiUrl: string;
  apiKey?: string;
  iframeUrl?: string;
  isActive: boolean;
  priority: number;
  // Scoring configuration
  pointsPerSurvey?: number; // Default points per survey
  scoringRules?: {
    minTime?: number; // Minimum time in seconds
    requiredFields?: string[]; // Required fields for completion
  };
}

export interface ExternalSurvey {
  id: string;
  providerId: string;
  title: string;
  description?: string;
  points: number;
  estimatedTime?: number; // in minutes
  iframeUrl: string;
  isActive: boolean;
  // User data to send to provider
  userData?: {
    userId: string;
    email?: string;
    username?: string;
    ipAddress?: string;
  };
}

