import type uk from './messages/uk.json';
import type { Locale } from './routing';

/** Структура словаря. Эталон — украинский словарь (язык по умолчанию). */
export type Messages = typeof uk;

/**
 * Ленивые загрузчики словарей. Типизация `Record<Locale, ...>` гарантирует, что
 * словарь каждой локали содержит все ключи эталонного (`uk`) — иначе ошибка typecheck.
 */
const messageLoaders: Record<Locale, () => Promise<{ default: Messages }>> = {
  uk: () => import('./messages/uk.json'),
  ru: () => import('./messages/ru.json'),
  en: () => import('./messages/en.json'),
};

export async function loadMessages(locale: Locale): Promise<Messages> {
  const loaded = await messageLoaders[locale]();
  return loaded.default;
}

