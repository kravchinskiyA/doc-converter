import { redirect } from '@/shared/i18n';
import { setRequestLocale } from 'next-intl/server';

export default async function ConvertRootPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  redirect({ href: '/convert/pdf-to-docx', locale });
}

