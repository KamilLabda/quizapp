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
  return (
    <>
      {/* RichInfo Push Notifications */}
      <Script
        type="module"
        src="https://richinfo.co/richpartners/push/js/rp-cl-ob.js?pubid=997602&siteid=382124&niche=33"
        strategy="afterInteractive"
        async
        data-cfasync="false"
      />
    </>
  );
}
