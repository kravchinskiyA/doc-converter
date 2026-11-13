'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import {
  ShieldCheck,
  CreditCard,
  Server,
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Link, useRouter } from '@/shared/i18n';
import {
  getPricingData,
  PricingPeriodToggle,
  PricingCardsGrid,
  PricingComparisonTable,
  PricingFaq,
  StripeCheckoutModal,
  EnterpriseContactDialog,
  type PricingBillingPeriod,
  type PricingPlanTier,
} from '@/features/pricing';

export function PricingPage() {
  const locale = useLocale();
  const t = useTranslations('pricing.page');
  const router = useRouter();
  const { plans, comparisonGroups, faqItems } = React.useMemo(
    () => getPricingData(locale),
    [locale]
  );
  const [billingPeriod, setBillingPeriod] = React.useState<PricingBillingPeriod>('annual');
  const [selectedPlan, setSelectedPlan] = React.useState<'pro' | 'max' | null>(null);
  const [isCheckoutOpen, setIsCheckoutOpen] = React.useState(false);
  const [isEnterpriseOpen, setIsEnterpriseOpen] = React.useState(false);

  const handleSelectPlan = (tier: PricingPlanTier) => {
    if (tier === 'basic') {
      router.push('/convert/pdf-to-docx');
      return;
    }

    if (tier === 'enterprise') {
      setIsEnterpriseOpen(true);
      return;
    }

    // Для Pro и Max открываем модальный шлюз Stripe Checkout
    setSelectedPlan(tier);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f2f2f4] text-off-black">
      <div className="px-4 sm:px-6 lg:px-8 pb-24 space-y-12">
        {/* Главный заголовок и Hero-блок страницы тарифов */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="signal-chip">{t('badges.plans')}</Badge>
            {/* <Badge variant="neutral">{t('badges.stripe')}</Badge>
            <Badge variant="muted">{t('badges.noFees')}</Badge> */}
          </div>

          <h1 className="text-[32px] sm:text-[42px] md:text-[50px] font-book tracking-tight text-off-black leading-[1.12]">
            {t('title')}
          </h1>

          <p className="text-[16px] sm:text-[18px] text-steel-gray font-book leading-relaxed">
            {t('subtitle')}
          </p>
        </div>

        {/* Переключатель периода Месяц / Год (ТЗ §3.2) */}
        <div className="flex justify-center pt-2">
          <PricingPeriodToggle
            value={billingPeriod}
            onChange={setBillingPeriod}
          />
        </div>

        {/* Сетка карточек тарифов (Базовый, Pro, Максимальный, Enterprise) */}
        <div className="pt-2">
          <PricingCardsGrid
            plans={plans}
            billingPeriod={billingPeriod}
            onSelectPlan={handleSelectPlan}
          />
        </div>

        {/* Гарантия безопасности и юрисдикция ЕС */}
        {/* <div className="rounded-[32px] md:rounded-[40px] border border-black/10 bg-pure-white p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-signal-blue/10 flex items-center justify-center shrink-0">
                <Server className="w-5 h-5 text-signal-blue" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[18px] font-regular text-off-black">
                  {t('guarantees.eu.title')}
                </h4>
                <p className="text-[16px] text-steel-gray font-book leading-snug">
                  {t('guarantees.eu.text')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[18px] font-regular text-off-black">
                  {t('guarantees.privacy.title')}
                </h4>
                <p className="text-[16px] text-steel-gray font-book leading-snug">
                  {t('guarantees.privacy.text')}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-black/[0.05] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-off-black" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[18px] font-regular text-off-black">
                  {t('guarantees.stripe.title')}
                </h4>
                <p className="text-[16px] text-steel-gray font-book leading-snug">
                  {t('guarantees.stripe.text')}
                </p>
              </div>
            </div>
          </div>
        </div> */}

        {/* Сводная таблица лимитов (Матрица параметров ТЗ §3.3) */}
        <div>
          <PricingComparisonTable groups={comparisonGroups} />
        </div>

        {/* Секция часто задаваемых вопросов */}
        <div>
          <PricingFaq items={faqItems} />
        </div>

        {/* Финальный призыв к действию */}
        <div className="rounded-[36px] md:rounded-[44px] bg-off-black text-pure-white p-8 md:p-12 text-center space-y-4">
          {/* <Badge
            variant="signal-chip"
            className="border-white/20 text-pure-white bg-white/10"
          >
            {t('cta.badge')}
          </Badge> */}
          <h3 className="text-[26px] md:text-[34px] font-book tracking-tight">
            {t('cta.title')}
          </h3>
          <p className="text-[16px] md:text-[18px] text-steel-gray font-book max-w-xl mx-auto leading-relaxed">
            {t('cta.subtitle')}
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => handleSelectPlan('pro')}
              variant="floating-cta"
              className="bg-signal-blue text-pure-white hover:bg-signal-blue/90 border-transparent h-11 px-6 text-[16px]"
            >
              {t('cta.connectPro')}
            </Button>
            <Link href="/convert/pdf-to-docx">
              <Button
                type="button"
                variant="secondary"
                className="bg-white/10 border-white/20 text-pure-white hover:bg-white/20 h-11 px-6 text-[16px]"
              >
                {t('cta.tryFree')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Модальное окно Stripe Checkout */}
      <StripeCheckoutModal
        open={isCheckoutOpen}
        onOpenChange={setIsCheckoutOpen}
        targetPlan={selectedPlan}
        billingPeriod={billingPeriod}
      />

      {/* Модальное окно запроса Enterprise */}
      <EnterpriseContactDialog
        open={isEnterpriseOpen}
        onOpenChange={setIsEnterpriseOpen}
      />
    </div>
  );
}
