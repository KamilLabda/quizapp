import { getAllSurveys } from '@/lib/db';
import { getCurrentUser } from '@/lib/auth';
import { getTodayDate, checkAndResetDailyLimits } from '@/lib/points';
import { hasUserCompletedSurvey } from '@/lib/db';
import { SurveyCard } from '@/components/survey/survey-card';
import { OfferwallSurvey } from '@/components/survey/offerwall-survey';
import { AdPlaceholder } from '@/components/ads/ad-placeholder';
import { PageWithAds } from '@/components/layout/page-with-ads';

export default async function SurveysPage() {
  const currentUser = await getCurrentUser();
  
  if (currentUser) {
    await checkAndResetDailyLimits(currentUser.userId);
  }

  const surveys = await getAllSurveys(true); // Get active surveys only
  const today = getTodayDate();

  // Check which surveys user has completed today
  const surveysWithStatus = await Promise.all(
    surveys.map(async (survey) => {
      let isCompleted = false;
      if (currentUser) {
        isCompleted = await hasUserCompletedSurvey(currentUser.userId, survey.id, today);
      }
      return {
        ...survey,
        isCompleted,
      };
    })
  );

  return (
    <PageWithAds>
      <div className="space-y-6 md:space-y-8">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Surveys & Offers</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Complete surveys and offers to earn extra points!
          </p>
        </div>

        {/* Offerwall Surveys Section */}
        <div className="mb-8">
          <OfferwallSurvey userId={currentUser?.userId} />
        </div>

        {/* Regular Surveys Section */}
        {surveys.length > 0 && (
          <div>
            <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Available Surveys</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {surveysWithStatus.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  id={survey.id}
                  title={survey.title}
                  description={survey.description}
                  points={survey.points}
                  questionCount={survey.questions.length}
                  isCompleted={survey.isCompleted}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </PageWithAds>
  );
}

