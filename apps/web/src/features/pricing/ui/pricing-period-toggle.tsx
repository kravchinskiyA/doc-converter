'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import type { PricingBillingPeriod } from '../model/types';

interface PricingPeriodToggleProps {
  value: PricingBillingPeriod;
  onChange: (period: PricingBillingPeriod) => void;
  className?: string;
}

export function PricingPeriodToggle({
  value,
  onChange,
  className,
}: PricingPeriodToggleProps) {
  return (
    <div className={cn('flex flex-col items-center gap-2.5', className)}>
      <div
        role="group"
        aria-label="Период оплаты"
        className="inline-flex items-center rounded-nav border-[0.5px] border-black/10 bg-pure-white p-1"
      >
        <button
          type="button"
          onClick={() => onChange('monthly')}
          aria-pressed={value === 'monthly'}
          className={cn(
            'relative rounded-pill px-5 py-2 text-[14px] font-regular tracking-tight transition-all',
            value === 'monthly'
              ? 'bg-[#0c0d0f]/[0.08] text-off-black'
              : 'text-steel-gray hover:text-off-black'
          )}
        >
          Ежемесячно
        </button>

        <button
          type="button"
          onClick={() => onChange('annual')}
          aria-pressed={value === 'annual'}
          className={cn(
            'relative flex items-center gap-2 rounded-pill px-5 py-2 text-[14px] font-regular tracking-tight transition-all',
            value === 'annual'
              ? 'bg-signal-blue text-pure-white'
              : 'text-steel-gray hover:text-off-black'
          )}
        >
          <span>Ежегодно</span>
          <span
            className={cn(
              'inline-flex items-center rounded-pill px-2 py-0.5 text-[11px] font-regular tracking-tight transition-colors',
              value === 'annual'
                ? 'bg-white/20 text-pure-white'
                : 'bg-signal-blue/10 text-signal-blue'
            )}
          >
            -15%
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-[13px] text-steel-gray font-book">
        <span>При оплате за год:</span>
        <Badge variant="signal-chip" className="text-[11px] py-0.5">
          Скидка 15% (экономия до €18 в год)
        </Badge>
      </div>
    </div>
  );
}
