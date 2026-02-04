'use client';

import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const ADCASH_VAST_URL = 'https://youradexchange.com/video/select.php?r=10939242';

type PlayerState = 'loading' | 'no-ad' | 'playing' | 'ended' | 'error';

function getFirstMediaFileUrl(xmlText: string): string | null {
  try {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlText, 'text/xml');
    const mediaFiles = doc.querySelectorAll('MediaFile');
    for (let i = 0; i < mediaFiles.length; i++) {
      const mf = mediaFiles[i];
      const type = (mf.getAttribute('type') || '').toLowerCase();
      const url = mf.textContent?.trim();
      if (url && (type.includes('mp4') || type.includes('webm') || type === 'video/mp4' || type === 'video/webm')) {
        return url;
      }
    }
    const first = doc.querySelector('MediaFile');
    if (first?.textContent?.trim()) return first.textContent.trim();
    return null;
  } catch {
    return null;
  }
}

function notifyParentClose() {
  if (typeof window !== 'undefined' && window.parent !== window) {
    window.parent.postMessage({ type: 'videoAdClose' }, '*');
  }
}

function isAdcashVastUrl(url: string | null): boolean {
  if (!url) return false;
  try {
    const u = new URL(url);
    return u.hostname === 'youradexchange.com' || u.hostname === 'www.youradexchange.com';
  } catch {
    return false;
  }
}

declare global {
  interface Window {
    videojs?: (id: string, options?: Record<string, unknown>, ready?: () => void) => { ima: (opts: { adTagUrl: string }) => void; on: (e: string, fn: () => void) => void; one: (e: string, fn: () => void) => void; dispose: () => void; isDisposed?: () => boolean };
  }
}

function VideoAdPlayerInner() {
  const searchParams = useSearchParams();
  const vastUrl = searchParams.get('url');
  const [state, setState] = useState<PlayerState>('loading');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const playerRef = useRef<ReturnType<NonNullable<typeof window.videojs>> | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [videoJsGaveUp, setVideoJsGaveUp] = useState(false);

  const handleClose = useCallback(() => notifyParentClose(), []);

  const loadVastFallback = useCallback(async (url: string) => {
    setState('loading');
    setVideoUrl(null);
    setErrorMessage('');
    try {
      const apiUrl = `/api/video-ads/vast?url=${encodeURIComponent(url)}`;
      const res = await fetch(apiUrl);
      const text = await res.text();
      if (!res.ok) {
        setState('error');
        setErrorMessage('Could not load ad.');
        return;
      }
      const mediaUrl = getFirstMediaFileUrl(text);
      if (!mediaUrl) {
        setState('no-ad');
        return;
      }
      setVideoUrl(mediaUrl);
      setState('playing');
    } catch {
      setState('error');
      setErrorMessage('Could not load ad.');
    }
  }, []);

  useEffect(() => {
    if (!vastUrl || !isAdcashVastUrl(vastUrl)) return;
    let mounted = true;
    let fallbackTimeout: ReturnType<typeof setTimeout> | null = null;

    const initVideoJs = () => {
      const videojs = window.videojs;
      if (!videojs || !containerRef.current) {
        if (mounted) setTimeout(initVideoJs, 100);
        return;
      }

      const videoEl = document.getElementById('video-ad-player');
      if (!videoEl || playerRef.current) return;

      try {
        const player = videojs('video-ad-player', {
          controls: true,
          autoplay: false,
          preload: 'auto',
          fluid: true,
        });

        playerRef.current = player;

        if (typeof (player as any).ima !== 'function') {
          throw new Error('IMA plugin not loaded');
        }
        (player as any).ima({
          adTagUrl: vastUrl,
        });

        if (mounted) setState('playing');
        if (fallbackTimeout) clearTimeout(fallbackTimeout);

        const onAdEnd = () => {
          if (mounted) {
            setState('ended');
            notifyParentClose();
          }
        };
        const onAdError = () => {
          if (mounted) {
            setState('error');
            setErrorMessage('Ad could not be loaded.');
          }
        };

        player.on('adend', onAdEnd);
        player.on('aderror', onAdError);
        player.on('contentended', onAdEnd);
      } catch (err) {
        if (mounted) {
          setState('error');
          setErrorMessage('Could not load ad.');
        }
      }
    };

    initVideoJs();

    return () => {
      mounted = false;
      if (playerRef.current && !playerRef.current.isDisposed?.()) {
        try {
          playerRef.current.dispose();
        } catch {}
        playerRef.current = null;
      }
    };
  }, [vastUrl]);

  useEffect(() => {
    if (!vastUrl) {
      setState('no-ad');
      return;
    }
    loadVastFallback(vastUrl);
  }, [vastUrl, loadVastFallback]);

  const handleEnded = useCallback(() => {
    setState('ended');
    notifyParentClose();
  }, []);

  const useVideoJs = false;

  return (
    <div className="relative min-h-[320px] w-full bg-black flex flex-col items-center justify-center p-4" ref={containerRef}>
      {state === 'loading' && !useVideoJs && (
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading ad...</p>
        </div>
      )}

      {useVideoJs && (
        <div className="w-full max-w-2xl">
          <div data-vjs-player>
            <video
              id="video-ad-player"
              className="video-js vjs-big-play-centered"
              playsInline
            />
          </div>
          {(state === 'loading' || state === 'playing' || state === 'ended') && (
            <div className="mt-3 flex justify-center">
              <Button onClick={handleClose} variant="secondary" size="sm">
                <X className="mr-2 h-4 w-4" />
                {state === 'ended' ? 'Close' : 'Skip / Close'}
              </Button>
            </div>
          )}
        </div>
      )}

      {state === 'loading' && useVideoJs && (
        <div className="flex flex-col items-center gap-4 absolute inset-0 bg-black/80 justify-center">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground">Loading ad...</p>
        </div>
      )}

      {state === 'no-ad' && !useVideoJs && (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">No video ad available right now.</p>
          <Button onClick={handleClose} variant="secondary" size="sm">
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      )}
      {state === 'error' && (
        <div className="flex flex-col items-center gap-4 text-center">
          <p className="text-muted-foreground">{errorMessage}</p>
          <Button onClick={handleClose} variant="secondary" size="sm">
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
        </div>
      )}
      {(state === 'playing' || state === 'ended') && videoUrl && !useVideoJs && (
        <div className="relative w-full max-w-2xl">
          <video
            key={videoUrl}
            src={videoUrl}
            className="w-full rounded-lg"
            autoPlay
            playsInline
            muted
            controls
            onEnded={handleEnded}
            onError={() => setState('error')}
          />
          <div className="mt-3 flex justify-center">
            <Button onClick={handleClose} variant="secondary" size="sm">
              <X className="mr-2 h-4 w-4" />
              {state === 'ended' ? 'Close' : 'Skip / Close'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function VideoAdPlayer() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[320px] w-full bg-black flex flex-col items-center justify-center p-4">
          <div className="h-10 w-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-muted-foreground mt-4">Loading ad...</p>
        </div>
      }
    >
      <VideoAdPlayerInner />
    </Suspense>
  );
}
