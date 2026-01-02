import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { VideoAdsClient } from './video-ads-client';
import { PageWithAds } from '@/components/layout/page-with-ads';

export default async function VideoAdsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/login');
  }

  return (
    <PageWithAds>
      <VideoAdsClient />
    </PageWithAds>
  );
}

