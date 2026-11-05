import { getRequestConfig } from 'next-intl/server';
import { isLocale, loadMessages, routing } from '@/shared/i18n';

/**
 * Конфигурация next-intl для каждого серверного запроса.
 * Подключается плагином `createNextIntlPlugin` в `next.config.ts`.
 */
export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale = isLocale(requested) ? requested : routing.defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
    timeZone: 'Europe/Kyiv',
  };
});

