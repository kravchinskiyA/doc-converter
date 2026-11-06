'use client';

import * as React from 'react';
import { cn } from '@/shared/lib/utils';
import { PricingCard } from './pricing-card';
import type { PlanCardData, PricingBillingPeriod } from '../model/types';

interface PricingCardsGridProps {
  plans: PlanCardData[];
  billingPeriod: PricingBillingPeriod;
  onSelectPlan: (tier: PlanCardData['tier']) => void;
  className?: string;
}

export function PricingCardsGrid({
  plans,
  billingPeriod,
  onSelectPlan,
  className,
}: PricingCardsGridProps) {
  return (
    <div
      className={cn(
        'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch',
        className
      )}
    >
      {plans.map((plan) => (
        <PricingCard
          key={plan.tier}
          plan={plan}
          billingPeriod={billingPeriod}
          onSelectPlan={onSelectPlan}
        />
      ))}
    </div>
  );
}

