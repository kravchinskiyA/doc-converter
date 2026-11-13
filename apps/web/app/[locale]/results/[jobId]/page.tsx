import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { ResultsPage } from '@/_pages';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; jobId: string }>;
}): Promise<Metadata> {
  const { locale, jobId } = await params;
  const t = await getTranslations({ locale, namespace: 'results' });

  return {
    title: `${t('metadata.title')} (${jobId})`,
    description: t('metadata.description'),
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; jobId: string }>;
}) {
  const { locale, jobId } = await params;
  setRequestLocale(locale);

  return <ResultsPage jobId={jobId} />;
}

