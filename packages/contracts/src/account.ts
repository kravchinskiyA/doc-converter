import { z } from 'zod';
import { emailCodeSchema, emailSchema, passwordSchema } from './auth.js';

/**
 * Тарифные планы (ТЗ §3.2, §3.3).
 */
export const PlanTierSchema = z.enum(['basic', 'pro', 'max', 'enterprise']);
export type PlanTier = z.infer<typeof PlanTierSchema>;

/**
 * Период оплаты подписки (ТЗ §11.1).
 */
export const BillingPeriodSchema = z.enum(['monthly', 'annual']);
export type BillingPeriod = z.infer<typeof BillingPeriodSchema>;

/**
 * Лимиты хранилища по тарифам (ТЗ §10.3).
 * Базовый: 5 ГБ, Pro: 15 ГБ, Максимальный: 50 ГБ.
 */
export const STORAGE_LIMITS_BYTES: Record<PlanTier, number> = {
  basic: 5 * 1024 * 1024 * 1024,
  pro: 15 * 1024 * 1024 * 1024,
  max: 50 * 1024 * 1024 * 1024,
  enterprise: 200 * 1024 * 1024 * 1024,
};

/**
 * Схема профиля пользователя (ТЗ §5.4).
 */
export const userProfileSchema = z.object({
  id: z.string(),
  email: emailSchema,
  firstName: z.string().max(50).optional().default(''),
  lastName: z.string().max(50).optional().default(''),
  emailVerified: z.boolean().default(true),
  createdAt: z.string(),
});
export type UserProfile = z.infer<typeof userProfileSchema>;

/**
 * Редактирование имени и фамилии (ТЗ §5.4).
 */
export const updateProfileSchema = z.object({
  firstName: z.string().max(50, 'maxFirstNameLength').optional().or(z.literal('')),
  lastName: z.string().max(50, 'maxLastNameLength').optional().or(z.literal('')),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

/**
 * Инициация двухэтапной смены email: шаг 1 — отправка кода на старую почту (ТЗ §6.2).
 */
export const initEmailChangeSchema = z.object({
  newEmail: emailSchema,
});
export type InitEmailChangeInput = z.infer<typeof initEmailChangeSchema>;

/**
 * Шаг 1 смены email: подтверждение старой почты 6-значным кодом (ТЗ §6.2).
 */
export const verifyOldEmailStepSchema = z.object({
  currentEmailCode: emailCodeSchema,
});
export type VerifyOldEmailStepInput = z.infer<typeof verifyOldEmailStepSchema>;

/**
 * Шаг 2 смены email: подтверждение новой почты и завершение смены (ТЗ §6.2).
 */
export const completeEmailChangeSchema = z.object({
  newEmailCode: emailCodeSchema,
  terminateSessionsAndApiKey: z.boolean().default(true),
});
export type CompleteEmailChangeInput = z.infer<typeof completeEmailChangeSchema>;

/**
 * Смена пароля из личного кабинета с кодом подтверждения на почту (ТЗ §6.3).
 */
export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'required'),
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'required'),
    code: emailCodeSchema,
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'passwordsMismatch',
    path: ['confirmNewPassword'],
  });
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

/**
 * Состояние API-ключа пользователя (ТЗ §7).
 */
export const apiKeyInfoSchema = z.object({
  hasKey: z.boolean(),
  keyPreview: z.string().optional(),
  createdAt: z.string().optional(),
  hasActiveConversions: z.boolean().default(false),
});
export type ApiKeyInfo = z.infer<typeof apiKeyInfoSchema>;

/**
 * Замена (ротация) API-ключа с кодом подтверждения (ТЗ §7).
 */
export const rotateApiKeySchema = z.object({
  code: emailCodeSchema,
});
export type RotateApiKeyInput = z.infer<typeof rotateApiKeySchema>;

/**
 * Сведения о квоте хранилища (ТЗ §10.3).
 */
