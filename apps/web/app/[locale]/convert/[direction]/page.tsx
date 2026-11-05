import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { routing } from '@/shared/i18n/routing';
import { ConvertPage } from '@/_pages';
import { ConversionDirectionSchema, type ConversionDirection } from '@doc-converter/contracts';

const VALID_DIRECTIONS: ConversionDirection[] = [
  'pdf-to-docx',
  'docx-to-pdf',
  'images-to-pdf',
  'pdf-to-images',
  'pdf-to-jpg',
  'pdf-to-webp',
];

export function generateStaticParams() {
  const params: { locale: string; direction: string }[] = [];

  for (const locale of routing.locales) {
    for (const direction of VALID_DIRECTIONS) {
      params.push({ locale, direction });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; direction: string }>;
}): Promise<Metadata> {
  const { locale, direction } = await params;
  const parsed = ConversionDirectionSchema.safeParse(direction);
  if (!parsed.success) {
    return { title: 'doc-converter' };
  }

  const t = await getTranslations({ locale, namespace: 'convert' });

  let title = t('directions.pdfToDocx.title');
  let description = t('directions.pdfToDocx.subtitle');

  if (direction === 'docx-to-pdf') {
    title = t('directions.docxToPdf.title');
    description = t('directions.docxToPdf.subtitle');
  } else if (direction === 'images-to-pdf') {
    title = t('directions.imagesToPdf.title');
    description = t('directions.imagesToPdf.subtitle');
  } else if (['pdf-to-images', 'pdf-to-jpg', 'pdf-to-webp'].includes(direction)) {
    title = t('directions.pdfToImages.title');
    description = t('directions.pdfToImages.subtitle');
  }

  return {
    title: `${title} | doc-converter`,
    description,
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: string; direction: string }>;
}) {
  const { locale, direction } = await params;
  setRequestLocale(locale);

  const parsed = ConversionDirectionSchema.safeParse(direction);
  if (!parsed.success) {
    notFound();
  }

  return <ConvertPage direction={parsed.data} />;
}
