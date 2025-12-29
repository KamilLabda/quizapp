'use client';

import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AdPlaceholder } from './ad-placeholder';

interface FloatingAdProps {
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  delay?: number; // Delay before showing (ms)
}

export function FloatingAd({ position = 'bottom-right', delay = 2000 }: FloatingAdProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  useEffect(() => {
    // Only show on desktop screens (md and above)
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
    // Store in localStorage to remember user preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('floatingAdClosed', 'true');
    }
  };

  // Check if user previously closed the ad
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
        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-1 right-1 h-6 w-6 z-10 bg-background/80 hover:bg-background rounded-full"
          onClick={handleClose}
          aria-label="Close ad"
        >
          <X className="h-3 w-3" />
        </Button>

        {/* Ad content */}
        <div className="p-2">
          <div className="text-xs text-muted-foreground text-center mb-1 font-medium">
            Advertisement
          </div>
          <div className="rounded overflow-hidden">
            <AdPlaceholder position="sidebar" surveyId="landing-page" />
          </div>
        </div>
      </div>
    </div>
  );
}

