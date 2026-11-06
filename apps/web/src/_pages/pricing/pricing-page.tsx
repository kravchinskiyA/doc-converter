'use client';

import * as React from 'react';
import {
  ShieldCheck,
  CreditCard,
  Server,
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Link, useRouter } from '@/shared/i18n';
import {
  PRICING_PLANS,
  LIMITS_COMPARISON_GROUPS,
  PRICING_FAQ_ITEMS,
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
  const router = useRouter();
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
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-24 space-y-12">
        {/* Главный заголовок и Hero-блок страницы тарифов */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge variant="signal-chip">Тарифные планы</Badge>
            <Badge variant="neutral">Stripe Billing</Badge>
            <Badge variant="muted">Без скрытых комиссий</Badge>
          </div>

          <h1 className="text-[32px] sm:text-[42px] md:text-[50px] font-book tracking-tight text-off-black leading-[1.12]">
            Прозрачные тарифы для любых задач конвертации
          </h1>

          <p className="text-[15px] sm:text-[17px] text-steel-gray font-book leading-relaxed">
            От бесплатного базового режима для редких документов до высокопроизводительных тарифов
            с быстрым двухчасовым восстановлением квот и параллельной обработкой.
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
            plans={PRICING_PLANS}
            billingPeriod={billingPeriod}
            onSelectPlan={handleSelectPlan}
          />
        </div>

        {/* Гарантия безопасности и юрисдикция ЕС */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-signal-blue/10 flex items-center justify-center shrink-0">
                <Server className="w-5 h-5 text-signal-blue" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[15px] font-regular text-off-black">
                  Строго в регионе ЕС
                </h4>
                <p className="text-[13px] text-steel-gray font-book leading-snug">
                  Все серверы, базы данных и хранилище S3 размещены в Германии и Франции под защитой GDPR.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[15px] font-regular text-off-black">
                  Абсолютная приватность
                </h4>
                <p className="text-[13px] text-steel-gray font-book leading-snug">
                  Ни один документ не передается во внешние AI/OCR API. Вся обработка — только на изолированных ядрах.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="h-10 w-10 rounded-2xl bg-black/[0.05] flex items-center justify-center shrink-0">
                <CreditCard className="w-5 h-5 text-off-black" />
              </div>
              <div className="space-y-1">
                <h4 className="text-[15px] font-regular text-off-black">
                  Безопасный Stripe
                </h4>
                <p className="text-[13px] text-steel-gray font-book leading-snug">
                  Оплата банковскими картами через Stripe. Налоги включены, досрочный возврат за неиспользованные дни.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Сводная таблица лимитов (Матрица параметров ТЗ §3.3) */}
        <div>
          <PricingComparisonTable groups={LIMITS_COMPARISON_GROUPS} />
        </div>

        {/* Секция часто задаваемых вопросов */}
        <div>
          <PricingFaq items={PRICING_FAQ_ITEMS} />
        </div>

        {/* Финальный призыв к действию */}
        <div className="rounded-[36px] md:rounded-[44px] bg-off-black text-pure-white p-8 md:p-12 text-center space-y-4">
          <Badge
            variant="signal-chip"
            className="border-white/20 text-pure-white bg-white/10"
          >
            Мгновенный старт
          </Badge>
          <h3 className="text-[26px] md:text-[34px] font-book tracking-tight">
            Готовы конвертировать документы без потерь?
          </h3>
          <p className="text-[14px] md:text-[16px] text-steel-gray font-book max-w-xl mx-auto leading-relaxed">
            Попробуйте базовый режим без регистрации или подключите тариф Pro для работы с большими файлами и OCR.
          </p>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => handleSelectPlan('pro')}
              variant="floating-cta"
              className="bg-signal-blue text-pure-white hover:bg-signal-blue/90 border-transparent h-11 px-6 text-[14px]"
            >
              Подключить тариф Pro
            </Button>
            <Link href="/convert/pdf-to-docx">
              <Button
                type="button"
                variant="secondary"
                className="bg-white/10 border-white/20 text-pure-white hover:bg-white/20 h-11 px-6 text-[14px]"
              >
                Попробовать бесплатно
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
