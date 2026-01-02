'use client';

import { AdPosition } from '@/types';

interface AdPlaceholderProps {
  position: AdPosition;
  type?: string;
  className?: string;
  surveyId?: string;
}

/**
 * Ad Placeholder Component
 * RollerAds scripts are loaded globally in layout.tsx
 * This component provides containers for ads to be injected
 */
export function AdPlaceholder({ position, className = '' }: AdPlaceholderProps) {
  const isSidebar = position === 'sidebar' || position === 'sidebar-left' || position === 'sidebar-right';
  const isInterstitial = position === 'interstitial';
  const isTopOrBottom = position === 'top' || position === 'bottom';

  // Determine container dimensions based on position
  const containerStyle: React.CSSProperties = {
    minHeight: isInterstitial ? '400px' : isSidebar ? '250px' : '90px',
    width: '100%',
  };

  // Create unique ID for this ad position
  const adId = `rollerads-${position}`;

  return (
    <div
      id={adId}
      className={className}
      style={containerStyle}
      data-ad-position={position}
      data-rollerads="true"
    />
  );
}

