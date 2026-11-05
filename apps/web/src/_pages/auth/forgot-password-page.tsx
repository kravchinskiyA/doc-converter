import * as React from 'react';
import { ForgotPasswordForm } from '@/features/auth';

export function ForgotPasswordPage() {
  return (
    <div className="py-6 sm:py-12 flex flex-col items-center justify-center">
      <ForgotPasswordForm />
    </div>
  );
}

