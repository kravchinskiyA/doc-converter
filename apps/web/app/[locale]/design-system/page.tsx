import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { DesignSystemPage } from '@/_pages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);

  const titles: Record<string, string> = {
    ru: 'Дизайн-система (Augen Pro) | Витрина компонентов',
    en: 'Design System (Augen Pro) | Component Showcase',
    uk: 'Дизайн-система (Augen Pro) | Вітрина компонентів',
  };

  const descriptions: Record<string, string> = {
    ru: 'Витрина компонентов, типографики и цветовой палитры интерфейса Augen Pro',
    en: 'Component showcase, typography, and color palette of the Augen Pro interface',
    uk: 'Вітрина компонентів, типографіки та палітри кольорів інтерфейсу Augen Pro',
  };

  return {
    title: `${titles[locale] ?? titles.en} | doc-converter`,
    description: descriptions[locale] ?? descriptions.en,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <DesignSystemPage />;
}
