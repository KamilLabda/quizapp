"use client";

import Script from "next/script";

// ALL ADS DISABLED per client request. Set to false to re-enable.
const ADS_DISABLED = true;

/**
 * Ad Scripts Component
 * Monetag/Adcash banners, HPF, HilltopAds, Vignette, In-Page Push.
 * Set ADS_DISABLED = false above to re-enable.
 */
export function AdScripts() {
  if (ADS_DISABLED) return null;

  return (
    <>
      {/* Adcash / Monetag base library */}
      <Script
        id="monetag-aclib-lib"
        src="//acscdn.com/script/aclib.js"
        strategy="afterInteractive"
      />

      {/* Banner 468x60 via aclib.runBanner (zoneId: 10938954) */}
      <div
        id="monetag-banner-468x60"
        className="mx-auto my-4 flex justify-center"
        style={{ maxWidth: 468 }}
      >
        <Script
          id="monetag-banner-468x60-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window.aclib !== 'undefined' && typeof window.aclib.runBanner === 'function') {
                  try {
                    window.aclib.runBanner({ zoneId: '10938954' });
                  } catch (e) {
                    if (process.env.NODE_ENV === 'development') console.warn('Monetag banner runBanner error', e);
                  }
                }
              })();
            `,
          }}
        />
      </div>

      {/* Banner 120x600 via aclib.runBanner (zoneId: 10938998) */}
      <div
        id="monetag-banner-120x600"
        className="mx-auto my-4 flex justify-center"
        style={{ maxWidth: 120 }}
      >
        <Script
          id="monetag-banner-120x600-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window.aclib !== 'undefined' && typeof window.aclib.runBanner === 'function') {
                  try {
                    window.aclib.runBanner({ zoneId: '10938998' });
                  } catch (e) {
                    if (process.env.NODE_ENV === 'development') console.warn('Monetag 120x600 runBanner error', e);
                  }
                }
              })();
            `,
          }}
        />
      </div>

      {/* Banner 300x100 via aclib.runBanner (zoneId: 10939006) */}
      <div
        id="monetag-banner-300x100"
        className="mx-auto my-4 flex justify-center"
        style={{ maxWidth: 300 }}
      >
        <Script
          id="monetag-banner-300x100-script"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                if (typeof window.aclib !== 'undefined' && typeof window.aclib.runBanner === 'function') {
                  try {
                    window.aclib.runBanner({ zoneId: '10939006' });
                  } catch (e) {
                    if (process.env.NODE_ENV === 'development') console.warn('Monetag 300x100 runBanner error', e);
                  }
                }
              })();
            `,
          }}
        />
      </div>

      {/* HighPerformanceFormat - DISABLED (causes redirects) */}
      {/* <Script id="monetag-hpf-config-468x60" ... />
      <Script id="monetag-hpf-script-468x60" src="https://www.highperformanceformat.com/921c1bfca27bfcfd1521826fee444d71/invoke.js" ... />
      <Script id="monetag-hpf-config-320x50" ... />
      <Script id="monetag-hpf-script-320x50" src="https://www.highperformanceformat.com/b0b3a451dfc82c360aeeac84fb6be390/invoke.js" ... /> */}

      {/* HilltopAds - DISABLED (adult content) */}
      {/* <Script id="hilltopads-300x250" ... /> */}

      {/* Native Vignette (zone: 10556993) */}
      <Script
        id="monetag-vignette-10556993"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='10556993';s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
        }}
      />

      {/* Native In‑Page Push (zone: 10556997) */}
      <Script
        id="monetag-inpage-10556997"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='10556997';s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`,
        }}
      />
    </>
  );
}
