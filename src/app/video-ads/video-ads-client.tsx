'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Play, Trophy, Loader2 } from 'lucide-react';

export function VideoAdsClient() {
  const [adsWatched, setAdsWatched] = useState(0);
  const [remaining, setRemaining] = useState(5);
  const [points, setPoints] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/video-ads/stats');
      if (response.ok) {
        const data = await response.json();
        setAdsWatched(data.adsWatchedToday || 0);
        setRemaining(data.remainingToday || 5);
        setPoints(data.totalPoints || 0);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleWatchAd = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/video-ads/watch', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Failed to watch ad');
        return;
      }

      // Update stats
      setAdsWatched(data.adsWatchedToday);
      setRemaining(data.remainingToday);
      setPoints(data.newTotalPoints);

      // Show success message
      alert(`You earned ${data.pointsEarned} point! Total: ${data.newTotalPoints} points`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Watch Video Ads</h1>
        <p className="text-muted-foreground text-lg">
          Watch video ads to earn extra points! (Max 5 per day)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Earn Points by Watching Ads</CardTitle>
          <CardDescription>
            Watch short video ads and earn 1 point per ad. You can watch up to 5 ads per day.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Ads Watched Today</p>
                  <p className="text-3xl font-bold">{adsWatched} / 5</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-1">Your Points</p>
                  <div className="flex items-center justify-center gap-1">
                    <Trophy className="h-5 w-5 text-primary" />
                    <p className="text-3xl font-bold">{points}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="border rounded-lg p-6 bg-muted/50">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold mb-1">Video Ad Reward</h3>
                <p className="text-sm text-muted-foreground">
                  Watch a video ad and earn 1 point
                </p>
              </div>
              <Badge variant="secondary">+1 point</Badge>
            </div>

            {remaining > 0 ? (
              <Button
                variant="default"
                onClick={handleWatchAd}
                disabled={isLoading}
                className="w-full"
                size="lg"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Loading ad...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Watch Ad & Earn Points
                  </>
                )}
              </Button>
            ) : (
              <Alert>
                <AlertDescription>
                  You've reached your daily limit of 5 video ads. Come back tomorrow!
                </AlertDescription>
              </Alert>
            )}
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <p>• Each video ad rewards 1 point</p>
            <p>• Maximum 5 ads per day</p>
            <p>• Daily limit resets at midnight</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

