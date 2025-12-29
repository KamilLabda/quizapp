'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

/**
 * ScrollToTop component
 * Automatically scrolls to top of page when route changes
 */
export function ScrollToTop() {
  const pathname = usePathname();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Only scroll if pathname actually changed
    if (prevPathname.current !== pathname) {
      prevPathname.current = pathname;
      
      // Use multiple methods for reliable scrolling
      requestAnimationFrame(() => {
        // Method 1: scrollIntoView on document element
        document.documentElement.scrollIntoView({ behavior: 'instant', block: 'start' });
        // Method 2: window.scrollTo as backup
        window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
        // Method 3: scrollTop on document elements
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      });
    }
  }, [pathname]);

  return null;
}

