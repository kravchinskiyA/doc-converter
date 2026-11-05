import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Navbar, Footer } from '@/shared/ui';
import { isLocale, routing } from '@/shared/i18n';
import { IntlProvider } from '@/_app/i18n';
import '@/_app/styles/globals.css';

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: Omit<LocaleLayoutProps, 'children'>): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};

  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  // Включает статический рендеринг для страниц под сегментом [locale]
  setRequestLocale(locale);

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-off-white text-off-black selection:bg-signal-blue/10 selection:text-signal-blue">
        <IntlProvider>
          <Navbar />
          <main className="flex-1 w-full max-w-content mx-auto px-4 md:px-8 py-8 md:py-16">
            {children}
          </main>
          <Footer />
        </IntlProvider>
      </body>
    </html>
  );
}
