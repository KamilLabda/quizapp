"use client";

import { useEffect, useRef } from "react";

interface AdcashBannerProps {
  zoneId: string;
  className?: string;
}

/**
 * Adcash Banner Component
 * Renders Adcash ad banners using the aclib.runBanner function
 *
 * Available Zone IDs:
 * - 10857798: Banner 160x600
 * - 10857890: Banner 728x90
 *
 * Usage:
 * <AdcashBanner zoneId="10857798" />
 */
export function AdcashBanner({ zoneId, className = "" }: AdcashBannerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Prevent double initialization in development mode
    if (hasInitialized.current) return;

    const initializeAd = () => {
      if (typeof window !== "undefined" && (window as any).aclib) {
        try {
          (window as any).aclib.runBanner({
            zoneId: zoneId,
          });
          hasInitialized.current = true;
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.warn(
              `Adcash banner initialization error for zone ${zoneId}:`,
              error,
            );
          }
        }
      } else {
        // Retry if aclib is not loaded yet
        setTimeout(initializeAd, 500);
      }
    };

    // Wait for aclib to be available
    const timer = setTimeout(initializeAd, 100);

    return () => {
      clearTimeout(timer);
    };
  }, [zoneId]);

  return (
    <div
      ref={containerRef}
      className={`adcash-banner-container ${className}`}
      data-zone-id={zoneId}
    >
      <script
        type="text/javascript"
        dangerouslySetInnerHTML={{
          __html: `
            if (typeof window !== 'undefined' && typeof window.aclib !== 'undefined') {
              try {
                window.aclib.runBanner({
                  zoneId: '${zoneId}',
                });
              } catch (e) {
                // Silently handle errors
              }
            }
          `,
        }}
      />
    </div>
  );
}
