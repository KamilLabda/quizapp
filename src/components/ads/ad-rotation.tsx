"use client";

import { useEffect, useState } from "react";

/**
 * Ad Network Rotation Manager
 *
 * Rotates between multiple ad networks based on:
 * - 300 impressions per network before switching
 * - 15-second rotation for individual ads
 *
 * Supports 4-6 ad slots:
 * - Top banner
 * - Bottom banner
 * - Left sidebar
 * - Right sidebar
 * - In-content ads
 */

export interface AdNetwork {
  id: string;
  name: string;
  bannerCode: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
    inContent?: string;
  };
}

// Define available ad networks
const AD_NETWORKS: AdNetwork[] = [
  {
    id: "adcash",
    name: "Adcash",
    bannerCode: {
      top: `
        <div>
          <script type="text/javascript">
            if (typeof aclib !== 'undefined') {
              aclib.runBanner({ zoneId: '10857890' });
            }
          </script>
        </div>
      `,
      left: `
        <div>
          <script type="text/javascript">
            if (typeof aclib !== 'undefined') {
              aclib.runBanner({ zoneId: '10857798' });
            }
          </script>
        </div>
      `,
    },
  },
  /* Adsterra/HPF disabled: highperformanceformat.com invoke.js causes page redirections.
  {
    id: "adsterra",
    name: "Adsterra",
    bannerCode: { top: `...HPF...`, left: `...HPF...`, inContent: `...HPF...` },
  },
  {
    id: "highperformance",
    name: "HighPerformanceFormat",
    bannerCode: { inContent: `...HPF...` },
  },
  */
];

const IMPRESSIONS_PER_NETWORK = 1000;
const AD_ROTATION_INTERVAL = 20000;

interface AdRotationState {
  currentNetworkIndex: number;
  impressionCount: number;
  lastRotation: number;
}

// Local storage keys
const STORAGE_KEY = "ad_rotation_state";

export function useAdRotation() {
  const [state, setState] = useState<AdRotationState>(() => {
    if (typeof window === "undefined") {
      return {
        currentNetworkIndex: 0,
        impressionCount: 0,
        lastRotation: Date.now(),
      };
    }

    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Failed to load ad rotation state:", e);
    }

    return {
      currentNetworkIndex: 0,
      impressionCount: 0,
      lastRotation: Date.now(),
    };
  });

  const [currentAdIndex, setCurrentAdIndex] = useState(0);

  // Save state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn("Failed to save ad rotation state:", e);
    }
  }, [state]);

  // Rotate ads every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAdIndex((prev) => (prev + 1) % AD_NETWORKS.length);

      setState((prev) => {
        const newImpressionCount = prev.impressionCount + 1;

        // Switch to next network after 300 impressions
        if (newImpressionCount >= IMPRESSIONS_PER_NETWORK) {
          return {
            currentNetworkIndex:
              (prev.currentNetworkIndex + 1) % AD_NETWORKS.length,
            impressionCount: 0,
            lastRotation: Date.now(),
          };
        }

        return {
          ...prev,
          impressionCount: newImpressionCount,
        };
      });
    }, AD_ROTATION_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const currentNetwork = AD_NETWORKS[state.currentNetworkIndex];

  return {
    currentNetwork,
    impressionCount: state.impressionCount,
    maxImpressions: IMPRESSIONS_PER_NETWORK,
    allNetworks: AD_NETWORKS,
  };
}

interface RotatingAdSlotProps {
  position: "top" | "bottom" | "left" | "right" | "inContent";
  className?: string;
}

// ALL ADS DISABLED per client. Set to false to re-enable RotatingAdSlot.
const ALL_ADS_DISABLED = true;

export function RotatingAdSlot({
  position,
  className = "",
}: RotatingAdSlotProps) {
  if (ALL_ADS_DISABLED) return null;
  const { currentNetwork } = useAdRotation();
  const [key, setKey] = useState(0);

  // Force re-render when network changes
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [currentNetwork]);

  const adCode = currentNetwork.bannerCode[position];

  if (!adCode) {
    return null;
  }

  return (
    <div className={`ad-slot-wrapper ad-slot-wrapper-${position} ${className}`}>
      <div
        key={key}
        className={`ad-slot ad-slot-${position}`}
        dangerouslySetInnerHTML={{ __html: adCode }}
      />
    </div>
  );
}
