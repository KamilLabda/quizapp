"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ClipboardList, LogOut, User, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  email: string;
  username: string;
  points: number;
}

export function Header() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchUser();

    // Listen for auth state changes (login/logout)
    const handleAuthChange = () => {
      fetchUser();
    };

    // Listen for custom auth events
    window.addEventListener("auth-state-changed", handleAuthChange);

    // Also listen for storage changes (in case auth uses localStorage)
    window.addEventListener("storage", handleAuthChange);

    return () => {
      window.removeEventListener("auth-state-changed", handleAuthChange);
      window.removeEventListener("storage", handleAuthChange);
    };
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error("Error fetching user:", error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);

      // Dispatch custom event to notify other components of auth state change
      window.dispatchEvent(new CustomEvent("auth-state-changed"));

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container flex h-14 md:h-16 items-center justify-between px-3 sm:px-4">
        <Link href="/" className="flex items-center gap-2 md:gap-2.5 group">
          <div className="relative">
            <ClipboardList className="h-5 w-5 md:h-6 md:w-6 text-primary transition-transform group-hover:scale-110" />
          </div>
          <span className="hidden min-[375px]:inline text-lg md:text-xl font-black bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent tracking-tight">
            Punkcikowo
          </span>
          <span className="min-[375px]:hidden font-black bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent text-sm sm:text-base">
            Punk
          </span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-2 lg:gap-4">
          {isLoading ? (
            <div className="h-8 w-20 md:w-24 bg-muted animate-pulse rounded" />
          ) : user ? (
            <>
              <Link href="/surveys" className="hidden md:block">
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  Surveys
                </Button>
              </Link>
              <Link href="/video-ads" className="hidden lg:block">
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  Video Ads
                </Button>
              </Link>
              <Link href="/video-player" className="hidden lg:block">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  Video Player
                </Button>
              </Link>
              <div className="flex items-center gap-1 md:gap-2">
                <Badge
                  variant="secondary"
                  className="gap-1 text-xs px-2 py-0.5"
                >
                  <Trophy className="h-3 w-3" />
                  <span className="hidden sm:inline">{user.points} points</span>
                  <span className="sm:hidden">{user.points}</span>
                </Badge>
                <div className="flex items-center gap-1 text-xs md:text-sm text-muted-foreground">
                  <User className="h-3 w-3 md:h-4 md:w-4 shrink-0" />
                  <span
                    className="max-w-[100px] sm:max-w-[120px] md:max-w-[150px] truncate"
                    title={user.username}
                  >
                    {user.username}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="p-2"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button
                  variant="outline"
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  Login
                </Button>
              </Link>
              <Link href="/register">
                <Button
                  variant="default"
                  size="sm"
                  className="text-xs md:text-sm"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
