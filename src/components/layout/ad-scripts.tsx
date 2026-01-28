'use client';

import { useEffect } from 'react';
import Script from 'next/script';

/**
 * Ad Scripts Component
 * Loads all ad network scripts in the document head
 *
 * Configured Ad Networks:
 * 1. Autotag (aclib) - Zone ID: 0z4zktony9
 * 2. HighPerformanceFormat - Key: 063b0f69e6d6f3c70c71f435e4ae050c (300x250)
 * 3. HilltopAds - (Script to be provided)
 * 4-6. Additional ad networks (Scripts to be provided)
 * 
 * Removed:
 * - RichInfo (RichAds) - Removed per client request
 * - RollerAds - Disabled due to adult content
 */
export function AdScripts() {
  useEffect(() => {
    // Initialize aclib.runAutoTag after DOM is ready
    if (typeof window !== 'undefined' && (window as any).aclib) {
      try {
        (window as any).aclib.runAutoTag({
          zoneId: '0z4zktony9',
        });
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Autotag initialization error:', error);
        }
      }
    }

    // Silently monitor ad script loading (only log errors, not success)
    const checkAdScripts = () => {
      if (typeof window !== 'undefined') {
        // Check if ads are detected after scripts load
        setTimeout(() => {
          const finalCheck = document.querySelector(
            'ins.adsbygoogle, .ad-banner, [id*="ad-"], [class*="ad-"], iframe[src*="highperformanceformat"], iframe[src*="hilltopads"]'
          );
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
      {/* Ad Network 1: Autotag (aclib) - Zone ID: 0z4zktony9 */}
      {/* Autotag script - placed in body as recommended by ad network */}
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
          if (process.env.NODE_ENV === 'development') {
            console.warn('HighPerformanceFormat script failed to load');
          }
        }}
      />

      {/* Ad Network 3: HilltopAds - Script to be provided */}
      {/* TODO: Add HilltopAds script when provided by client */}
      {/* 
      <Script
        id="hilltopads-script"
        src="YOUR_HILLTOPADS_SCRIPT_URL"
        strategy="afterInteractive"
        async
      />
      */}

      {/* Ad Network 4: Additional Network - Script to be provided */}
      {/* TODO: Add script when provided by client */}
      {/* 
      <Script
        id="adnetwork4-script"
        src="YOUR_SCRIPT_URL"
        strategy="afterInteractive"
        async
      />
      */}

      {/* Ad Network 5: Additional Network - Script to be provided */}
      {/* TODO: Add script when provided by client */}
      {/* 
      <Script
        id="adnetwork5-script"
        src="YOUR_SCRIPT_URL"
        strategy="afterInteractive"
        async
      />
      */}

      {/* Ad Network 6: Additional Network - Script to be provided */}
      {/* TODO: Add script when provided by client */}
      {/* 
      <Script
        id="adnetwork6-script"
        src="YOUR_SCRIPT_URL"
        strategy="afterInteractive"
        async
      />
      */}
    </>
  );
}
