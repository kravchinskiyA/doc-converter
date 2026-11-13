import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

export const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-blue disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        'floating-cta':
          'rounded-btn bg-[#0c0d0f]/[0.05] hover:bg-[#0c0d0f]/[0.09] active:bg-[#0c0d0f]/[0.12] text-pure-black font-regular text-[14px] tracking-tight border border-black/5',
        ghost:
          'text-off-black hover:underline font-book text-[16px] tracking-tight bg-transparent',
        link:
          'text-signal-blue hover:underline font-book text-[16px] tracking-tight bg-transparent p-0',
        outline:
          'rounded-btn border border-signal-blue text-signal-blue hover:bg-signal-blue/5 font-regular text-[14px] tracking-tight',
        secondary:
          'rounded-btn bg-pure-white border border-black/10 hover:border-black/20 text-off-black font-regular text-[14px] tracking-tight',
      },
      size: {
        default: 'h-[42px] px-5 py-2.5',
        sm: 'h-[34px] px-3.5 py-1.5 text-[14px]',
        lg: 'h-[48px] px-7 py-3 text-[14px]',
        icon: 'h-[36px] w-[36px]',
      },
    },
    defaultVariants: {
      variant: 'floating-cta',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        {...props}
      />
    );
  }
);
Button.displayName = 'Button';

