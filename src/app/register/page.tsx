import { RegisterForm } from '@/components/auth/register-form';
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-8rem)]">
      <div className="w-full max-w-md space-y-4">
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary hover:underline font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

