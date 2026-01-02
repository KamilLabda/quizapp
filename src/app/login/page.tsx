import { LoginForm } from '@/components/auth/login-form';
import Link from 'next/link';
import { PageWithAds } from '@/components/layout/page-with-ads';

export default function LoginPage() {
  return (
    <PageWithAds showSidebar={false}>
      <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
        <div className="w-full max-w-md space-y-4">
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{' '}
            <Link href="/register" className="text-primary hover:underline font-semibold">
              Sign up for free
            </Link>
          </p>
        </div>
      </div>
    </PageWithAds>
  );
}

