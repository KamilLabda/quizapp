import { redirect } from 'next/navigation';
import { getSurveyById } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { SurveyPlayerClient } from './survey-player-client';
import { PageWithAds } from '@/components/layout/page-with-ads';

export default async function SurveyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const currentUser = await getCurrentUser();
  // Allow unauthenticated access - users can complete surveys without login

  const survey = await getSurveyById(id);

  if (!survey || !survey.isActive) {
    redirect('/surveys');
  }

  return (
    <PageWithAds surveyId={id}>
      <SurveyPlayerClient surveyId={id} />
    </PageWithAds>
  );
}

