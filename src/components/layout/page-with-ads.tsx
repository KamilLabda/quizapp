'use client';

import { ReactNode } from 'react';
import { AdPlaceholder } from '@/components/ads/ad-placeholder';
import { AdcashBanner } from '@/components/ads/adcash-banner';

// ALL ADS DISABLED per client. Set to true to hide ad slots.
const ADS_DISABLED = true;

interface PageWithAdsProps {
  children: ReactNode;
  surveyId?: string;
  showSidebar?: boolean;
}

/**
 * Layout component that wraps content with ads.
 * Set ADS_DISABLED = false to re-enable ads.
 */
export function PageWithAds({ children, surveyId, showSidebar = true }: PageWithAdsProps) {
  return (
    <div className="w-full">
      {/* Top Ad - commented out when ADS_DISABLED */}
      {!ADS_DISABLED && (
        <div className="mb-6 md:mb-8 w-full flex justify-center">
          <div className="w-full max-w-[320px] md:max-w-[728px] lg:max-w-[970px]">
            <AdcashBanner zoneId="10939006" />
          </div>
        </div>
      )}

      <div className="flex gap-6 lg:gap-8 w-full items-start">
        {showSidebar && !ADS_DISABLED && (
          <aside className="hidden lg:flex w-[250px] xl:w-[300px] shrink-0 flex-col">
            <div
              className="space-y-6"
              style={{ position: 'sticky', top: '5rem', alignSelf: 'flex-start' }}
            >
              <AdcashBanner zoneId="10938998" />
              <AdPlaceholder position="sidebar-left" surveyId={surveyId ? `${surveyId}-2` : undefined} />
            </div>
          </aside>
        )}
        <div className="flex-1 min-w-0 w-full px-2 md:px-0">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
        {showSidebar && !ADS_DISABLED && (
          <aside className="hidden lg:flex w-[250px] xl:w-[300px] shrink-0 flex-col">
            <div
              className="space-y-6"
              style={{ position: 'sticky', top: '5rem', alignSelf: 'flex-start' }}
            >
              <AdcashBanner zoneId="10938998" />
              <AdPlaceholder position="sidebar-right" surveyId={surveyId ? `${surveyId}-3` : undefined} />
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Ad */}
      {!ADS_DISABLED && (
        <div className="mt-8 md:mt-12 w-full flex justify-center">
          <div className="w-full max-w-[320px] md:max-w-[728px] lg:max-w-[970px]">
            <AdcashBanner zoneId="10939006" />
          </div>
        </div>
      )}
    </div>
  );
}