export const storageQuotaSchema = z.object({
  usedBytes: z.number().nonnegative(),
  totalBytes: z.number().positive(),
  plan: PlanTierSchema,
  warningThresholdBytes: z.number().positive(),
  isOver75: z.boolean(),
  isOver100: z.boolean(),
  fileCount: z.number().nonnegative(),
});
export type StorageQuota = z.infer<typeof storageQuotaSchema>;

/**
 * Сохраненный результат конвертации (ТЗ §10.1).
 */
export const savedFileSchema = z.object({
  id: z.string(),
  name: z.string(),
  format: z.string(),
  sizeBytes: z.number().positive(),
  createdAt: z.string(),
  expiresAt: z.string(),
  source: z.enum(['web', 'api']),
  downloadUrl: z.string(),
});
export type SavedFile = z.infer<typeof savedFileSchema>;

/**
 * Запрос сотрудника поддержки на просмотр файлов (ТЗ §12.17).
 */
export const supportAccessRequestSchema = z.object({
  id: z.string(),
  staffName: z.string(),
  staffEmail: z.string(),
  reason: z.string(),
  fileIds: z.array(z.string()),
  fileNames: z.array(z.string()),
  status: z.enum(['pending', 'active', 'revoked', 'expired']),
  requestedAt: z.string(),
  expiresAt: z.string(),
});
export type SupportAccessRequest = z.infer<typeof supportAccessRequestSchema>;

/**
 * Подтверждение служебного доступа кодом на email (ТЗ §12.17).
 */
export const confirmSupportAccessSchema = z.object({
  requestId: z.string(),
  code: emailCodeSchema,
});
export type ConfirmSupportAccessInput = z.infer<typeof confirmSupportAccessSchema>;

/**
 * Отзыв служебного доступа пользователем (ТЗ §12.17).
 */
export const revokeSupportAccessSchema = z.object({
  requestId: z.string(),
});
export type RevokeSupportAccessInput = z.infer<typeof revokeSupportAccessSchema>;

/**
 * Выпуск или перевыпуск 10 резервных кодов восстановления (ТЗ §6.5).
 */
export const generateRecoveryCodesSchema = z.object({
  code: emailCodeSchema,
});
export type GenerateRecoveryCodesInput = z.infer<typeof generateRecoveryCodesSchema>;

/**
 * Подробности подписки (ТЗ §11.1–§11.3).
 */
export const subscriptionDetailsSchema = z.object({
  plan: PlanTierSchema,
  billingPeriod: BillingPeriodSchema,
  priceEur: z.number().nonnegative(),
  autoRenew: z.boolean(),
  currentPeriodEnd: z.string(),
  cancelAtPeriodEnd: z.boolean().default(false),
  status: z.enum(['active', 'grace_period', 'canceled', 'expired']),
  pendingRefundAmountEur: z.number().optional(),
});
export type SubscriptionDetails = z.infer<typeof subscriptionDetailsSchema>;

/**
 * Немедленная отмена подписки с расчетом возврата (ТЗ §11.2).
 */
export const cancelSubscriptionSchema = z.object({
  confirmCancellation: z.boolean().refine((val) => val === true, {
    message: 'confirmRequired',
  }),
  reason: z.string().optional(),
});
export type CancelSubscriptionInput = z.infer<typeof cancelSubscriptionSchema>;

/**
 * Смена тарифного плана (повышение с доплатой или понижение с возвратом, ТЗ §11.3).
 */
export const changeSubscriptionPlanSchema = z.object({
  targetPlan: PlanTierSchema,
  billingPeriod: BillingPeriodSchema,
});
export type ChangeSubscriptionPlanInput = z.infer<typeof changeSubscriptionPlanSchema>;

/**
 * Удаление аккаунта (ТЗ §6.4).
 */
export const deleteAccountSchema = z.object({
  code: emailCodeSchema,
  understoodLoss: z.boolean().refine((val) => val === true, {
    message: 'understoodLossRequired',
  }),
});
export type DeleteAccountInput = z.infer<typeof deleteAccountSchema>;

