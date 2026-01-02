/**
 * Ad system with rotation
 * Currently uses dummy placeholders - easy to replace with real ad networks
 */

import { AdConfig, AdNetwork, AdType, AdPosition } from '@/types';

/**
 * RollerAds - Real ad codes from client (Site ID: 2261550)
 */
const ROLLERADS_CODES: Record<AdType, string> = {
  banner: '<script>(function(ax){var d = document,s = d.createElement(\'script\'),l = d.scripts[d.scripts.length - 1];s.settings = ax || {};s.src = "//mushyyoung.com/bHXBVhs.d/GElf0_YRWVcv/-eAmk9FuSZlUKlMkePaTcY/3cMwz/ki1OOITnc/tAN_jhcZzUO/TkUJ5vOmAI";s.async = true;s.referrerPolicy = \'no-referrer-when-downgrade\';l.parentNode.insertBefore(s, l);})({})</script>',
  'pop-under': '<script>(function(ppjmpsp){var d = document,s = d.createElement(\'script\'),l = d.scripts[d.scripts.length - 1];s.settings = ppjmpsp || {};s.src = "//affectionate-spray.com/c.D/9K6Ybk2/5yl/SkWfQx9ANRjVcqzKODTKYpw/Mdyl0/2/Ngz/M/5mNMjWAM0V";s.async = true;s.referrerPolicy = \'no-referrer-when-downgrade\';l.parentNode.insertBefore(s, l);})({})</script>',
  'in-article': '<script>(function(vbl){var d = document,s = d.createElement(\'script\'),l = d.scripts[d.scripts.length - 1];s.settings = vbl || {};s.src = "//mushyyoung.com/b.XuVpsmdkGRle0dYiWKcI/qebmP9JuzZcUdlpkVPyTzYJ3PMbzhkZ2RMeDbU/tNNHjRcIzWOAT/Y/wENfg_";s.async = true;s.referrerPolicy = \'no-referrer-when-downgrade\';l.parentNode.insertBefore(s, l);})({})</script>',
  video: '<script>(function(aljd){var d = document,s = d.createElement(\'script\'),l = d.scripts[d.scripts.length - 1];s.settings = aljd || {};s.src = "//mushyyoung.com/baXkV.sPdtGVll0OYhWgcX/reZmr9/uIZ/Uzlmk/PwTQY/3jMQz/kR2AMBTREEtLN/j/czz/OvTQY/xXM/gG";s.async = true;s.referrerPolicy = \'no-referrer-when-downgrade\';l.parentNode.insertBefore(s, l);})({})</script>',
  interstitial: '<script>(function(ax){var d = document,s = d.createElement(\'script\'),l = d.scripts[d.scripts.length - 1];s.settings = ax || {};s.src = "//mushyyoung.com/bHXBVhs.d/GElf0_YRWVcv/-eAmk9FuSZlUKlMkePaTcY/3cMwz/ki1OOITnc/tAN_jhcZzUO/TkUJ5vOmAI";s.async = true;s.referrerPolicy = \'no-referrer-when-downgrade\';l.parentNode.insertBefore(s, l);})({})</script>',
  native: '<script>(function(vbl){var d = document,s = d.createElement(\'script\'),l = d.scripts[d.scripts.length - 1];s.settings = vbl || {};s.src = "//mushyyoung.com/b.XuVpsmdkGRle0dYiWKcI/qebmP9JuzZcUdlpkVPyTzYJ3PMbzhkZ2RMeDbU/tNNHjRcIzWOAT/Y/wENfg_";s.async = true;s.referrerPolicy = \'no-referrer-when-downgrade\';l.parentNode.insertBefore(s, l);})({})</script>',
  sticky: '<script>(function(ax){var d = document,s = d.createElement(\'script\'),l = d.scripts[d.scripts.length - 1];s.settings = ax || {};s.src = "//mushyyoung.com/bHXBVhs.d/GElf0_YRWVcv/-eAmk9FuSZlUKlMkePaTcY/3cMwz/ki1OOITnc/tAN_jhcZzUO/TkUJ5vOmAI";s.async = true;s.referrerPolicy = \'no-referrer-when-downgrade\';l.parentNode.insertBefore(s, l);})({})</script>',
};

/**
 * Real ad codes - RollerAds integration
 */
const REAL_AD_CODES: Record<AdNetwork, Partial<Record<AdType, string>>> = {
  rollerads: ROLLERADS_CODES,
  adsterra: {},
  propellerads: {},
  admaven: {},
  dummy: {},
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
 * Get RollerAds code based on position
 */
function getRollerAdsCode(position: AdPosition): string | null {
  // Map positions to ad types
  const positionToType: Record<AdPosition, AdType> = {
    'top': 'banner',
    'bottom': 'banner',
    'sidebar': 'banner',
    'sidebar-left': 'banner',
    'sidebar-right': 'banner',
    'between-questions': 'in-article',
    'result-page': 'banner',
    'interstitial': 'interstitial',
  };

  const adType = positionToType[position];
  return ROLLERADS_CODES[adType] || ROLLERADS_CODES.banner;
}

/**
 * Get realistic dummy ad HTML with images (fallback only)
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
 * Now using real RollerAds codes
 */
export async function getAdForPosition(
  position: AdPosition, 
  type?: AdType,
  surveyId?: string
): Promise<string | null> {
  // Return RollerAds code for all positions
  return getRollerAdsCode(position);
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

