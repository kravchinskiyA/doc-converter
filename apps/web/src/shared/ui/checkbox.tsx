import * as React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../lib/utils';

export interface CheckboxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: React.ReactNode;
}

export const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, checked, onChange, id, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;

    return (
      <label
        htmlFor={inputId}
        className={cn(
          'inline-flex items-center gap-2.5 cursor-pointer select-none text-[14px] font-book text-off-black',
          className
        )}
      >
        <span className="relative flex items-center justify-center">
          <input
            type="checkbox"
            id={inputId}
            ref={ref}
            checked={checked}
            onChange={onChange}
            className="peer sr-only"
            {...props}
          />
          <span
            className={cn(
              'h-[18px] w-[18px] rounded-[5px] border border-black/20 bg-pure-white transition-colors',
              'peer-focus-visible:ring-1 peer-focus-visible:ring-signal-blue',
              'peer-checked:bg-off-black peer-checked:border-off-black'
            )}
          />
          <Check
            className={cn(
              'absolute h-3 w-3 text-pure-white opacity-0 transition-opacity pointer-events-none',
              'peer-checked:opacity-100'
            )}
            strokeWidth={2.5}
          />
        </span>
        {label && <span className="leading-tight">{label}</span>}
      </label>
    );
  }
);
Checkbox.displayName = 'Checkbox';

