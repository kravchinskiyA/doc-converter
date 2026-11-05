import { setRequestLocale, getTranslations } from 'next-intl/server';
import type { LucideIcon } from 'lucide-react';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { Badge } from '@/shared/ui';
import { QuickConverter } from '@/features/quick-converter';

const FEATURES: { key: 'eu' | 'ocr' | 'cleanup'; Icon: LucideIcon }[] = [
  { key: 'eu', Icon: ShieldCheck },
  { key: 'ocr', Icon: Zap },
  { key: 'cleanup', Icon: Lock },
];

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');

  return (
    <div className="space-y-[90px] py-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center">
        <Badge variant="signal-chip" className="mb-6">
          {t('badge')}
        </Badge>
        <h1 className="text-[32px] md:text-[44px] font-book tracking-tight text-off-black max-w-[800px] leading-[1.15] mb-4">
          {t('title')}
        </h1>
        <p className="text-[16px] md:text-[18px] font-book tracking-tight text-steel-gray max-w-[620px] mb-10">
          {t('subtitle')}
        </p>

        {/* Главная интерактивная карточка — Блок Drag-and-Drop «Документы» */}
        <QuickConverter />
      </section>

      {/* Преимущества — 3 колонки без теней */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {FEATURES.map(({ key, Icon }) => (
          <div
            key={key}
            className="rounded-[24px] border-[0.5px] border-black/[0.06] bg-pure-white p-7 space-y-3"
          >
            <div className="h-9 w-9 rounded-full bg-signal-blue/5 flex items-center justify-center text-signal-blue">
              <Icon className="h-5 w-5 stroke-[1.5]" />
            </div>
            <h3 className="text-[18px] font-book text-off-black tracking-tight">
              {t(`features.${key}.title`)}
            </h3>
            <p className="text-[14px] font-book text-steel-gray leading-relaxed">
              {t(`features.${key}.text`)}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}
