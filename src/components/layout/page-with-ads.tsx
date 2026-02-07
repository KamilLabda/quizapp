'use client';

import { ReactNode } from 'react';
import { AdPlaceholder } from '@/components/ads/ad-placeholder';
import { AdcashBanner } from '@/components/ads/adcash-banner';

interface PageWithAdsProps {
  children: ReactNode;
  surveyId?: string;
  showSidebar?: boolean;
}

/**
 * Layout component that wraps content with ads on all sides
 * Professional layout with sidebar ads that don't interfere with UX
 * Improved spacing and responsive design for better ad placement
 */
export function PageWithAds({ children, surveyId, showSidebar = true }: PageWithAdsProps) {
  return (
    <div className="w-full">
      {/* Top Ad - Centered with proper spacing */}
      <div className="mb-6 md:mb-8 w-full flex justify-center">
        <div className="w-full max-w-[320px] md:max-w-[728px] lg:max-w-[970px]">
          <AdcashBanner zoneId="10939006" />
        </div>
      </div>

      <div className="flex gap-6 lg:gap-8 w-full items-start">
        {/* Left Sidebar Ad - Proper sticky positioning */}
        {showSidebar && (
          <aside className="hidden lg:flex w-[250px] xl:w-[300px] shrink-0 flex-col">
            <div 
              className="space-y-6"
              style={{ 
                position: 'sticky',
                top: '5rem',
                alignSelf: 'flex-start'
              }}
            >
              <AdcashBanner zoneId="10938998" />
              <AdPlaceholder position="sidebar-left" surveyId={surveyId ? `${surveyId}-2` : undefined} />
            </div>
          </aside>
        )}

        {/* Main Content - Better spacing */}
        <div className="flex-1 min-w-0 w-full px-2 md:px-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>

        {/* Right Sidebar Ad - Proper sticky positioning */}
        {showSidebar && (
          <aside className="hidden lg:flex w-[250px] xl:w-[300px] shrink-0 flex-col">
            <div 
              className="space-y-6"
              style={{ 
                position: 'sticky',
                top: '5rem',
                alignSelf: 'flex-start'
              }}
            >
              <AdcashBanner zoneId="10938998" />
              <AdPlaceholder position="sidebar-right" surveyId={surveyId ? `${surveyId}-3` : undefined} />
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Ad — HPF disabled to prevent redirects; use Adcash or placeholder if needed */}
      <div className="mt-8 md:mt-12 w-full flex justify-center">
        <div className="w-full max-w-[320px] md:max-w-[728px] lg:max-w-[970px]">
          <AdcashBanner zoneId="10939006" />
        </div>
      </div>
    </div>
  );
}

