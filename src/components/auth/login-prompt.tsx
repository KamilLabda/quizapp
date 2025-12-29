'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Trophy, LogIn, UserPlus } from 'lucide-react';

interface LoginPromptProps {
  open: boolean;
  onClose: () => void;
  pointsEarned: number;
  totalGuestPoints?: number;
}

export function LoginPrompt({ open, onClose, pointsEarned, totalGuestPoints }: LoginPromptProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-8 w-8 text-primary" />
            </div>
          </div>
          <DialogTitle className="text-center text-2xl">Great Job!</DialogTitle>
          <DialogDescription className="text-center">
            You've completed your first survey and earned <strong>{pointsEarned} points</strong>!
            {totalGuestPoints && totalGuestPoints > pointsEarned && (
              <span className="block mt-1">
                Total points from all surveys: <strong>{totalGuestPoints} points</strong>
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <Alert className="mt-4">
          <AlertDescription>
            <strong>Login required to save your progress!</strong>
            <br />
            Sign in or create an account to save your points and continue earning rewards.
          </AlertDescription>
        </Alert>

        <div className="flex flex-col gap-3 mt-6">
          <Link href="/login" className="w-full">
            <Button variant="default" className="w-full" size="lg">
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button variant="default" className="w-full" size="lg">
              <UserPlus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </Link>
          <Button variant="outline" onClick={onClose} className="w-full">
            Continue as Guest
          </Button>
        </div>

        <p className="text-xs text-center text-muted-foreground mt-4">
          Your progress will be saved after you log in
        </p>
      </DialogContent>
    </Dialog>
  );
}

