import * as React from 'react';
import { cn } from '@/shared/lib';

export interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: React.ReactNode;
  title: string;
  subtitle?: React.ReactNode;
  children: React.ReactNode;
}

export function AuthCard({
  badge,
  title,
  subtitle: _subtitle,
  children,
  className,
  ...props
}: AuthCardProps) {
  return (
    <div
      className={cn(
        'w-full max-w-[500px] mx-auto rounded-[32px] md:rounded-[44px] border border-black/[0.06] bg-pure-white p-7 sm:p-10 transition-colors',
        className
      )}
      {...props}
    >
      <div className="mb-8 text-left space-y-2">
        {badge && <div className="mb-3">{badge}</div>}
        <h1 className="text-[24px] md:text-[27px] font-book tracking-tight text-off-black leading-tight">
          {title}
        </h1>
      </div>

      {children}
    </div>
  );
}

