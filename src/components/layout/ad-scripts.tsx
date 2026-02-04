"use client";

import Script from "next/script";

/**
 * Ad Scripts Component
 * Loads all Monetag / Adcash banner and native ad scripts.
 *
 * Configured formats (from client):
 * - Banner 468x60  (zoneId: 10938954) via aclib.runBanner
 * - Banner 120x600 (zoneId: 10938998) via aclib.runBanner
 * - Banner 300x100 (zoneId: 10939006) via aclib.runBanner
 * - Banner 468x60  (key: 921c1bfca27bfcfd1521826fee444d71) via highperformanceformat.com
 * - Banner 320x50  (key: b0b3a451dfc82c360aeeac84fb6be390) via highperformanceformat.com
 * - Native Vignette (zone: 10556993)
 * - Native In‑Page Push (zone: 10556997)
 *
 * HilltopAds: The 300x250 script is disabled and lives in the commented-out
 * block below in this file (search for "HilltopAds" or "hopeful-literature").
 * Reason: domain "hopeful-literature.com" previously served adult content.
 */
export function AdScripts() {
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
                    if (process.env.NODE_ENV === 'development') {
                      console.warn('Monetag banner runBanner error', e);
                    }
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
                    if (process.env.NODE_ENV === 'development') {
                      console.warn('Monetag 120x600 runBanner error', e);
                    }
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
                    if (process.env.NODE_ENV === 'development') {
                      console.warn('Monetag 300x100 runBanner error', e);
                    }
                  }
                }
              })();
            `,
          }}
        />
      </div>

      {/* Banner 468x60 via highperformanceformat.com (key: 921c1bfca27bfcfd1521826fee444d71) */}
      <Script
        id="monetag-hpf-config-468x60"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var atOptions = {
              'key' : '921c1bfca27bfcfd1521826fee444d71',
              'format' : 'iframe',
              'height' : 60,
              'width' : 468,
              'params' : {}
            };
          `,
        }}
      />
      <Script
        id="monetag-hpf-script-468x60"
        src="https://www.highperformanceformat.com/921c1bfca27bfcfd1521826fee444d71/invoke.js"
        strategy="afterInteractive"
        async
      />

      {/* Banner 320x50 via highperformanceformat.com (key: b0b3a451dfc82c360aeeac84fb6be390) */}
      <Script
        id="monetag-hpf-config-320x50"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var atOptions = {
              'key' : 'b0b3a451dfc82c360aeeac84fb6be390',
              'format' : 'iframe',
              'height' : 50,
              'width' : 320,
              'params' : {}
            };
          `,
        }}
      />
      <Script
        id="monetag-hpf-script-320x50"
        src="https://www.highperformanceformat.com/b0b3a451dfc82c360aeeac84fb6be390/invoke.js"
        strategy="afterInteractive"
        async
      />

      {/* HilltopAds 300x250 (zone #6764201) - DISABLED due to adult / unsafe content risk
      
      <Script
        id="hilltopads-300x250"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: \`
            (function(pjcgm){
              var d = document,
                  s = d.createElement('script'),
                  l = d.scripts[d.scripts.length - 1];
              s.settings = pjcgm || {};
              s.src = "//hopeful-literature.com/bIXeV.spdSG_lw0aYKW/cB/KeBmo9/u/ZkUflVk/PRTYYV3iN/j/Q/y/MvDSEJt/NGjCcP2fNGDpIpwON/Qp";
              s.async = true;
              s.referrerPolicy = 'no-referrer-when-downgrade';
              l.parentNode.insertBefore(s, l);
            })({})
          \`,
        }}
      />
      */}

      {/* Native Vignette (zone: 10556993) */}
      <Script
        id="monetag-vignette-10556993"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='10556993';s.src='https://gizokraijaw.net/vignette.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`, // from client
        }}
      />

      {/* Native In‑Page Push (zone: 10556997) */}
      <Script
        id="monetag-inpage-10556997"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `(function(s){s.dataset.zone='10556997';s.src='https://nap5k.com/tag.min.js'})([document.documentElement, document.body].filter(Boolean).pop().appendChild(document.createElement('script')))`, // from client
        }}
      />
    </>
  );
}
