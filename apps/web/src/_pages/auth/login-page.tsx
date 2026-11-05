import * as React from 'react';
import { LoginForm } from '@/features/auth';

export function LoginPage() {
  return (
    <div className="py-6 sm:py-12 flex flex-col items-center justify-center">
      <LoginForm />
    </div>
  );
}

