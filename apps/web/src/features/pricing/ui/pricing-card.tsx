'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Check, Sparkles, Building2, ShieldCheck, Zap } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import type { PlanCardData, PricingBillingPeriod } from '../model/types';

interface PricingCardProps {
  plan: PlanCardData;
  billingPeriod: PricingBillingPeriod;
  onSelectPlan: (tier: PlanCardData['tier']) => void;
  className?: string;
}

export function PricingCard({
  plan,
  billingPeriod,
  onSelectPlan,
  className,
}: PricingCardProps) {
  const t = useTranslations('pricing.card');
  const isAnnual = billingPeriod === 'annual';

  // Расчет отображаемой цены
  const displayPrice = React.useMemo(() => {
    if (plan.tier === 'enterprise') {
      return {
        amount: t('enterprisePrice'),
        period: '',
        billedNote: t('enterpriseNote'),
      };
    }

    if (plan.tier === 'basic') {
      return {
        amount: '€0',
        period: t('forever'),
        billedNote: t('noCard'),
      };
    }

    if (isAnnual) {
      return {
        amount: `€${plan.annualMonthlyEquivalentEur?.toFixed(2).replace('.', ',')}`,
        period: t('perMonthStar'),
        billedNote: t('annualBilledNote', {
          amount: plan.annualPriceEur ?? 0,
          savings: plan.annualSavingsEur ?? 0,
        }),
      };
    }

    return {
      amount: `€${plan.monthlyPriceEur}`,
      period: t('perMonth'),
      billedNote: t('monthlyBilledNote'),
    };
  }, [plan, isAnnual, t]);

  return (
    <div
      className={cn(
        'relative flex flex-col justify-between rounded-[36px] md:rounded-[44px] border p-6 md:p-8 bg-pure-white transition-all',
        plan.isPopular
          ? 'border-signal-blue ring-1 ring-signal-blue/20 bg-pure-white'
          : 'border-black/10 hover:border-black/20',
        className
      )}
    >
      {/* Бейдж популярного тарифа */}
      {plan.isPopular && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge
            variant="signal-chip"
            className="bg-signal-blue text-pure-white border-none px-3.5 py-1 text-[14px] font-regular flex items-center gap-1.5"
          >
            <Sparkles className="w-3 h-3 text-pure-white" />
            <span>{plan.badge || t('popularFallback')}</span>
          </Badge>
        </div>
      )}

      {/* Верхняя часть: Название, бейдж, описание и цена */}
      <div>
        <div className="space-y-2 mb-3">
          <div className="flex items-center gap-2">
            {plan.tier === 'basic' && <ShieldCheck className="w-5 h-5 text-steel-gray shrink-0" />}
            {plan.tier === 'pro' && <Zap className="w-5 h-5 text-signal-blue shrink-0" />}
            {plan.tier === 'max' && <Sparkles className="w-5 h-5 text-off-black shrink-0" />}
            {plan.tier === 'enterprise' && <Building2 className="w-5 h-5 text-steel-gray shrink-0" />}
            <h3 className="text-[22px] font-book tracking-tight text-off-black">
              {plan.title}
            </h3>
          </div>

          {!plan.isPopular && plan.badge ? (
            <div>
              <Badge variant={plan.badgeVariant || 'neutral'} className="text-[14px]">
                {plan.badge}
              </Badge>
            </div>
          ) : (
            <div aria-hidden="true" className="invisible select-none">
              <Badge variant="neutral" className="text-[14px]">
                {plan.badge || t('popularFallback')}
              </Badge>
            </div>
          )}
        </div>

        <p className="text-[16px] text-steel-gray font-book min-h-[44px] leading-snug mb-5">
          {plan.tagline}
        </p>

        {/* Блок цены */}
        <div className="pt-2 pb-5 border-t border-b border-black/[0.06] mb-6">
          <div className="flex items-baseline gap-1.5">
            <span className="text-[34px] md:text-[38px] font-book tracking-tight text-off-black">
              {displayPrice.amount}
            </span>
            {displayPrice.period && (
              <span className="text-[16px] font-book text-steel-gray">
                {displayPrice.period}
              </span>
            )}
          </div>

          <p className="text-[14px] text-steel-gray font-book mt-1 min-h-[20px]">
            {displayPrice.billedNote}
          </p>
        </div>

        {/* Кнопка действия */}
        <div className="mb-6">
          <Button
            type="button"
            variant={plan.isPopular ? 'floating-cta' : plan.ctaVariant}
            onClick={() => onSelectPlan(plan.tier)}
            className={cn(
              'w-full py-3 h-[46px] text-[16px] font-regular',
              plan.isPopular && 'bg-signal-blue hover:bg-signal-blue/90 text-pure-white border-transparent'
            )}
          >
            {plan.ctaText}
          </Button>
        </div>

        {/* Список возможностей */}
        <div className="space-y-3">
          <div className="text-[14px] font-regular text-steel-gray uppercase tracking-wider mb-2">
            {t('includedTitle')}
          </div>
          <ul className="space-y-2.5">
            {plan.features.map((feature, idx) => (
              <li
                key={idx}
                className={cn(
                  'flex items-start gap-2.5 text-[16px] leading-snug font-book',
                  feature.included ? 'text-off-black' : 'text-steel-gray/60 line-through'
                )}
              >
                {feature.included ? (
                  <Check
                    className={cn(
                      'w-4 h-4 mt-0.5 shrink-0',
                      feature.highlight ? 'text-signal-blue' : 'text-emerald-600'
                    )}
                  />
                ) : (
                  <span className="w-4 h-4 mt-0.5 shrink-0 text-center font-book text-steel-gray/40">
                    —
                  </span>
                )}
                <span className={cn(feature.highlight && 'font-regular text-off-black')}>
                  {feature.text}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

