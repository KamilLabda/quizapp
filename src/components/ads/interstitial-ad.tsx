'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { AdPlaceholder } from './ad-placeholder';

interface InterstitialAdProps {
  onClose: () => void;
  surveyId?: string;
}

/**
 * Full-screen interstitial ad that appears between quizzes
 * Shows for a minimum time before allowing user to close
 */
export function InterstitialAd({ onClose, surveyId }: InterstitialAdProps) {
  const [canClose, setCanClose] = useState(false);
  const MIN_DISPLAY_TIME = 3000; // 3 seconds minimum

  useEffect(() => {
    const timer = setTimeout(() => {
      setCanClose(true);
    }, MIN_DISPLAY_TIME);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header with close button */}
        <div className="relative bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-end">
          {canClose && (
            <button
              className="h-7 w-7 rounded-full border border-gray-300 bg-white hover:bg-gray-50 hover:border-gray-400 transition-colors flex items-center justify-center cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-gray-400 focus-visible:ring-offset-2"
              onClick={onClose}
              aria-label="Close ad"
            >
              <X className="h-4 w-4 text-gray-700" />
            </button>
          )}
        </div>

        {/* Ad content */}
        <div className="flex-1 overflow-auto p-6">
          {!canClose && (
            <div className="mb-4 text-center">
              <p className="text-sm text-muted-foreground">Please wait...</p>
            </div>
          )}
          <div className="flex justify-center min-h-[400px]">
            <AdPlaceholder position="interstitial" surveyId={surveyId} />
          </div>
        </div>
      </div>
    </div>
  );
}

