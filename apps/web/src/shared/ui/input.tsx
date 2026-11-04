import * as React from 'react';
import { cn } from '../lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-[44px] w-full rounded-nav border-[0.5px] border-black/10 bg-pure-white px-4 py-2 text-[15px] font-book tracking-tight text-off-black transition-colors',
          'placeholder:text-ash-gray',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-signal-blue focus-visible:border-signal-blue',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = 'Input';
