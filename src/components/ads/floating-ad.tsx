'use client';

interface FloatingAdProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  delay?: number;
}

/**
 * Floating Ad Component
 * 
 * CURRENTLY DISABLED: RollerAds scripts are disabled due to adult content.
 * This component returns null until family-safe ads are configured.
 * 
 * To re-enable: See ADULT_ADS_NOTICE.md for instructions.
 */
export function FloatingAd({ position = 'bottom-right', delay = 2000 }: FloatingAdProps) {
  // Ads are currently disabled - return nothing
  return null;

  /*
  // Original implementation - uncomment when ads are re-enabled
  import { useState, useEffect } from 'react';
  import { X } from 'lucide-react';
  import { Button } from '@/components/ui/button';
  import { AdPlaceholder } from './ad-placeholder';

  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      if (window.innerWidth >= 768) {
        const timer = setTimeout(() => {
          setIsVisible(true);
        }, delay);
        return () => clearTimeout(timer);
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, [delay]);

  const handleClose = () => {
    setIsVisible(false);
    setIsClosed(true);
    if (typeof window !== 'undefined') {
      localStorage.setItem('floatingAdClosed', 'true');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const wasClosed = localStorage.getItem('floatingAdClosed');
      if (wasClosed === 'true') {
        setIsClosed(true);
      }
    }
  }, []);

  if (isClosed || !isVisible) return null;

  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-20 right-4',
    'top-left': 'top-20 left-4',
  };

  return (
    <div
      className={`fixed ${positionClasses[position]} z-40 hidden md:block animate-in fade-in slide-in-from-bottom-4 duration-500`}
      style={{ maxWidth: '320px' }}
    >
      <div className="relative bg-background border-2 border-primary/20 rounded-lg shadow-2xl overflow-hidden hover:shadow-primary/20 transition-shadow">
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 z-10 bg-background/80 hover:bg-background rounded-full"
          onClick={handleClose}
          aria-label="Close ad"
        >
          <X className="h-3 w-3" />
        </Button>
        <div className="p-2">
          <AdPlaceholder position="sidebar" surveyId="landing-page" />
        </div>
      </div>
    </div>
  );
  */
}
