import { getCurrentUser } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { VideoAdsClient } from './video-ads-client';

export default async function VideoAdsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser) {
    redirect('/login');
  }

  return <VideoAdsClient />;
}

