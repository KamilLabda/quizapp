"use client";

import { useEffect } from "react";

interface AdsterraBannerProps {
  adKey: string;
  width: number;
  height: number;
  className?: string;
  format?: "iframe";
}

/**
 * Adsterra Banner Component
 * Renders Adsterra ad banners using the highperformanceformat.com invoke script
 *
 * Available Ad Keys:
 * - 9b025dee52a2b0c32481b868d751d1dd: Banner 160x600
 * - b3c66cf41e55995ac85aa5b2934d3e75: Banner 728x90 (Head/Foot)
 * - 863b0f69e6d6f3c70c71f435e4ae050c: Banner 300x250
 *
 * Usage:
 * <AdsterraBanner adKey="9b025dee52a2b0c32481b868d751d1dd" width={160} height={600} />
 */
export function AdsterraBanner({
  adKey,
  width,
  height,
  className = "",
  format = "iframe",
}: AdsterraBannerProps) {
  const containerId = `adsterra-${adKey.substring(0, 8)}`;

  useEffect(() => {
    // Set up atOptions for this specific banner
    if (typeof window !== "undefined") {
      const optionsKey = `atOptions_${width}x${height}`;
      (window as any)[optionsKey] = {
        key: adKey,
        format: format,
        height: height,
        width: width,
        params: {},
      };
    }
  }, [adKey, width, height, format]);

  return (
    <div
      id={containerId}
      className={`adsterra-banner-container ${className}`}
      data-ad-key={adKey}
      style={{
        minWidth: `${width}px`,
        minHeight: `${height}px`,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* The ad will be injected here by the invoke.js script */}
    </div>
  );
}

// Pre-configured banner components for easy use
export function AdsterraBanner160x600({ className }: { className?: string }) {
  return (
    <AdsterraBanner
      adKey="9b025dee52a2b0c32481b868d751d1dd"
      width={160}
      height={600}
      className={className}
    />
  );
}

export function AdsterraBanner728x90({ className }: { className?: string }) {
  return (
    <AdsterraBanner
      adKey="b3c66cf41e55995ac85aa5b2934d3e75"
      width={728}
      height={90}
      className={className}
    />
  );
}

export function AdsterraBanner300x250({ className }: { className?: string }) {
  return (
    <AdsterraBanner
      adKey="863b0f69e6d6f3c70c71f435e4ae050c"
      width={300}
      height={250}
      className={className}
    />
  );
}
