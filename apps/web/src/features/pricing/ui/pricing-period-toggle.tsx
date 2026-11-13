'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('pricing.toggle');

  return (
    <div className={cn('flex flex-col items-center gap-2.5', className)}>
      <div
        role="group"
        aria-label={t('ariaLabel')}
        className="inline-flex items-center rounded-nav border-[0.5px] border-black/10 bg-pure-white p-1"
      >
        <button
          type="button"
          onClick={() => onChange('monthly')}
          aria-pressed={value === 'monthly'}
          className={cn(
            'relative rounded-nav px-5 py-2 text-[16px] font-regular tracking-tight transition-all',
            value === 'monthly'
              ? 'bg-[#0c0d0f]/[0.08] text-off-black'
              : 'text-steel-gray hover:text-off-black'
          )}
        >
          {t('monthly')}
        </button>

        <button
          type="button"
          onClick={() => onChange('annual')}
          aria-pressed={value === 'annual'}
          className={cn(
            'relative flex items-center gap-2 rounded-nav  px-5 py-2 text-[16px] font-regular tracking-tight transition-all',
            value === 'annual'
              ? 'bg-signal-blue text-pure-white'
              : 'text-steel-gray hover:text-off-black'
          )}
        >
          <span>{t('annual')}</span>
          <span
            className={cn(
              'inline-flex items-center rounded-pill px-2 py-0.5 text-[14px] font-regular tracking-tight transition-colors',
              value === 'annual'
                ? 'bg-white/20 text-pure-white'
                : 'bg-signal-blue/10 text-signal-blue'
            )}
          >
            -15%
          </span>
        </button>
      </div>

      <div className="flex items-center gap-2 text-[14px] text-steel-gray font-book">
        <span>{t('annualNote')}</span>
        <Badge variant="signal-chip" className="text-[14px] py-0.5">
          {t('annualDiscount')}
        </Badge>
      </div>
    </div>
  );
}

