/**
 * Link shortener system with rotation
 * Currently uses dummy placeholders - easy to replace with real shortener APIs
 */

import { LinkShortener } from '@/types';

/**
 * Dummy shortener URLs - replace with real API calls
 */
const DUMMY_SHORTENERS: Record<string, string> = {
  linkvertise: 'https://linkvertise.com/dummy',
  shrinkme: 'https://shrinkme.io/dummy',
  exeio: 'https://exe.io/dummy',
  shorte: 'https://shorte.st/dummy',
  adfly: 'https://adf.ly/dummy',
  ouo: 'https://ouo.io/dummy',
};

/**
 * Shorten a URL using the selected shortener
 * TODO: Replace with real API integration
 */
async function shortenWithAPI(shortener: LinkShortener, url: string): Promise<string> {
  // DUMMY IMPLEMENTATION - Replace with real API calls
  
  // Example structure for real implementation:
  /*
  switch (shortener.name.toLowerCase()) {
    case 'linkvertise':
      // const response = await fetch(`${shortener.apiUrl}`, {
      //   method: 'POST',
      //   headers: { 'Authorization': `Bearer ${shortener.apiKey}` },
      //   body: JSON.stringify({ url })
      // });
      // return response.json().shortUrl;
      break;
    case 'shrinkme':
      // Similar API call
      break;
    // ... other shorteners
  }
  */
  
  // For now, return a dummy shortened URL
  const baseUrl = DUMMY_SHORTENERS[shortener.name.toLowerCase()] || 'https://short.ly/dummy';
  return `${baseUrl}/${encodeURIComponent(url)}`;
}

/**
 * Get a shortened URL with quiz-based rotation
 * Rotates through available shorteners based on quiz ID
 * This ensures consistent shortener per quiz for better tracking
 */
export async function getShortenedUrl(originalUrl: string, rotationKey?: string): Promise<string> {
  // Lazy import to prevent client-side bundling
  const { getActiveShorteners } = await import('./db');
  const shorteners = await getActiveShorteners();
  
  if (shorteners.length === 0) {
    // No shorteners configured, return original URL
    return originalUrl;
  }

  // Quiz-based rotation: use rotationKey (quizId) to consistently select a shortener
  // This ensures the same quiz always uses the same shortener
  let selectedShortener: LinkShortener;
  
  if (rotationKey) {
    // Use rotation key (quizId) to consistently select a shortener
    const index = hashString(rotationKey) % shorteners.length;
    selectedShortener = shorteners[index];
  } else {
    // Random selection if no rotation key provided
    selectedShortener = shorteners[Math.floor(Math.random() * shorteners.length)];
  }

  return shortenWithAPI(selectedShortener, originalUrl);
}

/**
 * Simple hash function for consistent rotation
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash);
}

/**
 * Get shortener for a specific quiz or user
 * This ensures consistent shortener usage
 */
export async function getShortenerForQuiz(quizId: string): Promise<LinkShortener | null> {
  // Lazy import to prevent client-side bundling
  const { getActiveShorteners } = await import('./db');
  const shorteners = await getActiveShorteners();
  if (shorteners.length === 0) return null;
  
  const index = hashString(quizId) % shorteners.length;
  return shorteners[index];
}

