import { defineRouting } from 'next-intl/routing';

/**
 * Единая конфигурация локализованной маршрутизации.
 * Используется middleware, серверной конфигурацией запроса и навигационными API.
 * `uk` — язык по умолчанию; префикс локали присутствует всегда (`/uk`, `/ru`, `/en`).
 */
export const routing = defineRouting({
  locales: ['uk', 'ru', 'en'],
  defaultLocale: 'uk',
  localePrefix: 'always',
});

export type Locale = (typeof routing.locales)[number];

export function isLocale(value: unknown): value is Locale {
  return typeof value === 'string' && (routing.locales as readonly string[]).includes(value);
}

