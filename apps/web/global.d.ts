import type { Messages } from '@/shared/i18n';

declare global {
  /** Строгая типизация ключей next-intl по эталонному словарю `uk.json`. */
  interface IntlMessages extends Messages {}
}
