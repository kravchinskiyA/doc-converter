'use client';

import * as React from 'react';
import { StaffLoginForm } from '@/features/admin';

export function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#f2f2f4] text-off-black flex items-center justify-center px-4 py-20 pt-28">
      <StaffLoginForm />
    </div>
  );
}
