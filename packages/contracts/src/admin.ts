import { z } from 'zod';
import { emailSchema, passwordSchema } from './auth.js';

/**
 * Роли служебного персонала (ТЗ §12.15).
 * - support: просмотр данных пользователя, лимитов, заданий и оплат для разбора обращений.
 * - admin: все права поддержки + системные метрики, журналы, управление служебными аккаунтами,
 *          приостановка конвертаций, отзыв API-ключей, повтор возвратов Stripe.
 */
export const staffRoleSchema = z.enum(['admin', 'support']);
export type StaffRole = z.infer<typeof staffRoleSchema>;

/**
 * Схема формы входа для персонала с обязательным 2FA (ТЗ §12.15, §12.19).
 * Требуются email, пароль и 6-значный TOTP-код приложения-аутентификатора
 * либо служебный резервный код восстановления.
 */
export const staffLoginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  totpCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, 'totpCodeFormat')
    .optional(),
  recoveryCode: z
    .string()
    .trim()
    .min(8, 'recoveryCodeFormat')
    .max(32, 'recoveryCodeFormat')
    .optional(),
  useRecoveryCode: z.boolean().default(false),
}).refine(
  (data) => {
    if (data.useRecoveryCode) {
      return Boolean(data.recoveryCode && data.recoveryCode.length >= 8);
    }
    return Boolean(data.totpCode && /^\d{6}$/.test(data.totpCode));
  },
  {
    message: 'secondFactorRequired',
    path: ['totpCode'],
  }
);

export type StaffLoginInput = z.infer<typeof staffLoginSchema>;

/**
 * Схема экстренной глобальной приостановки / возобновления конвертаций (ТЗ §12.16).
 * Обязательное указание причины (минимум 10 символов) для фиксации в журнале 90 дней.
 */
export const emergencyGlobalPauseSchema = z.object({
  isPaused: z.boolean(),
  reason: z
    .string()
    .trim()
    .min(10, 'reasonMinLength')
    .max(500, 'reasonMaxLength'),
});

export type EmergencyGlobalPauseInput = z.infer<typeof emergencyGlobalPauseSchema>;

/**
 * Схема приостановки / возобновления конвертаций конкретного пользователя (ТЗ §12.16).
 * Обязательное указание причины (минимум 10 символов).
 */
export const emergencyUserPauseSchema = z.object({
  userId: z.string().min(1, 'userIdRequired'),
  isPaused: z.boolean(),
  reason: z
    .string()
    .trim()
    .min(10, 'reasonMinLength')
    .max(500, 'reasonMaxLength'),
});

export type EmergencyUserPauseInput = z.infer<typeof emergencyUserPauseSchema>;

/**
 * Схема отзыва пользовательского API-ключа администратором (ТЗ §12.16).
 * Значение ключа администратору не раскрывается; отзыв требует указания причины.
 */
export const emergencyRevokeApiKeySchema = z.object({
  userId: z.string().min(1, 'userIdRequired'),
  reason: z
    .string()
    .trim()
    .min(10, 'reasonMinLength')
    .max(500, 'reasonMaxLength'),
});

export type EmergencyRevokeApiKeyInput = z.infer<typeof emergencyRevokeApiKeySchema>;

/**
 * Схема повтора неуспешного возврата Stripe без изменения суммы (ТЗ §11.10, §12.16).
 */
export const retryFailedRefundSchema = z.object({
  paymentId: z.string().min(1, 'paymentIdRequired'),
});

export type RetryFailedRefundInput = z.infer<typeof retryFailedRefundSchema>;

/**
 * Метрики сервиса (очереди BullMQ, S3, ClamAV, Redis, БД).
 */
export const serviceMetricsSchema = z.object({
  bullmq: z.object({
    status: z.enum(['healthy', 'degraded', 'paused']),
    activeJobs: z.number().int().nonnegative(),
    waitingJobs: z.number().int().nonnegative(),
    completedJobsToday: z.number().int().nonnegative(),
    failedJobsToday: z.number().int().nonnegative(),
    delayedJobs: z.number().int().nonnegative(),
    concurrencyCurrent: z.number().int().nonnegative(),
    concurrencyMax: z.number().int().positive(), // 5 по ТЗ §12.1
    avgDurationMs: z.number().nonnegative(),
  }),
  storageS3: z.object({
    region: z.literal('eu-central-1'),
    encryption: z.literal('SSE-KMS'),
    tempUsedBytes: z.number().nonnegative(), // temp/ (12ч TTL)
    resultsUsedBytes: z.number().nonnegative(), // results/ (6 мес)
    totalObjects: z.number().int().nonnegative(),
    cleanedTodayCount: z.number().int().nonnegative(),
  }),
  clamav: z.object({
    status: z.enum(['online', 'updating', 'offline']),
    signaturesVersion: z.string(),
    scannedTodayCount: z.number().int().nonnegative(),
    threatsBlockedTodayCount: z.number().int().nonnegative(),
    lastHeartbeat: z.string(),
  }),
  infrastructure: z.object({
    globalConversionsPaused: z.boolean(),
    globalPauseReason: z.string().nullable(),
    globalPauseAt: z.string().nullable(),
    globalPauseBy: z.string().nullable(),
    redisStatus: z.enum(['connected', 'disconnected']),
    redisMemoryUsedMb: z.number().nonnegative(),
    dbConnectionsActive: z.number().int().nonnegative(),
    dbConnectionsMax: z.number().int().positive(),
  }),
});

export type ServiceMetrics = z.infer<typeof serviceMetricsSchema>;
