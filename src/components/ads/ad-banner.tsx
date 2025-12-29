'use client';

import { useMemo } from 'react';
import { AdPosition } from '@/types';

interface AdBannerProps {
  position: AdPosition;
  className?: string;
  surveyId?: string;
}

/**
 * Realistic dummy ad banners with images and URLs
 * These look like real ads but are placeholders for actual ad network codes
 */
// Professional dummy ads that look realistic
// These will be automatically replaced when real ad network codes are configured
const DUMMY_ADS = [
  {
    id: 1,
    image: 'https://via.placeholder.com/728x90/1E88E5/FFFFFF?text=🎯+Special+Offer+-+Save+Up+to+70%25+Today+Only',
    url: '#',
    title: 'Special Offer - Save Up to 70%',
    description: 'Limited Time Deal - Shop Now',
    network: 'adsterra'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/728x90/E91E63/FFFFFF?text=⭐+Premium+Membership+-+Join+Now+%26+Get+Exclusive+Benefits',
    url: '#',
    title: 'Premium Membership',
    description: 'Join Now & Get Exclusive Benefits',
    network: 'propellerads'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/728x90/43A047/FFFFFF?text=🏆+Win+Big+Prizes+-+Enter+Now+%26+Claim+Your+Reward',
    url: '#',
    title: 'Win Big Prizes',
    description: 'Enter Contest Now & Claim Your Reward',
    network: 'admaven'
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/728x90/7B1FA2/FFFFFF?text=💎+Exclusive+Deal+-+Shop+Now+%26+Save+Big',
    url: '#',
    title: 'Exclusive Deal',
    description: 'Shop Now & Save Big',
    network: 'adsterra'
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/728x90/FF6F00/FFFFFF?text=🚀+New+Product+Launch+-+Check+It+Out+Today',
    url: '#',
    title: 'New Product Launch',
    description: 'Check It Out Today',
    network: 'propellerads'
  },
  {
    id: 6,
    image: 'https://via.placeholder.com/728x90/00897B/FFFFFF?text=🎁+Flash+Sale+-+Limited+Stock+Available',
    url: '#',
    title: 'Flash Sale',
    description: 'Limited Stock Available',
    network: 'admaven'
  },
  {
    id: 7,
    image: 'https://via.placeholder.com/728x90/5E35B1/FFFFFF?text=💳+Best+Deals+of+the+Season+-+Shop+Now',
    url: '#',
    title: 'Best Deals of the Season',
    description: 'Shop Now & Save',
    network: 'adsterra'
  }
];

// Professional sidebar ads (300x250 format)
const SIDEBAR_ADS = [
  {
    id: 1,
    image: 'https://via.placeholder.com/300x250/1976D2/FFFFFF?text=🛍️+Best+Deals+Here%0A%0AShop+Now+%26+Save',
    url: '#',
    title: 'Best Deals',
    description: 'Shop Now & Save',
    network: 'adsterra'
  },
  {
    id: 2,
    image: 'https://via.placeholder.com/300x250/F57C00/FFFFFF?text=⚡+Shop+Now+Save+More%0A%0ALimited+Time+Offer',
    url: '#',
    title: 'Shop Now',
    description: 'Limited Time Offer',
    network: 'propellerads'
  },
  {
    id: 3,
    image: 'https://via.placeholder.com/300x250/00796B/FFFFFF?text=🎉+Special+Promotion%0A%0AExclusive+Deals',
    url: '#',
    title: 'Special Promotion',
    description: 'Exclusive Deals',
    network: 'admaven'
  },
  {
    id: 4,
    image: 'https://via.placeholder.com/300x250/C2185B/FFFFFF?text=⏰+Limited+Time+Offer%0A%0ADon%27t+Miss+Out',
    url: '#',
    title: 'Limited Offer',
    description: "Don't Miss Out",
    network: 'adsterra'
  },
  {
    id: 5,
    image: 'https://via.placeholder.com/300x250/6A1B9A/FFFFFF?text=💎+Premium+Access%0A%0AJoin+Now',
    url: '#',
    title: 'Premium Access',
    description: 'Join Now',
    network: 'propellerads'
  },
  {
    id: 6,
    image: 'https://via.placeholder.com/300x250/0277BD/FFFFFF?text=🔥+Hot+Deals%0A%0ACheck+Them+Out',
    url: '#',
    title: 'Hot Deals',
    description: 'Check Them Out',
    network: 'admaven'
  }
];

