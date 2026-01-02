import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ClipboardList, CheckCircle2, Clock, TrendingUp, ArrowRight, Trophy } from 'lucide-react';
import { FloatingAd } from '@/components/ads/floating-ad';
import { PageWithAds } from '@/components/layout/page-with-ads';

export default async function LandingPage() {
  const currentUser = await getCurrentUser();
  
  // If user is logged in, redirect to surveys
  if (currentUser) {
    redirect('/surveys');
  }

  return (
    <PageWithAds>
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 relative">
        {/* Floating Ad - Only on desktop, appears after user has time to read content */}
        <FloatingAd position="bottom-right" delay={4000} />

        {/* Hero Section */}
        <div className="container mx-auto px-4 py-12 md:py-20 lg:py-24">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Logo/Title */}
            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full"></div>
                <ClipboardList className="relative h-14 w-14 md:h-20 md:w-20 text-primary" strokeWidth={2} />
              </div>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-primary via-primary/90 to-primary/70 bg-clip-text text-transparent tracking-tight">
                Punkcikowo
              </h1>
            </div>

            {/* Main CTA */}
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-semibold">
                Complete Surveys & Earn Rewards
              </h2>
              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
                Share your opinions and get rewarded. Complete surveys from leading companies and earn points for every survey you finish.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <Link href="/surveys">
                <Button size="lg" className="text-lg px-8 py-6 h-auto group">
                  Start the Survey
                  <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <p className="mt-4 text-sm text-muted-foreground">
                No account needed to start!{' '}
                <Link href="/login" className="text-primary hover:underline font-medium">
                  Sign in
                </Link>
                {' '}or{' '}
                <Link href="/register" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
                {' '}to save your progress
              </p>
            </div>
          </div>

          {/* Features Section */}
          <div className="max-w-6xl mx-auto mt-16 md:mt-24">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <CheckCircle2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Easy to Complete</CardTitle>
                  <CardDescription>
                    Simple, straightforward surveys that take just a few minutes to complete.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Trophy className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Earn Points</CardTitle>
                  <CardDescription>
                    Get rewarded with points for every survey you complete. Track your progress and build your rewards.
                  </CardDescription>
                </CardHeader>
              </Card>

              <Card className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Multiple Surveys</CardTitle>
                  <CardDescription>
                    Access a wide variety of surveys from different companies. New surveys added regularly.
                  </CardDescription>
                </CardHeader>
              </Card>
            </div>
          </div>

          {/* How It Works */}
          <div className="max-w-4xl mx-auto mt-16 md:mt-24">
            <h3 className="text-2xl md:text-3xl font-bold text-center mb-8">How It Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                  1
                </div>
                <h4 className="font-semibold">Start Immediately</h4>
                <p className="text-sm text-muted-foreground">No account needed! Start completing surveys right away</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                  2
                </div>
                <h4 className="font-semibold">Complete Your First Survey</h4>
                <p className="text-sm text-muted-foreground">Answer questions and earn points. Login required after first survey to save progress</p>
              </div>
              <div className="text-center space-y-2">
                <div className="h-10 w-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-lg mx-auto">
                  3
                </div>
                <h4 className="font-semibold">Save & Continue</h4>
                <p className="text-sm text-muted-foreground">Sign in or create an account to save your points and continue earning rewards</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWithAds>
  );
}
