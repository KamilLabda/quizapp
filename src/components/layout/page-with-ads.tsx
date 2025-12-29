'use client';

import { ReactNode } from 'react';
import { AdPlaceholder } from '@/components/ads/ad-placeholder';

interface PageWithAdsProps {
  children: ReactNode;
  surveyId?: string;
  showSidebar?: boolean;
}

/**
 * Layout component that wraps content with ads on all sides
 * Professional layout with sidebar ads that don't interfere with UX
 */
export function PageWithAds({ children, surveyId, showSidebar = true }: PageWithAdsProps) {
  return (
    <div className="w-full">
      {/* Top Ad - Mobile optimized banner (320x50) on mobile, full banner (728x90) on tablet+ */}
      <div className="mb-3 md:mb-4 md:mb-6 w-full flex justify-center items-center">
        <div className="w-full max-w-[320px] md:max-w-[728px] flex justify-center items-center mx-auto" style={{ minHeight: '50px' }}>
          <AdPlaceholder position="top" surveyId={surveyId} />
        </div>
      </div>

      <div className="flex gap-4 md:gap-6 items-start w-full">
        {/* Left Sidebar Ad - Only on large desktop screens (xl+) */}
        {showSidebar && (
          <aside className="hidden xl:block w-[300px] shrink-0 sticky top-20">
            <div className="space-y-4">
              <AdPlaceholder position="sidebar-left" surveyId={surveyId} />
              {/* Second sidebar ad below */}
              <AdPlaceholder position="sidebar-left" surveyId={surveyId ? `${surveyId}-2` : undefined} />
            </div>
          </aside>
        )}

        {/* Main Content */}
        <div className="flex-1 min-w-0 w-full">
          {children}
        </div>

        {/* Right Sidebar Ad - Only on large desktop screens (xl+) */}
        {showSidebar && (
          <aside className="hidden xl:block w-[300px] shrink-0 sticky top-20">
            <div className="space-y-4">
              <AdPlaceholder position="sidebar-right" surveyId={surveyId} />
              {/* Second sidebar ad below */}
              <AdPlaceholder position="sidebar-right" surveyId={surveyId ? `${surveyId}-3` : undefined} />
            </div>
          </aside>
        )}
      </div>

      {/* Bottom Ad - Mobile optimized banner (320x50) on mobile, full banner (728x90) on tablet+ */}
      <div className="mt-3 md:mt-4 md:mt-6 w-full flex justify-center items-center">
        <div className="w-full max-w-[320px] md:max-w-[728px] flex justify-center items-center mx-auto" style={{ minHeight: '50px' }}>
          <AdPlaceholder position="bottom" surveyId={surveyId} />
        </div>
      </div>
    </div>
  );
}

