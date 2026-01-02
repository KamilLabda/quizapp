'use client';

import { useEffect } from 'react';
import Script from 'next/script';

/**
 * Ad Scripts Component
 * Loads all ad network scripts in the document head
 *
 * Configured Ad Networks:
 * 1. RollerAds (Site ID: 2261550) - Banner, PopUnder, InPagePush, Video Slider
 * 2. RichInfo (PubID: 997602, SiteID: 382124) - Push notifications
 */
export function AdScripts() {
  useEffect(() => {
    // Silently monitor ad script loading (only log errors, not success)
    const checkAdScripts = () => {
      if (typeof window !== 'undefined') {
        // Check if ads are detected after scripts load
        setTimeout(() => {
          const finalCheck = document.querySelector('ins.adsbygoogle, .ad-banner, [id*="ad-"], [class*="ad-"], iframe[src*="mushyyoung"], iframe[src*="affectionate-spray"]');
          if (!finalCheck) {
            // Only warn if ads are truly not detected (silent in production)
            if (process.env.NODE_ENV === 'development') {
              console.warn('⚠️ No ads detected. Check ad blocker or network approval status.');
            }
          }
        }, 3000);
      }
    };

    // Check after scripts should have loaded
    const timer = setTimeout(checkAdScripts, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {/* RichInfo Push Notifications - with error handling */}
      <Script
        type="module"
        src="https://richinfo.co/richpartners/push/js/rp-cl-ob.js?pubid=997602&siteid=382124&niche=33"
        strategy="afterInteractive"
        async
        data-cfasync="false"
        onError={(e) => {
          // Silently handle CORS errors in development (expected on localhost)
          // Only log in development mode
          if (process.env.NODE_ENV === 'development') {
            // CORS errors are normal in localhost, ignore them
            const isCorsError = e?.toString().includes('CORS') || e?.toString().includes('Access-Control');
            if (!isCorsError) {
              console.warn('RichInfo script failed to load (this is normal if push notifications are unavailable)');
            }
          }
        }}
      />
    </>
  );
}
