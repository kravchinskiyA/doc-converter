import type { ReactNode } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

/**
 * Передаёт словарь текущей локали клиентским компонентам (`useTranslations` в `'use client'`).
 */
export async function IntlProvider({ children }: { children: ReactNode }) {
  const messages = await getMessages();

  return <NextIntlClientProvider messages={messages}>{children}</NextIntlClientProvider>;
}

