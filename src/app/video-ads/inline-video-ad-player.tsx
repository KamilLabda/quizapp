'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Volume2, VolumeX } from 'lucide-react';

const SKIP_AFTER_SECONDS = 5;

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

type PlayerStatus = 'loading' | 'no-ad' | 'error' | 'playing' | 'completed';

interface InlineVideoAdPlayerProps {
  vastUrl: string;
  onComplete: () => void;
  onClose: () => void;
}

export function InlineVideoAdPlayer({ vastUrl, onComplete, onClose }: InlineVideoAdPlayerProps) {
  const [status, setStatus] = useState<PlayerStatus>('loading');
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [skipCountdown, setSkipCountdown] = useState(SKIP_AFTER_SECONDS);
  const [canSkip, setCanSkip] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);
  const completedRef = useRef(false);

  const handleComplete = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    setVideoUrl(null);
    setErrorMessage('');
    (async () => {
      try {
        const res = await fetch(`/api/video-ads/vast?url=${encodeURIComponent(vastUrl)}`);
        const text = await res.text();
        if (cancelled) return;
        if (!res.ok) {
          setStatus('error');
          setErrorMessage('Could not load ad.');
          return;
        }
        const mediaUrl = getFirstMediaFileUrl(text);
        if (!mediaUrl) {
          setStatus('no-ad');
          return;
        }
        setVideoUrl(mediaUrl);
        setStatus('playing');
      } catch {
        if (!cancelled) {
          setStatus('error');
          setErrorMessage('Could not load ad.');
        }
      }
    })();
    return () => { cancelled = true; };
  }, [vastUrl]);

  useEffect(() => {
    if (status !== 'playing') return;
    const t = setInterval(() => {
      setSkipCountdown((prev) => {
        if (prev <= 1) {
          setCanSkip(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [status]);

  const handleEnded = useCallback(() => {
    handleComplete();
  }, [handleComplete]);

  const handleSkip = useCallback(() => {
    if (!canSkip) return;
    handleComplete();
  }, [canSkip, handleComplete]);

  const handleError = useCallback(() => {
    setStatus('error');
    setErrorMessage('Ad failed to play.');
  }, []);

  const toggleMute = useCallback(() => {
    const v = videoRef.current;
    if (v) {
      v.muted = !v.muted;
      setIsMuted(v.muted);
    }
  }, []);

  useEffect(() => {
    if (status !== 'playing' || !videoUrl) return;
    const id = requestAnimationFrame(() => {
      const v = videoRef.current;
      if (!v) return;
      v.muted = true;
      setIsMuted(true);
      v.play().catch(() => {});
    });
    return () => cancelAnimationFrame(id);
  }, [status, videoUrl]);

  const onCanPlay = useCallback(() => {
    const v = videoRef.current;
    if (v?.paused) v.play().catch(() => {});
  }, []);

  return (
    <div className="relative w-full min-h-[320px] bg-black rounded-lg overflow-hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute top-3 right-3 z-20 rounded-full bg-black/60 p-1.5 text-white hover:bg-black/80 transition-colors"
        aria-label="Close"
      >
        <X className="h-5 w-5" />
      </button>

      {status === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
          <div className="h-10 w-10 rounded-full border-2 border-white border-t-transparent animate-spin" />
          <p className="text-sm text-white/90">Loading ad...</p>
        </div>
      )}

      {status === 'no-ad' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
          <p className="text-white/90 text-center">No video ad available right now.</p>
          <Button onClick={onClose} variant="secondary" size="sm">
            Close
          </Button>
        </div>
      )}

      {status === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6">
          <p className="text-white/90 text-center">{errorMessage || 'Something went wrong.'}</p>
          <Button onClick={onClose} variant="secondary" size="sm">
            Close
          </Button>
        </div>
      )}

      {status === 'playing' && videoUrl && (
        <>
          <div className="absolute top-3 left-3 z-10 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white text-xs font-medium">
              Ad
            </span>
            <button
              type="button"
              onClick={toggleMute}
              className="p-1.5 rounded bg-black/60 text-white hover:bg-black/80 transition-colors"
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>
          </div>
          <video
            ref={videoRef}
            src={videoUrl}
            className="w-full min-h-[320px] object-contain"
            autoPlay
            playsInline
            muted
            controls
            onEnded={handleEnded}
            onError={handleError}
            onCanPlay={onCanPlay}
          />
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent flex justify-end items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSkip}
              disabled={!canSkip}
              className="min-w-[100px]"
            >
              {canSkip ? 'Skip ad' : `Skip in ${skipCountdown}s`}
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
