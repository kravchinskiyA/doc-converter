import * as React from 'react';
import { VerifyEmailForm } from '@/features/auth';

export function VerifyEmailPage() {
  return (
    <div className="py-6 sm:py-12 flex flex-col items-center justify-center">
      <React.Suspense
        fallback={
          <div className="w-full max-w-[500px] h-[360px] mx-auto rounded-[32px] md:rounded-[44px] border border-black/[0.06] bg-pure-white flex items-center justify-center text-steel-gray font-book text-[14px]">
            Завантаження…
          </div>
        }
      >
        <VerifyEmailForm />
      </React.Suspense>
    </div>
  );
}

