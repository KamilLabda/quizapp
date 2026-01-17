'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, ChevronLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface SurveyProvider {
  id: string;
  name: string;
  logo?: string;
  description: string;
  color: string;
}

interface OfferwallSurveyProps {
  userId?: string;
  onComplete?: (points: number) => void;
}

// Survey providers configuration
// KiwiWall is the real provider (prioritized first), others are placeholders
const SURVEY_PROVIDERS: SurveyProvider[] = [
  {
    id: 'kiwiwall',
    name: 'Offer 1',
    description: 'Premium offers & surveys',
    color: 'from-teal-500 to-teal-600',
  },
  {
    id: 'cpx-research',
    name: 'Offer 2',
    description: 'Premium market research surveys',
    color: 'from-blue-500 to-blue-600',
  },
  {
    id: 'offertoro',
    name: 'Offer 3',
    description: 'Quick surveys & offers',
    color: 'from-green-500 to-green-600',
  },
  {
    id: 'adgate',
    name: 'Offer 4',
    description: 'Verified survey rewards',
    color: 'from-purple-500 to-purple-600',
  },
  {
    id: 'lootably',
    name: 'Offer 5',
    description: 'Gaming & lifestyle surveys',
    color: 'from-orange-500 to-orange-600',
  },
];

export function OfferwallSurvey({ userId, onComplete }: OfferwallSurveyProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [providerUrl, setProviderUrl] = useState<string | null>(null);

  const fetchProviderUrl = async (providerId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/offerwall/url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, provider: providerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to load surveys');
      }

      const data = await response.json();
      setProviderUrl(data.url);
      setActiveProvider(providerId);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load surveys');
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for postMessage from provider iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'offerwall_complete' || event.data.type === 'survey_complete') {
        const points = event.data.points || 0;
        if (onComplete && points > 0) {
          onComplete(points);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onComplete]);

  const handleBack = () => {
    setActiveProvider(null);
    setProviderUrl(null);
    setError(null);
  };

  // Show provider iframe
  if (activeProvider && providerUrl) {
    const provider = SURVEY_PROVIDERS.find(p => p.id === activeProvider);
    
    return (
      <div className="w-full" style={{ height: 'calc(100vh - 180px)', minHeight: '600px' }}>
        <div className="flex items-center gap-3 mb-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Providers
          </Button>
          <span className="text-sm text-muted-foreground">
            Currently viewing: <strong>{provider?.name}</strong>
          </span>
        </div>
        <div className="w-full h-full rounded-lg overflow-hidden border shadow-sm">
          <iframe
            src={providerUrl}
            className="w-full h-full border-0"
            title={`${provider?.name} Surveys`}
            sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-top-navigation"
            allow="fullscreen"
          />
        </div>
      </div>
    );
  }

  // Show loading state
  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading surveys...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Show error state
  if (error) {
    return (
      <Card>
        <CardContent className="py-6">
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Button variant="default" onClick={() => setError(null)} className="mt-4">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show provider selection
  return (
    <div className="space-y-6">
      {/* Provider Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {SURVEY_PROVIDERS.map((provider) => (
          <Card 
            key={provider.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col p-0"
            onClick={() => fetchProviderUrl(provider.id)}
          >
            <div className={`h-2 bg-linear-to-r ${provider.color}`} />
            <CardContent className="p-4 flex flex-col flex-1 pb-4">
              <div className="flex-1 flex items-center justify-center">
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors text-center">
                  {provider.name}
                </h3>
              </div>
            </CardContent>
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full rounded-t-none rounded-b-xl border-t border-x-0 border-b-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors m-0"
            >
              View Surveys
            </Button>
          </Card>
        ))}
      </div>

      {/* Info Section */}
      <div className="bg-muted/50 rounded-lg p-4 text-center">
        <p className="text-sm text-muted-foreground">
          Click on any offer above to browse available surveys and start earning rewards.
        </p>
      </div>
    </div>
  );
}
