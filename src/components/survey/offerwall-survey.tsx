"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { Loader2, ChevronLeft } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";

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
// Only KiwiWall and CPX Research are active
const SURVEY_PROVIDERS: SurveyProvider[] = [
  {
    id: "kiwiwall",
    name: "Kiwi Wall",
    description: "Premium offers & surveys",
    color: "from-teal-500 to-teal-600",
  },
  {
    id: "cpx-research",
    name: "CPX Research",
    description: "Premium market research surveys",
    color: "from-blue-500 to-blue-600",
    logo: "/logos/logo2-cpx-reserach.png", // CPX Research logo
  },
];

export function OfferwallSurvey({ userId, onComplete }: OfferwallSurveyProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [activeProvider, setActiveProvider] = useState<string | null>(null);
  const [providerUrl, setProviderUrl] = useState<string | null>(null);
  const { toast } = useToast();

  // Check if there's a pending survey provider after login
  useEffect(() => {
    const pendingProvider = sessionStorage.getItem("pending-survey-provider");
    if (pendingProvider && userId) {
      sessionStorage.removeItem("pending-survey-provider");
      // Automatically load the survey provider
      fetchProviderUrl(pendingProvider);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  const fetchProviderUrl = async (providerId: string) => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/offerwall/url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, provider: providerId }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Check if it's an authentication error
        if (response.status === 401) {
          // Store the provider ID in sessionStorage to restore after login
          sessionStorage.setItem("pending-survey-provider", providerId);
          // Redirect to login with callback URL
          const currentPath = window.location.pathname + window.location.search;
          window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          return;
        }

        // Use user-friendly error message from API if available
        const errorMessage =
          data.message ||
          data.error ||
          "Unable to load surveys at this time. Please try again.";
        throw new Error(errorMessage);
      }

      setProviderUrl(data.url);
      setActiveProvider(providerId);
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Unable to load surveys at this time. Please try again.";
      const provider = SURVEY_PROVIDERS.find((p) => p.id === providerId);
      toast({
        variant: "error",
        title: "Unable to load surveys",
        description: provider
          ? `${errorMessage} (Provider: ${provider.name})`
          : errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Listen for postMessage from provider iframe
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data.type === "offerwall_complete" ||
        event.data.type === "survey_complete"
      ) {
        const points = event.data.points || 0;
        if (onComplete && points > 0) {
          onComplete(points);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [onComplete]);

  const handleBack = () => {
    setActiveProvider(null);
    setProviderUrl(null);
  };

  // Show provider iframe
  if (activeProvider && providerUrl) {
    const provider = SURVEY_PROVIDERS.find((p) => p.id === activeProvider);

    // Extract domain from URL for display
    let urlDisplay = "";
    try {
      const url = new URL(providerUrl);
      urlDisplay = url.hostname.replace("www.", "");
    } catch {
      urlDisplay = "Survey Provider";
    }

    return (
      <div
        className="w-full"
        style={{ height: "calc(100vh - 180px)", minHeight: "600px" }}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4 p-3 bg-muted/30 rounded-lg border">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Providers
          </Button>
          <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
            <span className="text-muted-foreground">
              Currently viewing:{" "}
              <span className="font-semibold text-foreground">
                {provider?.name}
              </span>
            </span>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              Source: <span className="font-mono text-xs">{urlDisplay}</span>
            </span>
          </div>
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
              <div className="flex-1 flex flex-col items-center justify-center gap-3">
                {provider.logo && (
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <Image
                      src={provider.logo}
                      alt={`${provider.name} logo`}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                  </div>
                )}
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
          Click on any offer above to browse available surveys and start earning
          rewards.
        </p>
      </div>
    </div>
  );
}
