import * as React from 'react';
import { cn } from '@/shared/lib';

export interface AuthCardProps extends React.HTMLAttributes<HTMLDivElement> {
  badge?: React.ReactNode;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}

export function AuthCard({
  badge,
  title,
  subtitle,
  children,
  className,
  ...props
}: AuthCardProps) {
  return (
    <div
      className={cn(
        'w-full max-w-[500px] mx-auto rounded-[32px] md:rounded-[44px] border-[0.5px] border-black/[0.06] bg-pure-white p-7 sm:p-10 transition-colors',
        className
      )}
      {...props}
    >
      <div className="mb-8 text-left space-y-2">
        {badge && <div className="mb-3">{badge}</div>}
        <h1 className="text-[24px] md:text-[27px] font-book tracking-tight text-off-black leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-[14px] md:text-[15px] font-book text-steel-gray leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

