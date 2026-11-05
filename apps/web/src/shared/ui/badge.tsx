import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-pill px-3 py-1 text-[12px] font-regular tracking-tight transition-colors',
  {
    variants: {
      variant: {
        'signal-chip':
          'border-[0.5px] border-signal-blue text-signal-blue bg-transparent',
        neutral:
          'border-[0.5px] border-black/10 text-off-black bg-pure-white',
        muted:
          'border-[0.5px] border-black/5 text-steel-gray bg-black/[0.03]',
        error:
          'border-[0.5px] border-red-500/30 text-red-600 bg-red-500/[0.04]',
        success:
          'border-[0.5px] border-emerald-500/30 text-emerald-600 bg-emerald-500/[0.04]',
      },
    },
    defaultVariants: {
      variant: 'signal-chip',
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

