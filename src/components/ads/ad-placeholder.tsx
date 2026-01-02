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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch ad for this position from API
    const params = new URLSearchParams({ position });
    if (type) params.append('type', type);
    if (surveyId) params.append('surveyId', surveyId);
    
    fetch(`/api/ads?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (data.adCode) {
          setAdCode(data.adCode);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [position, type, surveyId]);

  // Show loading state briefly
  if (loading) {
    return <div className={`${className} min-h-[50px] md:min-h-[90px]`} />;
  }

  // Render real ad code from RollerAds
  if (adCode) {
    return (
      <div
        className={className}
        dangerouslySetInnerHTML={{ __html: adCode }}
      />
    );
  }

  // Fallback to AdBanner if no ad code
  return <AdBanner position={position} className={className} surveyId={surveyId} />;
}

