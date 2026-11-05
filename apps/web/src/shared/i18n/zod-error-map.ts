import { useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import type { Messages } from './messages';

export type ValidationMessageKey = keyof Messages['validation'];

type ValidationTranslator = ReturnType<typeof useTranslations<'validation'>>;

type ValidationValues = Record<string, string | number>;

function isValidationKey(t: ValidationTranslator, value: unknown): value is ValidationMessageKey {
  return typeof value === 'string' && t.has(value as ValidationMessageKey);
}

/**
 * Параметры для `.refine()` / `.superRefine()` с переводимым сообщением.
 *
 * @example
 * schema.refine((v) => v.password === v.confirmPassword, i18nIssue('passwordsMismatch', ['confirmPassword']))
 */
export function i18nIssue(
  key: ValidationMessageKey,
  path?: (string | number)[],
  values?: ValidationValues,
): z.CustomErrorParams {
  return { path, params: { i18nKey: key, values } };
}

/**
 * Создаёт `ZodErrorMap`, переводящий стандартные ошибки Zod через словарь `validation`.
 * Явно заданное в схеме сообщение (`message`) имеет приоритет над картой ошибок.
 */
export function createZodErrorMap(t: ValidationTranslator): z.ZodErrorMap {
  return (issue) => {
    switch (issue.code) {
      case z.ZodIssueCode.invalid_type:
        if (issue.received === z.ZodParsedType.undefined || issue.received === z.ZodParsedType.null) {
          return { message: t('required') };
        }
        if (issue.expected === z.ZodParsedType.integer) {
          return { message: t('notInteger') };
        }
        return { message: t('invalidType') };

      case z.ZodIssueCode.invalid_string:
        if (issue.validation === 'email') return { message: t('invalidEmail') };
        if (issue.validation === 'url') return { message: t('invalidUrl') };
        return { message: t('invalidFormat') };

      case z.ZodIssueCode.too_small: {
        const minimum = Number(issue.minimum);
        if (issue.type === 'string') {
          if (issue.exact) return { message: t('stringExact', { length: minimum }) };
          if (minimum <= 1) return { message: t('required') };
          return { message: t('stringTooShort', { minimum }) };
        }
        if (issue.type === 'number' || issue.type === 'bigint') {
          return { message: t('numberTooSmall', { minimum }) };
        }
        if (issue.type === 'array' || issue.type === 'set') {
          return { message: t('arrayTooSmall', { minimum }) };
        }
        return { message: t('invalidDate') };
      }

      case z.ZodIssueCode.too_big: {
        const maximum = Number(issue.maximum);
        if (issue.type === 'string') {
          if (issue.exact) return { message: t('stringExact', { length: maximum }) };
          return { message: t('stringTooLong', { maximum }) };
        }
        if (issue.type === 'number' || issue.type === 'bigint') {
          return { message: t('numberTooBig', { maximum }) };
        }
        if (issue.type === 'array' || issue.type === 'set') {
          return { message: t('arrayTooBig', { maximum }) };
        }
        return { message: t('invalidDate') };
      }

      case z.ZodIssueCode.invalid_enum_value:
      case z.ZodIssueCode.invalid_literal:
        return { message: t('invalidEnum') };

      case z.ZodIssueCode.invalid_date:
        return { message: t('invalidDate') };

      case z.ZodIssueCode.custom: {
        const params: Record<string, unknown> = issue.params ?? {};
        const key = params.i18nKey;
        if (isValidationKey(t, key)) {
          const values = params.values;
          return {
            message:
              typeof values === 'object' && values !== null
                ? t(key, values as ValidationValues)
                : t(key),
          };
        }
        break;
      }

      default:
        break;
    }

    return { message: t('default') };
  };
}

/**
 * Карта ошибок Zod для текущей локали (клиентские формы).
 *
 * @example
 * const errorMap = useZodErrorMap();
 * useForm({ resolver: zodResolver(schema, { errorMap }) });
 */
export function useZodErrorMap(): z.ZodErrorMap {
  const t = useTranslations('validation');
  return useMemo(() => createZodErrorMap(t), [t]);
}

