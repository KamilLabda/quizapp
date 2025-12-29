/**
 * Ad system with rotation
 * Currently uses dummy placeholders - easy to replace with real ad networks
 */

import { AdConfig, AdNetwork, AdType, AdPosition } from '@/types';

/**
 * Dummy ad codes - replace these with real ad network codes
 */
const DUMMY_AD_CODES: Record<AdNetwork, Partial<Record<AdType, string>>> = {
  adsterra: {
    banner: '<div class="dummy-ad adsterra-banner">Adsterra Banner Ad (Replace with real code)</div>',
    interstitial: '<div class="dummy-ad adsterra-interstitial">Adsterra Interstitial Ad (Replace with real code)</div>',
    native: '<div class="dummy-ad adsterra-native">Adsterra Native Ad (Replace with real code)</div>',
    sticky: '<div class="dummy-ad adsterra-sticky">Adsterra Sticky Ad (Replace with real code)</div>',
    video: '<div class="dummy-ad adsterra-video">Adsterra Video Ad (Replace with real code)</div>',
    'pop-under': '<div class="dummy-ad adsterra-popunder">Adsterra Pop-Under Ad (Replace with real code)</div>',
    'in-article': '<div class="dummy-ad adsterra-inarticle">Adsterra In-Article Ad (Replace with real code)</div>',
  },
  propellerads: {
    banner: '<div class="dummy-ad propellerads-banner">PropellerAds Banner Ad (Replace with real code)</div>',
    interstitial: '<div class="dummy-ad propellerads-interstitial">PropellerAds Interstitial Ad (Replace with real code)</div>',
    native: '<div class="dummy-ad propellerads-native">PropellerAds Native Ad (Replace with real code)</div>',
    sticky: '<div class="dummy-ad propellerads-sticky">PropellerAds Sticky Ad (Replace with real code)</div>',
    video: '<div class="dummy-ad propellerads-video">PropellerAds Video Ad (Replace with real code)</div>',
    'pop-under': '<div class="dummy-ad propellerads-popunder">PropellerAds Pop-Under Ad (Replace with real code)</div>',
    'in-article': '<div class="dummy-ad propellerads-inarticle">PropellerAds In-Article Ad (Replace with real code)</div>',
  },
  admaven: {
    banner: '<div class="dummy-ad admaven-banner">AdMaven Banner Ad (Replace with real code)</div>',
    interstitial: '<div class="dummy-ad admaven-interstitial">AdMaven Interstitial Ad (Replace with real code)</div>',
    native: '<div class="dummy-ad admaven-native">AdMaven Native Ad (Replace with real code)</div>',
    sticky: '<div class="dummy-ad admaven-sticky">AdMaven Sticky Ad (Replace with real code)</div>',
    video: '<div class="dummy-ad admaven-video">AdMaven Video Ad (Replace with real code)</div>',
    'pop-under': '<div class="dummy-ad admaven-popunder">AdMaven Pop-Under Ad (Replace with real code)</div>',
    'in-article': '<div class="dummy-ad admaven-inarticle">AdMaven In-Article Ad (Replace with real code)</div>',
  },
  dummy: {
    banner: '<div class="dummy-ad dummy-banner">Dummy Banner Ad</div>',
    interstitial: '<div class="dummy-ad dummy-interstitial">Dummy Interstitial Ad</div>',
    native: '<div class="dummy-ad dummy-native">Dummy Native Ad</div>',
    sticky: '<div class="dummy-ad dummy-sticky">Dummy Sticky Ad</div>',
    video: '<div class="dummy-ad dummy-video">Dummy Video Ad</div>',
    'pop-under': '<div class="dummy-ad dummy-popunder">Dummy Pop-Under Ad</div>',
    'in-article': '<div class="dummy-ad dummy-inarticle">Dummy In-Article Ad</div>',
  },
};

