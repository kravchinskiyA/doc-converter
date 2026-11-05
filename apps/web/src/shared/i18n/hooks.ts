import { useCallback } from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import type { Messages } from './messages';

/** Стабильные машинные коды ошибок API, для которых есть перевод. */
export type ApiErrorCode = keyof Messages['errors']['codes'];

type ErrorsTranslator = ReturnType<typeof useTranslations<'errors'>>;

function isApiErrorCode(t: ErrorsTranslator, code: string): code is ApiErrorCode {
  return t.has(`codes.${code}` as `codes.${ApiErrorCode}`);
}

/**
 * Переводит машинный код ошибки сервера в понятное сообщение.
 * Текст исключения сервера никогда не показывается пользователю: неизвестный код → `UNKNOWN`.
 */
export function useErrorMessage(): (code: string | null | undefined) => string {
  const t = useTranslations('errors');
  return useCallback(
    (code) => {
      if (code && isApiErrorCode(t, code)) {
        return t(`codes.${code}`);
      }
      return t('codes.UNKNOWN');
    },
    [t],
  );
}

const KILOBYTE = 1024;
const MEGABYTE = 1024 * 1024;

/** Локализованное форматирование размера файла (разделители и единицы по локали). */
export function useFormatFileSize(): (bytes: number) => string {
  const t = useTranslations('common.fileSize');
  const format = useFormatter();
  return useCallback(
    (bytes) => {
      if (bytes < KILOBYTE) {
        return t('bytes', { value: format.number(bytes) });
      }
      if (bytes < MEGABYTE) {
        return t('kilobytes', { value: format.number(bytes / KILOBYTE, { maximumFractionDigits: 1 }) });
      }
      return t('megabytes', { value: format.number(bytes / MEGABYTE, { maximumFractionDigits: 1 }) });
    },
    [t, format],
  );
}

