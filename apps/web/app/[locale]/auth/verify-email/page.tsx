import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { VerifyEmailPage } from '@/_pages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'auth.verifyEmail' });

  return {
    title: `${t('title')} | doc-converter`,
    description: t('subtitle'),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return <VerifyEmailPage />;
}