/**
 * Simple hash function for consistent rotation based on quiz ID
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
 * Get realistic dummy ad HTML with images
 * These look like real ads but are placeholders
 */
function getRealisticDummyAd(position: AdPosition, surveyId?: string): string {
  const ads = {
    top: {
      image: 'https://via.placeholder.com/728x90/4A90E2/FFFFFF?text=Special+Offer+-+Save+50%25+Today',
      url: 'https://example.com/offer',
      title: 'Special Offer'
    },
    bottom: {
      image: 'https://via.placeholder.com/728x90/E74C3C/FFFFFF?text=Premium+Membership+-+Join+Now',
      url: 'https://example.com/premium',
      title: 'Premium Membership'
    },
    'sidebar-left': {
      image: 'https://via.placeholder.com/300x250/3498DB/FFFFFF?text=Best+Deals+Here',
      url: 'https://example.com/deals',
      title: 'Best Deals'
    },
    'sidebar-right': {
      image: 'https://via.placeholder.com/300x250/E67E22/FFFFFF?text=Shop+Now+Save+More',
      url: 'https://example.com/shop',
      title: 'Shop Now'
    },
    sidebar: {
      image: 'https://via.placeholder.com/300x250/1ABC9C/FFFFFF?text=Special+Promotion',
      url: 'https://example.com/promo',
      title: 'Special Promotion'
    },
    'between-questions': {
      image: 'https://via.placeholder.com/728x90/27AE60/FFFFFF?text=Win+Big+Prizes',
      url: 'https://example.com/prizes',
      title: 'Win Big Prizes'
    },
    'result-page': {
      image: 'https://via.placeholder.com/728x90/9B59B6/FFFFFF?text=Exclusive+Deal',
      url: 'https://example.com/deal',
      title: 'Exclusive Deal'
    },
    interstitial: {
      image: 'https://via.placeholder.com/728x400/9B59B6/FFFFFF?text=Interstitial+Ad+-+Full+Screen+Experience',
      url: 'https://example.com/interstitial',
      title: 'Interstitial Ad'
    }
  };

  const ad = ads[position] || ads.top;
  
  // Rotate based on quiz ID if provided
  const adVariants = [
    { image: 'https://via.placeholder.com/728x90/4A90E2/FFFFFF?text=Special+Offer', color: '4A90E2' },
    { image: 'https://via.placeholder.com/728x90/E74C3C/FFFFFF?text=Premium+Membership', color: 'E74C3C' },
    { image: 'https://via.placeholder.com/728x90/27AE60/FFFFFF?text=Win+Big+Prizes', color: '27AE60' },
    { image: 'https://via.placeholder.com/728x90/9B59B6/FFFFFF?text=Exclusive+Deal', color: '9B59B6' },
    { image: 'https://via.placeholder.com/728x90/F39C12/FFFFFF?text=New+Product+Launch', color: 'F39C12' }
  ];

  const sidebarVariants = [
    { image: 'https://via.placeholder.com/300x250/3498DB/FFFFFF?text=Best+Deals+Here', color: '3498DB' },
    { image: 'https://via.placeholder.com/300x250/E67E22/FFFFFF?text=Shop+Now+Save+More', color: 'E67E22' },
    { image: 'https://via.placeholder.com/300x250/1ABC9C/FFFFFF?text=Special+Promotion', color: '1ABC9C' },
    { image: 'https://via.placeholder.com/300x250/E74C3C/FFFFFF?text=Limited+Time+Offer', color: 'E74C3C' },
    { image: 'https://via.placeholder.com/300x250/9B59B6/FFFFFF?text=Premium+Access', color: '9B59B6' }
  ];

  const isSidebar = position.includes('sidebar');
  const isInterstitial = position === 'interstitial';
  
  let variants = isSidebar ? sidebarVariants : adVariants;
  if (isInterstitial) {
    variants = [
      { image: 'https://via.placeholder.com/728x400/9B59B6/FFFFFF?text=Interstitial+Ad+1', color: '9B59B6' },
      { image: 'https://via.placeholder.com/728x400/4A90E2/FFFFFF?text=Interstitial+Ad+2', color: '4A90E2' },
      { image: 'https://via.placeholder.com/728x400/E74C3C/FFFFFF?text=Interstitial+Ad+3', color: 'E74C3C' },
      { image: 'https://via.placeholder.com/728x400/27AE60/FFFFFF?text=Interstitial+Ad+4', color: '27AE60' },
    ];
  }
  
  let selectedAd = variants[0];
  if (surveyId) {
    const index = hashString(surveyId) % variants.length;
    selectedAd = variants[index];
  } else {
    selectedAd = variants[Math.floor(Math.random() * variants.length)];
  }

  const width = isInterstitial ? '728' : (isSidebar ? '300' : '728');
  const height = isInterstitial ? '400' : (isSidebar ? '250' : '90');

  return `
    <div class="ad-banner-container" style="width: 100%; max-width: ${width}px; margin: 0 auto;">
      <a href="${ad.url}" target="_blank" rel="noopener noreferrer sponsored" 
         style="display: block; text-decoration: none; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); transition: opacity 0.2s;"
         onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'"
         onclick="event.preventDefault(); console.log('Ad clicked'); return false;">
        <img src="${selectedAd.image}" 
             alt="${ad.title}" 
             style="width: 100%; height: ${height}px; object-fit: cover; display: block;"
             loading="lazy" />
        <div style="background: rgba(0,0,0,0.6); color: white; text-align: center; padding: 4px; font-size: 10px;">
          Ad
        </div>
      </a>
    </div>
  `;
}

