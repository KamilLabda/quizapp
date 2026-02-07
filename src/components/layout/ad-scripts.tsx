"use client";

import Script from "next/script";

/**
 * Ad Scripts Component
 *
 * Only two things are commented out:
 * 1. REDIRECTION: HighPerformanceFormat (highperformanceformat.com) — causes page redirects.
 * 2. ADULT: HilltopAds (hopeful-literature.com) — has served adult ads.
 *
 * All banner ads below are ACTIVE: aclib banners (468x60, 120x600, 300x100) and native (Vignette, In‑Page Push).
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

      {/* ─── HighPerformanceFormat: DISABLED — causes page redirections ─────────
          HPF invoke.js (468x60, 320x50, Adsterra slots) is the confirmed redirect
          source. Re-enable only after provider confirms fix.
      <Script id="monetag-hpf-config-468x60" ... />
      <Script id="monetag-hpf-script-468x60" src="https://www.highperformanceformat.com/.../invoke.js" ... />
      <Script id="monetag-hpf-config-320x50" ... />
      <Script id="monetag-hpf-script-320x50" src="https://www.highperformanceformat.com/.../invoke.js" ... />
      ─── End HPF (do not re-enable without testing) ─── */}

      {/* HilltopAds 300x250 — DISABLED: serves adult ads (hopeful-literature.com). Do not re-enable. */}
      {/* <Script
        id="hilltopads-300x250"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
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
          `,
        }}
      /> */}

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
