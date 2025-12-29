'use client';

import { useEffect, useState } from 'react';
import { AdPosition } from '@/types';
import { AdBanner } from './ad-banner';

interface AdPlaceholderProps {
  position: AdPosition;
  type?: string;
  className?: string;
  surveyId?: string; // Survey ID for dynamic ad rotation
}

export function AdPlaceholder({ position, type, className = '', surveyId }: AdPlaceholderProps) {
  const [adCode, setAdCode] = useState<string | null>(null);
  const [useRealAd, setUseRealAd] = useState(false);

  // Interstitial ads are handled by InterstitialAd component, not here
  if (position === 'interstitial') {
    return <AdBanner position={position} className={className} surveyId={surveyId} />;
  }

  // Show AdBanner immediately - don't wait for API call
  // This ensures ads are visible right away
  useEffect(() => {
    // Fetch ad for this position from API with survey-based rotation (for future real ads)
    const params = new URLSearchParams({ position });
    if (type) params.append('type', type);
    if (surveyId) params.append('surveyId', surveyId);
    
    fetch(`/api/ads?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        // Check if it's a real ad code (not dummy placeholder)
        // Real ad codes typically come from ad networks and don't contain these patterns
        const isDummyAd = !data.adCode || 
          data.adCode.includes('Dummy') || 
          data.adCode.includes('placeholder') || 
          data.adCode.includes('dummy-ad') ||
          data.adCode.includes('example.com') ||
          data.adCode.includes('via.placeholder.com');
        
        if (!isDummyAd && data.adCode) {
          setAdCode(data.adCode);
          setUseRealAd(true);
        }
      })
      .catch(() => {
        // Silently fail - we'll use AdBanner
      });
  }, [position, type, surveyId]);

  // Render real ad code only if we have a valid one from an ad network
  if (adCode && useRealAd) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: adCode }}
      />
    );
  }

  // Always show AdBanner for dummy ads (which is what we're using now)
  // Render immediately without waiting
  // Only wrap top/bottom ads in centering container (not sidebars or result-page)
  const isSidebar = position === 'sidebar' || position === 'sidebar-left' || position === 'sidebar-right';
  const isTopOrBottom = position === 'top' || position === 'bottom';
  
  if (isSidebar || position === 'result-page') {
    return <AdBanner position={position} className={className} surveyId={surveyId} />;
  }
  
  // For top/bottom ads, ensure they're centered
  if (isTopOrBottom) {
    return (
      <div className="flex justify-center items-center w-full mx-auto">
        <AdBanner position={position} className={className} surveyId={surveyId} />
      </div>
    );
  }
  
  return <AdBanner position={position} className={className} surveyId={surveyId} />;
}

