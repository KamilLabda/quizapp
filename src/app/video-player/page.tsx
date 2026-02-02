"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RotatingAdSlot } from "@/components/ads/ad-rotation";
import { Play, ExternalLink } from "lucide-react";

/**
 * Piped Video Player Page
 *
 * Features:
 * - Uses Piped (privacy-friendly YouTube frontend)
 * - Surrounded by rotating banner ads
 * - Prevents iframe from going fullscreen
 * - Piped video ads are shown during viewing
 */

export default function VideoPlayerPage() {
  const [videoUrl, setVideoUrl] = useState("");
  const [pipedUrl, setPipedUrl] = useState("");

  const handleLoadVideo = () => {
    if (!videoUrl) return;

    // Extract video ID from YouTube URL
    let videoId = "";
    try {
      const url = new URL(videoUrl);
      if (url.hostname.includes("youtube.com")) {
        videoId = url.searchParams.get("v") || "";
      } else if (url.hostname.includes("youtu.be")) {
        videoId = url.pathname.slice(1);
      }
    } catch (e) {
      // If not a valid URL, assume it's a video ID
      videoId = videoUrl;
    }

    if (videoId) {
      // Use Piped instance - piped.video is the official instance
      setPipedUrl(`https://piped.video/embed/${videoId}`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Top Banner Ad */}
        <div className="mb-6">
          <RotatingAdSlot position="top" className="flex justify-center" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Sidebar Ad */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-4">
              <RotatingAdSlot position="left" />
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Play className="h-6 w-6 text-primary" />
                  Video Player (Piped)
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Video URL Input */}
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Enter YouTube URL or Video ID"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleLoadVideo();
                      }
                    }}
                  />
                  <Button onClick={handleLoadVideo}>Load Video</Button>
                </div>

                {/* Info */}
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>
                    This player uses{" "}
                    <a
                      href="https://github.com/TeamPiped/Piped"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      Piped
                      <ExternalLink className="h-3 w-3" />
                    </a>
                    , a privacy-friendly YouTube frontend.
                  </p>
                  <p>
                    Paste a YouTube URL or video ID above to watch videos with
                    enhanced privacy.
                  </p>
                </div>

                {/* Video Player Container */}
                {pipedUrl ? (
                  <div
                    className="relative w-full"
                    style={{ paddingBottom: "56.25%" }}
                  >
                    {/* 16:9 Aspect Ratio */}
                    <iframe
                      src={pipedUrl}
                      className="absolute top-0 left-0 w-full h-full rounded-lg border shadow-sm"
                      title="Piped Video Player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      // Note: No allowFullScreen to prevent fullscreen mode
                      sandbox="allow-same-origin allow-scripts allow-forms"
                    />
                  </div>
                ) : (
                  <div
                    className="w-full bg-muted rounded-lg flex items-center justify-center text-muted-foreground"
                    style={{ paddingBottom: "56.25%", position: "relative" }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <p>Enter a YouTube URL to start watching</p>
                    </div>
                  </div>
                )}

                {/* In-Content Ad */}
                <div className="mt-6">
                  <RotatingAdSlot
                    position="inContent"
                    className="flex justify-center"
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar Ad */}
          <div className="hidden lg:block lg:col-span-2">
            <div className="sticky top-4">
              <RotatingAdSlot position="right" />
            </div>
          </div>
        </div>

        {/* Bottom Banner Ad */}
        <div className="mt-6">
          <RotatingAdSlot position="bottom" className="flex justify-center" />
        </div>
      </div>
    </div>
  );
}
