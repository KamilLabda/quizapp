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
      <div className="space-y-8 md:space-y-10">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">Earn Points</h1>
          <p className="text-muted-foreground text-base md:text-lg">
            Complete surveys to earn points and unlock rewards!
          </p>
        </div>

        {/* Survey Categories Section */}
        <section>
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Survey Categories</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Browse surveys by category and start earning
            </p>
          </div>
          <OfferwallSurvey userId={currentUser?.userId} />
        </section>

        {/* Divider */}
        <div className="border-t pt-8">
          {/* Regular Surveys Section */}
          <div className="mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Quick Surveys</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Short surveys created by our team
            </p>
          </div>
          {surveys.length > 0 ? (
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
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No surveys available at the moment. Check back later!</p>
            </div>
          )}
        </div>
      </div>
    </PageWithAds>
  );
}

