'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, CheckCircle2, Clock } from 'lucide-react';
import { AdPlaceholder } from '@/components/ads/ad-placeholder';
import { InterstitialAd } from '@/components/ads/interstitial-ad';
import { addGuestCompletion, hasGuestCompletions, getGuestTotalPoints } from '@/lib/guest-session';
import { LoginPrompt } from '@/components/auth/login-prompt';

interface SurveyQuestion {
  id: string;
  question: string;
  type: 'text' | 'multiple-choice' | 'rating' | 'yes-no';
  options?: string[];
  required: boolean;
}

interface Survey {
  id: string;
  title: string;
  description?: string;
  questions: SurveyQuestion[];
  points: number;
  isCompleted: boolean;
}

export function SurveyPlayerClient({ surveyId }: { surveyId: string }) {
  const router = useRouter();
  const topRef = useRef<HTMLDivElement>(null);
  const storageKey = `survey-progress-${surveyId}`;
  const MIN_SURVEY_TIME_SECONDS = 30; // Minimum 30 seconds to complete survey
  
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [showInterstitialAd, setShowInterstitialAd] = useState(false);
  const [shouldShowLoginPrompt, setShouldShowLoginPrompt] = useState(false);

  useEffect(() => {
    fetchSurvey();
    // Initialize start time
    const saved = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setStartTime(parsed.startTime || Date.now());
        setCurrentQuestionIndex(parsed.questionIndex || 0);
        setResponses(parsed.responses || {});
      } catch {
        setStartTime(Date.now());
      }
    } else {
      setStartTime(Date.now());
    }
  }, [surveyId, storageKey]);
  
  // Calculate minimum time remaining
  useEffect(() => {
    if (startTime === null) return;
    
    const calculateRemaining = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const remaining = Math.max(0, MIN_SURVEY_TIME_SECONDS - elapsed);
      setTimeRemaining(remaining);
    };
    
    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    
    return () => clearInterval(interval);
  }, [startTime]);
  
  // Save progress to localStorage
  useEffect(() => {
    if (typeof window === 'undefined' || startTime === null) return;
    
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        questionIndex: currentQuestionIndex,
        responses: responses,
        startTime: startTime,
        timestamp: Date.now(),
      }));
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  }, [currentQuestionIndex, responses, startTime, storageKey]);
  
  // Scroll to top when question changes
  useEffect(() => {
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [currentQuestionIndex]);

  const fetchSurvey = async () => {
    try {
      const response = await fetch(`/api/surveys/${surveyId}`);
      if (!response.ok) {
        if (response.status === 404) {
          router.push('/surveys');
          return;
        }
        throw new Error('Failed to load survey');
      }
      const data = await response.json();
      setSurvey(data.survey);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load survey');
    }
  };

  const handleResponseChange = (questionId: string, value: any) => {
    setResponses({
      ...responses,
      [questionId]: value,
    });
  };

  const handleNext = () => {
    // Check if minimum time has passed
    if (timeRemaining !== null && timeRemaining > 0) {
      return; // Don't allow proceeding until time is up
    }
    
    if (currentQuestionIndex < survey!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    // Check if minimum time has passed
    if (timeRemaining !== null && timeRemaining > 0) {
      setError(`Please wait ${Math.ceil(timeRemaining)} more seconds before submitting.`);
      return;
    }
    
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch(`/api/surveys/${surveyId}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          responses,
          startTime: startTime || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit survey');
      }

      // Clear saved progress
      if (typeof window !== 'undefined') {
        localStorage.removeItem(storageKey);
      }

      // If guest user, store completion in localStorage
      if (data.requiresLogin && data.guestCompletion) {
        // Check if this is the first survey before adding
        const wasFirstSurvey = !hasGuestCompletions();
        addGuestCompletion(data.guestCompletion);
        setPointsEarned(data.pointsEarned);
        
        // Mark that we should show login prompt after ad closes
        setShouldShowLoginPrompt(wasFirstSurvey);
      }
      
      // Show interstitial ad after successful submission
      setSuccess(true);
      setShowInterstitialAd(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit survey');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!survey) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading survey...</p>
        </div>
      </div>
    );
  }

  const handleInterstitialClose = () => {
    setShowInterstitialAd(false);
    // After ad closes, show login prompt if needed, otherwise redirect
    if (shouldShowLoginPrompt) {
      setShowLoginPrompt(true);
    } else {
      setTimeout(() => {
        router.push('/surveys');
      }, 500);
    }
  };

  if (success) {
    return (
      <>
        {showInterstitialAd && (
          <InterstitialAd
            onClose={handleInterstitialClose}
            surveyId={surveyId}
          />
        )}
        {!showInterstitialAd && (
          <>
            <Card className="w-full max-w-3xl mx-auto">
              <CardContent className="pt-6">
                <div className="text-center space-y-4">
                  <CheckCircle2 className="h-16 w-16 text-green-600 mx-auto" />
                  <h2 className="text-2xl font-bold">Survey Submitted!</h2>
                  <p className="text-muted-foreground">You earned {survey.points} points!</p>
                </div>
              </CardContent>
            </Card>
            <LoginPrompt
              open={showLoginPrompt}
              onClose={() => {
                setShowLoginPrompt(false);
                setTimeout(() => {
                  router.push('/surveys');
                }, 500);
              }}
              pointsEarned={pointsEarned}
              totalGuestPoints={getGuestTotalPoints()}
            />
          </>
        )}
      </>
    );
  }

  const currentQuestion = survey.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / survey.questions.length) * 100;
  const isLastQuestion = currentQuestionIndex === survey.questions.length - 1;
  const currentResponse = responses[currentQuestion.id];
  const canProceed = (currentQuestion.required ? currentResponse !== undefined && currentResponse !== '' : true) && 
                     (timeRemaining === null || timeRemaining === 0);

  return (
    <div className="w-full max-w-3xl mx-auto space-y-4 md:space-y-6 px-2 md:px-0">
      <div ref={topRef}>
        <h1 className="text-2xl md:text-3xl font-bold mb-2">{survey.title}</h1>
        {survey.description && (
          <p className="text-muted-foreground text-sm md:text-base">{survey.description}</p>
        )}
      </div>

      {/* Timer Display - Subtle and non-intrusive */}
      {timeRemaining !== null && timeRemaining > 0 && (
        <div className="text-center py-2 px-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4 text-primary" />
            <span>Please spend at least <strong className="text-primary">{Math.ceil(timeRemaining)}</strong> more seconds reviewing the questions</span>
          </div>
        </div>
      )}

      <Progress value={progress} className="h-2" />

      <Card>
        <CardHeader className="px-4 md:px-6 pt-4 md:pt-6">
          <CardTitle className="text-base md:text-lg">
            Question {currentQuestionIndex + 1} of {survey.questions.length}
            {currentQuestion.required && <span className="text-red-500 ml-1">*</span>}
          </CardTitle>
          <CardDescription className="text-sm md:text-base">{currentQuestion.question}</CardDescription>
        </CardHeader>
        <CardContent className="px-4 md:px-6 pb-4 md:pb-6">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {currentQuestion.type === 'text' && (
            <Input
              value={currentResponse || ''}
              onChange={(e) => handleResponseChange(currentQuestion.id, e.target.value)}
              placeholder="Type your answer here..."
              className="w-full"
            />
          )}

          {currentQuestion.type === 'multiple-choice' && (
            <RadioGroup
              key={currentQuestion.id} // Force re-render when question changes
              value={currentResponse?.toString()}
              onValueChange={(value) => handleResponseChange(currentQuestion.id, value)}
              className="space-y-3"
            >
              {currentQuestion.options?.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                    currentResponse === index.toString()
                      ? 'border-primary bg-primary/5 shadow-md'
                      : 'hover:border-primary/50 hover:bg-accent/50'
                  }`}
                  onClick={() => handleResponseChange(currentQuestion.id, index.toString())}
                >
                  <RadioGroupItem value={index.toString()} id={`option-${currentQuestion.id}-${index}`} />
                  <Label htmlFor={`option-${currentQuestion.id}-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {currentQuestion.type === 'yes-no' && (
            <RadioGroup
              key={currentQuestion.id} // Force re-render when question changes
              value={currentResponse?.toString()}
              onValueChange={(value) => handleResponseChange(currentQuestion.id, value === 'true')}
              className="space-y-3"
            >
              <div 
                className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  currentResponse === true
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'hover:border-primary/50 hover:bg-accent/50'
                }`}
                onClick={() => handleResponseChange(currentQuestion.id, true)}
              >
                <RadioGroupItem value="true" id={`yes-${currentQuestion.id}`} />
                <Label htmlFor={`yes-${currentQuestion.id}`} className="flex-1 cursor-pointer">Yes</Label>
              </div>
              <div 
                className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all cursor-pointer ${
                  currentResponse === false
                    ? 'border-primary bg-primary/5 shadow-md'
                    : 'hover:border-primary/50 hover:bg-accent/50'
                }`}
                onClick={() => handleResponseChange(currentQuestion.id, false)}
              >
                <RadioGroupItem value="false" id={`no-${currentQuestion.id}`} />
                <Label htmlFor={`no-${currentQuestion.id}`} className="flex-1 cursor-pointer">No</Label>
              </div>
            </RadioGroup>
          )}

          {currentQuestion.type === 'rating' && (
            <Select
              value={currentResponse?.toString()}
              onValueChange={(value) => handleResponseChange(currentQuestion.id, parseInt(value))}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a rating" />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((rating) => (
                  <SelectItem key={rating} value={rating.toString()}>
                    {rating}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between gap-2 md:gap-4">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentQuestionIndex === 0 || isSubmitting}
          className="min-w-[100px] md:min-w-[120px] text-sm md:text-base"
        >
          Previous
        </Button>
        <Button
          variant="default"
          onClick={handleNext}
          disabled={!canProceed || isSubmitting}
          className="min-w-[100px] md:min-w-[120px] text-sm md:text-base"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : isLastQuestion ? (
            'Submit Survey'
          ) : (
            'Next'
          )}
        </Button>
      </div>
    </div>
  );
}

