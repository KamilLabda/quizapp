"use client";

import { useEffect } from "react";
import Script from "next/script";

/**
 * Ad Scripts Component
 * Loads all ad network scripts in the document head
 *
 * Configured Ad Networks:
 * 1. Autotag (aclib) - Zone ID: 0z4zktony9
 * 2. HighPerformanceFormat - Key: 063b0f69e6d6f3c70c71f435e4ae050c (300x250)
 * 3. Hilltopsads - Dynamic script loader
 * 4. Adcash - Library + Banners (Zones: 10857798, 10857890)
 * 5. Adsterra - Multiple banner formats (160x600, 728x90, 300x250)
 *
 * Removed:
 * - RichInfo (RichAds) - Removed per client request
 * - RollerAds - Disabled due to adult content
 */
export function AdScripts() {
  useEffect(() => {
    // Initialize aclib.runAutoTag after DOM is ready
    if (typeof window !== "undefined" && (window as any).aclib) {
      try {
        (window as any).aclib.runAutoTag({
          zoneId: "0z4zktony9",
        });
      } catch (error) {
        if (process.env.NODE_ENV === "development") {
          console.warn("Autotag initialization error:", error);
        }
      }
    }

    // Silently monitor ad script loading (only log errors, not success)
    const checkAdScripts = () => {
      if (typeof window !== "undefined") {
        // Check if ads are detected after scripts load
        setTimeout(() => {
          const finalCheck = document.querySelector(
            'ins.adsbygoogle, .ad-banner, [id*="ad-"], [class*="ad-"], iframe[src*="highperformanceformat"], iframe[src*="hilltopads"], iframe[src*="acscdn"], iframe[src*="adsterra"]',
          );
          if (!finalCheck) {
            // Only warn if ads are truly not detected (silent in production)
            if (process.env.NODE_ENV === "development") {
              console.warn(
                "⚠️ No ads detected. Check ad blocker or network approval status.",
              );
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
      {/* ========================================
          EXISTING AD NETWORKS
      ======================================== */}

      {/* Ad Network 1: Autotag (aclib) - Zone ID: 0z4zktony9 */}
      <Script
        id="aclib-autotag"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function() {
              if (typeof window.aclib === 'undefined') {
                window.aclib = {};
              }
              if (typeof window.aclib.runAutoTag === 'undefined') {
                window.aclib.runAutoTag = function(options) {
                  if (options && options.zoneId) {
                    // Autotag will automatically place ads based on zoneId
                    // The ad network's base script should handle the actual ad placement
                  }
                };
              }
              // Initialize autotag
              try {
                window.aclib.runAutoTag({
                  zoneId: '0z4zktony9',
                });
              } catch (e) {
                // Silently handle errors
              }
            })();
          `,
        }}
      />

      {/* Ad Network 2: HighPerformanceFormat - 300x250 Banner */}
      <Script
        id="highperformanceformat-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var atOptions = {
              'key' : '063b0f69e6d6f3c70c71f435e4ae050c',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          `,
        }}
      />
      <Script
        id="highperformanceformat-script"
        src="https://www.highperformanceformat.com/063b0f69e6d6f3c70c71f435e4ae050c/invoke.js"
        strategy="afterInteractive"
        async
        onError={(e) => {
          if (process.env.NODE_ENV === "development") {
            console.warn("HighPerformanceFormat script failed to load");
          }
        }}
      />

      {/* ========================================
          NEW AD NETWORKS - CLIENT REQUEST
      ======================================== */}

      {/* Ad Network 3: Hilltopsads - DISABLED DUE TO ADULT CONTENT */}
      {/* DISABLED: This network was showing inappropriate adult advertisements
          Domain: hopeful-literature.com
          Disabled on: 2026-02-02
      */}
      {/*
      <Script
        id="hilltopsads-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            (function(wgkb){
              var d = document,
                  s = d.createElement('script'),
                  l = d.scripts[d.scripts.length - 1];
              s.settings = wgkb || {};
              s.src = "//hopeful-literature.com/bfX/V.swdiGUly0RYKW-cV/_e-m/9/uqZ/UNlikfPaTQY/3EMWzvkk1BO/TKc/tpNLjHc/zdOvTCUK5/OcAO";
              s.async = true;
              s.referrerPolicy = 'no-referrer-when-downgrade';
              l.parentNode.insertBefore(s, l);
            })({})
          `,
        }}
        onError={(e) => {
          if (process.env.NODE_ENV === "development") {
            console.warn("Hilltopsads script failed to load");
          }
        }}
      />
      */}

      {/* Ad Network 4: Adcash - Library Script (Load Once) */}
      <Script
        id="aclib"
        type="text/javascript"
        src="//acscdn.com/script/aclib.js"
        strategy="afterInteractive"
        onError={(e) => {
          if (process.env.NODE_ENV === "development") {
            console.warn("Adcash library failed to load");
          }
        }}
      />

      {/* Ad Network 5: Adsterra - Banner 160x600 (IFRAME SYNC) */}
      <Script
        id="adsterra-160x600-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var atOptions_160x600 = {
              'key' : '9b025dee52a2b0c32481b868d751d1dd',
              'format' : 'iframe',
              'height' : 600,
              'width' : 160,
              'params' : {}
            };
          `,
        }}
      />
      <Script
        id="adsterra-160x600-script"
        src="https://www.highperformanceformat.com/9b025dee52a2b0c32481b868d751d1dd/invoke.js"
        strategy="afterInteractive"
        async
        onError={(e) => {
          if (process.env.NODE_ENV === "development") {
            console.warn("Adsterra 160x600 script failed to load");
          }
        }}
      />

      {/* Ad Network 6: Adsterra - Banner 728x90 (IFRAME SYNC - Head/Foot) */}
      <Script
        id="adsterra-728x90-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var atOptions_728x90 = {
              'key' : 'b3c66cf41e55995ac85aa5b2934d3e75',
              'format' : 'iframe',
              'height' : 90,
              'width' : 728,
              'params' : {}
            };
          `,
        }}
      />
      <Script
        id="adsterra-728x90-script"
        src="https://www.highperformanceformat.com/b3c66cf41e55995ac85aa5b2934d3e75/invoke.js"
        strategy="afterInteractive"
        async
        onError={(e) => {
          if (process.env.NODE_ENV === "development") {
            console.warn("Adsterra 728x90 script failed to load");
          }
        }}
      />

      {/* Ad Network 7: Adsterra - Banner 300x250 (IFRAME SYNC) */}
      <Script
        id="adsterra-300x250-config"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            var atOptions_300x250 = {
              'key' : '863b0f69e6d6f3c70c71f435e4ae050c',
              'format' : 'iframe',
              'height' : 250,
              'width' : 300,
              'params' : {}
            };
          `,
        }}
      />
      <Script
        id="adsterra-300x250-script"
        src="https://www.highperformanceformat.com/863b0f69e6d6f3c70c71f435e4ae050c/invoke.js"
        strategy="afterInteractive"
        async
        onError={(e) => {
          if (process.env.NODE_ENV === "development") {
            console.warn("Adsterra 300x250 script failed to load");
          }
        }}
      />
    </>
  );
}
