'use client';

import { useEffect } from 'react';

/**
 * Ad Verification Meta Tag Component
 * Adds the required meta tags for ad network verification
 * 
 * Configured Ad Networks:
 * 1. RollerAds (ID: 2261550) - www.punkcikowo.pl
 * 2. Ad Network with verification code: eeb54ab3adf7008f9233dcca30c08700c093dd5e
 */
export function AdVerification() {
  useEffect(() => {
    // Verification meta tag for second ad network
    const verificationCode = 'eeb54ab3adf7008f9233dcca30c08700c093dd5e';
    const existingMeta = document.querySelector(`meta[name="${verificationCode}"]`);
    
    if (!existingMeta) {
      const meta = document.createElement('meta');
      meta.name = verificationCode;
      meta.content = verificationCode;
      document.head.appendChild(meta);
    }
  }, []);

  return null; // This component doesn't render anything
}

