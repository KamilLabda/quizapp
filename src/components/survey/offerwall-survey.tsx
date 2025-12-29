'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ExternalLink } from 'lucide-react';

interface OfferwallSurveyProps {
  userId?: string;
  onComplete?: (points: number) => void;
}

/**
 * Offerwall survey integration component
 * Supports multiple Offerwall providers via iframe
 * 
 * Common providers:
 * - AdGate Media
 * - AdscendMedia
 * - OfferToro
 * - Lootably
 * - CPX Research
 * - AdGem
 */
export function OfferwallSurvey({ userId, onComplete }: OfferwallSurveyProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offerwallUrl, setOfferwallUrl] = useState<string | null>(null);

  useEffect(() => {
    // Fetch Offerwall URL from API
    // This will be configured with your Offerwall provider credentials
    fetchOfferwallUrl();
  }, [userId]);

  const fetchOfferwallUrl = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/offerwall/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to load Offerwall');
      }

      const data = await response.json();
      setOfferwallUrl(data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load surveys');
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for postMessage from Offerwall iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Verify origin for security (update with your Offerwall domain)
      // if (event.origin !== 'https://your-offerwall-domain.com') return;

      if (event.data.type === 'offerwall_complete') {
        const points = event.data.points || 0;
        if (onComplete && points > 0) {
          onComplete(points);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading surveys...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button variant="default" onClick={fetchOfferwallUrl} className="mt-4">
            Retry
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (!offerwallUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Surveys & Offers</CardTitle>
          <CardDescription>
            Complete surveys and offers to earn extra points
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Offerwall is not configured. Please add your Offerwall provider credentials in the admin panel.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle>Surveys & Offers</CardTitle>
        <CardDescription>
          Complete surveys and offers to earn extra points. Click on any offer to get started.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative w-full" style={{ height: 'calc(100vh - 300px)', minHeight: '600px', maxHeight: '800px' }}>
          <iframe
            src={offerwallUrl}
            className="w-full h-full border-0 block"
            style={{ 
              width: '100%', 
              height: '100%',
              display: 'block',
              border: 'none',
              overflow: 'auto'
            }}
            title="Offerwall Surveys"
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
            allow="fullscreen"
          />
        </div>
        <div className="px-3 md:px-6 py-3 text-xs md:text-sm text-muted-foreground flex items-center gap-2 justify-center border-t">
          <ExternalLink className="h-3 w-3 md:h-4 md:w-4" />
          <span>Surveys are provided by our partner Offerwall network</span>
        </div>
      </CardContent>
    </Card>
  );
}

