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
 * 
 * CURRENTLY DISABLED: RollerAds scripts are disabled due to adult content.
 * This component returns null until family-safe ads are configured.
 * 
 * To re-enable: See ADULT_ADS_NOTICE.md for instructions.
 */
export function AdPlaceholder({ position, className = '' }: AdPlaceholderProps) {
  // Ads are currently disabled - return nothing
  // Uncomment the code below when family-safe ads are configured
  return null;

  /*
  const isSidebar = position === 'sidebar' || position === 'sidebar-left' || position === 'sidebar-right';
  const isInterstitial = position === 'interstitial';

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
  */
}
