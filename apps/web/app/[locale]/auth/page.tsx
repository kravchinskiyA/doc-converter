import { setRequestLocale } from 'next-intl/server';
import { redirect } from '@/shared/i18n';

export default async function AuthIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  redirect({ href: '/auth/login', locale });
}