/**
 * Get ad code for a specific position with quiz-based rotation
 * Different quizzes will show different ads for better monetization
 */
export async function getAdForPosition(
  position: AdPosition, 
  type?: AdType,
  surveyId?: string
): Promise<string | null> {
  // Lazy import to prevent client-side bundling
  const { getActiveAdConfigs } = await import('./db');
  const configs = await getActiveAdConfigs(type, position);
  
  if (configs.length === 0) {
    // Return realistic dummy ad with images if no configs found
    return getRealisticDummyAd(position, surveyId);
  }

  // Survey-based rotation: use surveyId to consistently select an ad network
  // This ensures the same survey always shows the same ad (better for tracking)
  let selectedConfig: typeof configs[0];
  
  if (surveyId && configs.length > 1) {
    // Use survey ID to hash and select a consistent ad network
    const index = hashString(surveyId) % configs.length;
    selectedConfig = configs[index];
  } else {
    // Fallback to highest priority ad
    selectedConfig = configs[0];
  }
  
  // If the config has a custom code, use it; otherwise use dummy
  if (selectedConfig.code && selectedConfig.code !== '') {
    return selectedConfig.code;
  }

  // Fallback to realistic dummy ad with images
  return getRealisticDummyAd(position, surveyId);
}

/**
 * Get all ads for a page layout with quiz-based rotation
 * Returns ads for different positions, rotated based on quiz ID
 */
export async function getPageAds(
  positions: AdPosition[], 
  surveyId?: string
): Promise<Record<AdPosition, string | null>> {
  const ads: Record<string, string | null> = {};
  
  for (const position of positions) {
    ads[position] = await getAdForPosition(position, undefined, surveyId);
  }
  
  return ads as Record<AdPosition, string | null>;
}

/**
 * Initialize default ad configs if none exist
 * This is a helper function to set up dummy ads
 */
export async function initializeDefaultAds(): Promise<void> {
  // Lazy import to prevent client-side bundling
  const { getActiveAdConfigs } = await import('./db');
  const existingConfigs = await getActiveAdConfigs();
  
  if (existingConfigs.length > 0) {
    return; // Already initialized
  }

  // This will be called from an API route or initialization script
  // For now, we'll create default configs when needed
}

