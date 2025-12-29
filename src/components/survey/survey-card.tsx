'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface SurveyCardProps {
  id: string;
  title: string;
  description?: string;
  points: number;
  questionCount: number;
  isCompleted?: boolean;
}

export function SurveyCard({ id, title, description, points, questionCount, isCompleted }: SurveyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="px-4 md:px-6 pt-4 md:pt-6">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg md:text-xl mb-2">{title}</CardTitle>
            {description && (
              <CardDescription className="line-clamp-2 text-sm md:text-base">{description}</CardDescription>
            )}
          </div>
          {isCompleted && (
            <Badge variant="secondary" className="ml-2 shrink-0 text-xs">
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-4 md:px-6">
        <div className="flex items-center gap-3 md:gap-4 text-xs md:text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <ClipboardList className="h-3 w-3 md:h-4 md:w-4" />
            <span>{points} points</span>
          </div>
          <div>
            {questionCount} {questionCount === 1 ? 'question' : 'questions'}
          </div>
        </div>
      </CardContent>
      <CardFooter className="px-4 md:px-6 pb-4 md:pb-6">
        <Button asChild className="w-full text-sm md:text-base" variant="default">
          <Link href={`/survey/${id}`}>
            {isCompleted ? 'View Again' : 'Take Survey'}
            <ArrowRight className="ml-2 h-3 w-3 md:h-4 md:w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

