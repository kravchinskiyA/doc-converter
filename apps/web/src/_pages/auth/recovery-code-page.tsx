import * as React from 'react';
import { RecoveryCodeForm } from '@/features/auth';

export function RecoveryCodePage() {
  return (
    <div className="py-6 sm:py-12 flex flex-col items-center justify-center">
      <RecoveryCodeForm />
    </div>
  );
}