/**
 * Simple hash function for consistent ad selection
 */
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

/**
 * Get ad based on position and quiz ID for rotation
 */
function getAdForPosition(position: AdPosition, surveyId?: string) {
  // Interstitial ads use full-width banner format
  if (position === 'interstitial') {
    const index = surveyId ? hashString(surveyId) % DUMMY_ADS.length : 0;
    return DUMMY_ADS[index];
  }
  
  const ads = position === 'sidebar' || position === 'sidebar-left' || position === 'sidebar-right' 
    ? SIDEBAR_ADS 
    : DUMMY_ADS;
  
  if (surveyId) {
    const index = hashString(surveyId) % ads.length;
    return ads[index];
  }
  
  // Use first ad instead of random to avoid hydration mismatch
  return ads[0];
}

export function AdBanner({ position, className = '', surveyId }: AdBannerProps) {
  // Memoize ad selection to prevent flickering on re-renders
  const ad = useMemo(() => getAdForPosition(position, surveyId), [position, surveyId]);
  
  const isSidebar = position === 'sidebar' || position === 'sidebar-left' || position === 'sidebar-right';
  const isInterstitial = position === 'interstitial';
  const isResultPage = position === 'result-page';
  const isTopOrBottom = position === 'top' || position === 'bottom';
  
  // Mobile-optimized dimensions: 320x50 for mobile, 728x90 for desktop
  // For top/bottom ads, use responsive sizing
  const adWidth = isResultPage ? 300 : (isInterstitial ? 728 : (isSidebar ? 300 : (isTopOrBottom ? 728 : 728)));
  const adHeight = isResultPage ? 300 : (isInterstitial ? 400 : (isSidebar ? 250 : (isTopOrBottom ? 90 : 90)));
  
  // Mobile dimensions for top/bottom ads
  const mobileAdWidth = 320;
  const mobileAdHeight = 50;
  
  // Create stable key to prevent re-renders
  const adKey = useMemo(() => `${position}-${surveyId || 'default'}-${ad.id}`, [position, surveyId, ad.id]);
  
  // Determine container class based on position
  const containerClass = isResultPage 
    ? 'w-full h-full flex items-center justify-center' 
    : isSidebar 
      ? 'block' 
      : 'flex justify-center items-center w-full mx-auto';
  
  return (
    <div 
      key={adKey}
      className={`${containerClass} ${className}`} 
      style={{ 
        width: isResultPage ? '100%' : (isSidebar ? '300px' : '100%'), 
        height: isResultPage ? '100%' : 'auto',
        maxWidth: isResultPage ? '100%' : (isSidebar ? '300px' : (isTopOrBottom ? '100%' : '100%')),
        minHeight: isTopOrBottom ? `${mobileAdHeight}px` : `${adHeight}px`
      }}
    >
      <a
        href={ad.url}
        target="_blank"
        rel="noopener noreferrer sponsored"
        className={`${isSidebar ? 'block w-full' : 'flex justify-center items-center w-full'} hover:opacity-90 transition-opacity cursor-pointer`}
        onClick={(e) => {
          // For result-page ads, prevent default to allow parent click handler
          if (position === 'result-page') {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          e.preventDefault(); // Prevent navigation for dummy ads
          // In production, this will navigate to real ad URLs
          console.log('Ad clicked:', ad.title, '- This is a demo ad. Real ads will navigate when configured.');
        }}
      >
        <div 
          className={`relative bg-white border border-border rounded-lg overflow-hidden shadow-sm ${isResultPage ? 'w-full h-full' : (isSidebar ? 'w-full' : '')} ${isTopOrBottom ? 'w-full' : ''}`}
          style={{ 
            width: isResultPage ? '100%' : (isSidebar ? '100%' : (isTopOrBottom ? '100%' : `${adWidth}px`)), 
            height: isResultPage ? '100%' : (isTopOrBottom ? `${mobileAdHeight}px` : `${adHeight}px`),
            minWidth: isResultPage ? '100%' : (isSidebar ? '100%' : (isTopOrBottom ? `${mobileAdWidth}px` : `${adWidth}px`)),
            maxWidth: isResultPage ? '100%' : (isSidebar ? '300px' : (isTopOrBottom ? '728px' : `${adWidth}px`)),
            minHeight: isTopOrBottom ? `${mobileAdHeight}px` : `${adHeight}px`,
            background: `linear-gradient(135deg, ${getGradientColor(ad.id).from} 0%, ${getGradientColor(ad.id).to} 100%)`
          }}
        >
          {/* CSS-based ad content - no image loading issues */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-2 md:p-4 text-white">
            <div className="text-center">
              <div className={`mb-1 md:mb-2 ${isResultPage ? 'text-4xl' : (isSidebar ? 'text-xl' : (isTopOrBottom ? 'text-lg md:text-3xl' : 'text-3xl'))}`}>{getAdEmoji(ad.id)}</div>
              <div className={`font-bold mb-0.5 md:mb-1 ${isResultPage ? 'text-xl' : (isSidebar ? 'text-sm' : (isTopOrBottom ? 'text-xs md:text-lg' : 'text-lg'))}`}>{ad.title}</div>
              {ad.description && (
                <div className={`opacity-90 ${isResultPage ? 'text-base' : (isSidebar ? 'text-xs' : (isTopOrBottom ? 'text-[10px] md:text-sm' : 'text-sm'))}`}>{ad.description}</div>
              )}
            </div>
          </div>
          
          {/* Fallback image for better appearance - but won't cause flickering */}
          <img
            src={ad.image}
            alt={ad.title}
            width={adWidth}
            height={adHeight}
            className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
            loading="lazy"
            onLoad={(e) => {
              // Fade in image if it loads successfully
              const target = e.target as HTMLImageElement;
              target.style.opacity = '1';
              target.style.transition = 'opacity 0.3s ease';
            }}
            onError={() => {
              // Silently fail - CSS gradient will show instead
            }}
          />
          
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs px-2 py-1 text-center z-10">
            Ad
          </div>
        </div>
      </a>
    </div>
  );
}

// Helper function to get gradient colors based on ad ID
function getGradientColor(adId: number): { from: string; to: string } {
  const gradients: Record<number, { from: string; to: string }> = {
    1: { from: '#1E88E5', to: '#1565C0' }, // Blue
    2: { from: '#E91E63', to: '#C2185B' }, // Pink
    3: { from: '#43A047', to: '#2E7D32' }, // Green
    4: { from: '#7B1FA2', to: '#6A1B9A' }, // Purple
    5: { from: '#FF6F00', to: '#E65100' }, // Orange
    6: { from: '#00897B', to: '#00695C' }, // Teal
    7: { from: '#5E35B1', to: '#4527A0' }, // Deep Purple
    // Sidebar ads
    8: { from: '#1976D2', to: '#1565C0' }, // Sidebar Blue
    9: { from: '#F57C00', to: '#E65100' }, // Sidebar Orange
    10: { from: '#00796B', to: '#00695C' }, // Sidebar Teal
    11: { from: '#C2185B', to: '#AD1457' }, // Sidebar Pink
    12: { from: '#6A1B9A', to: '#4A148C' }, // Sidebar Purple
    13: { from: '#0277BD', to: '#01579B' }, // Sidebar Light Blue
  };
  return gradients[adId] || { from: '#667eea', to: '#764ba2' };
}

// Helper function to get emoji based on ad ID
function getAdEmoji(adId: number): string {
  const emojis: Record<number, string> = {
    1: '🎯',
    2: '⭐',
    3: '🏆',
    4: '💎',
    5: '🚀',
    6: '🎁',
    7: '💳',
    // Sidebar ads
    8: '🛍️',
    9: '⚡',
    10: '🎉',
    11: '⏰',
    12: '💎',
    13: '🔥',
  };
  return emojis[adId] || '📢';
}

