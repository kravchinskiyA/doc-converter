import * as React from 'react';
import { RegisterForm } from '@/features/auth';

export function RegisterPage() {
  return (
    <div className="py-6 sm:py-12 flex flex-col items-center justify-center">
      <RegisterForm />
    </div>
  );
}

