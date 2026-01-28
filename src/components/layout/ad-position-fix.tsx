'use client';

import { useEffect } from 'react';

/**
 * Ad Position Fix Component
 * Converts fixed-position ads at the bottom to sticky positioning
 * This ensures ads scroll with content and don't overlap the footer
 */
export function AdPositionFix() {
  useEffect(() => {
    const fixAdPositions = () => {
      // Find ALL elements (more aggressive approach)
      const allElements = document.querySelectorAll('*:not([data-ad-fixed]):not(script):not(style):not(noscript)');
      
      allElements.forEach((element) => {
        const htmlElement = element as HTMLElement;
        if (!htmlElement || htmlElement.offsetWidth === 0 && htmlElement.offsetHeight === 0) {
          return; // Skip hidden elements
        }
        
        // Skip elements that should remain fixed (modals, dialogs, etc.)
        const isModal = htmlElement.hasAttribute('role') && htmlElement.getAttribute('role') === 'dialog' ||
                       htmlElement.hasAttribute('data-state') ||
                       htmlElement.classList.contains('modal') ||
                       htmlElement.classList.contains('dialog') ||
                       htmlElement.closest('[role="dialog"]') ||
                       htmlElement.closest('[data-state="open"]');
        
        if (isModal) {
          return;
        }
        
        const computedStyle = window.getComputedStyle(htmlElement);
        const inlineStyle = htmlElement.getAttribute('style') || '';
        
        // Check if element is fixed
        const isFixed = computedStyle.position === 'fixed' || 
                       inlineStyle.toLowerCase().includes('position:fixed') ||
                       inlineStyle.toLowerCase().includes('position: fixed');
        
        if (!isFixed) {
          return;
        }
        
        // Check if it's at the bottom
        const bottomValue = computedStyle.bottom;
        const hasBottom = bottomValue !== 'auto' && bottomValue !== '' ||
                         inlineStyle.toLowerCase().includes('bottom:') ||
                         parseFloat(bottomValue) >= 0;
        
        // Check if it's likely an ad
        const isLikelyAd = 
          htmlElement.tagName === 'IFRAME' ||
          htmlElement.id?.toLowerCase().includes('ad') ||
          htmlElement.className?.toLowerCase().includes('ad') ||
          htmlElement.getAttribute('src')?.includes('highperformanceformat') ||
          htmlElement.getAttribute('src')?.includes('hilltopads') ||
          (htmlElement.offsetWidth >= 200 && htmlElement.offsetHeight >= 100 && hasBottom);
        
        if (isFixed && hasBottom && isLikelyAd) {
          // Force convert to sticky using direct style manipulation
          htmlElement.style.setProperty('position', 'sticky', 'important');
          htmlElement.style.setProperty('bottom', '0', 'important');
          htmlElement.style.setProperty('top', 'auto', 'important');
          htmlElement.style.setProperty('z-index', '30', 'important');
          
          // Also update inline style attribute
          let currentStyle = htmlElement.getAttribute('style') || '';
          currentStyle = currentStyle
            .replace(/position\s*:\s*fixed/gi, 'position: sticky')
            .replace(/position\s*:\s*fixed/gi, 'position: sticky');
          
          if (!currentStyle.includes('bottom:')) {
            currentStyle += (currentStyle ? '; ' : '') + 'bottom: 0;';
          }
          if (!currentStyle.includes('top:')) {
            currentStyle += (currentStyle ? '; ' : '') + 'top: auto;';
          }
          
          htmlElement.setAttribute('style', currentStyle);
          htmlElement.setAttribute('data-ad-fixed', 'true');
        }
      });
    };

    // Run immediately when DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fixAdPositions);
    } else {
      fixAdPositions();
    }

    // Run multiple times to catch dynamically injected ads
    const intervals = [500, 1000, 2000, 3000, 5000, 7000, 10000];
    const timeouts = intervals.map(interval => setTimeout(fixAdPositions, interval));

    // Watch for new elements being added (for dynamically injected ads)
    const observer = new MutationObserver((mutations) => {
      let shouldFix = false;
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          shouldFix = true;
        }
        if (mutation.type === 'attributes' && mutation.attributeName === 'style') {
          shouldFix = true;
        }
      });
      if (shouldFix) {
        // Debounce to avoid excessive calls
        setTimeout(fixAdPositions, 100);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'id'],
    });

    // Also watch for style changes on window
    const styleObserver = new MutationObserver(() => {
      setTimeout(fixAdPositions, 50);
    });

    // Watch document head for script additions
    if (document.head) {
      styleObserver.observe(document.head, {
        childList: true,
        subtree: false,
      });
    }

    return () => {
      timeouts.forEach(timeout => clearTimeout(timeout));
      observer.disconnect();
      styleObserver.disconnect();
    };
  }, []);

  return null;
}
