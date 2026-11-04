import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { Navbar, Footer } from '@/shared/ui';
import '@/_app/styles/globals.css';

export const metadata: Metadata = {
  title: 'doc-converter | Приватный конвертер документов и изображений',
  description: 'SaaS-сервер конвертации PDF, DOCX и изображений на собственных серверах в ЕС',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="min-h-screen flex flex-col bg-off-white text-off-black selection:bg-signal-blue/10 selection:text-signal-blue">
        <Navbar locale={locale} />
        <main className="flex-1 w-full max-w-content mx-auto px-4 md:px-8 py-8 md:py-16">
          {children}
        </main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
