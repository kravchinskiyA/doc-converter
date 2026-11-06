import { z } from 'zod';
import { PlanTierSchema, BillingPeriodSchema, type PlanTier } from './account.js';

/**
 * Фиксированные тарифные ставки в EUR (ТЗ §3.2).
 * Базовый: 0 €
 * Pro: 5 € / месяц, 51 € / год (скидка 15%, экономия 9 €)
 * Максимальный: 10 € / месяц, 102 € / год (скидка 15%, экономия 18 €)
 * Enterprise: Договорная
 */
export const TARIFF_PRICES_EUR = {
  basic: {
    monthly: 0,
    annual: 0,
    annualMonthlyEquivalent: 0,
    annualSavings: 0,
  },
  pro: {
    monthly: 5,
    annual: 51,
    annualMonthlyEquivalent: 4.25,
    annualSavings: 9,
  },
  max: {
    monthly: 10,
    annual: 102,
    annualMonthlyEquivalent: 8.5,
    annualSavings: 18,
  },
  enterprise: {
    monthly: null,
    annual: null,
    annualMonthlyEquivalent: null,
    annualSavings: null,
  },
} as const;

/**
 * Матрица лимитов тарифов (ТЗ §3.3–§3.7, §10.3).
 */
export interface PlanLimitsMatrix {
  tier: PlanTier;
  successfulDocsQuota: number | 'custom';
  successfulImagesQuota: number | 'custom';
  restoreCooldownHours: { guest: number; account: number };
  maxInputPdfBytes: number | 'custom';
  maxInputDocxBytes: number | 'custom';
  maxInputImageBytes: number | 'custom';
  maxBatchFiles: number | 'custom';
  maxBatchDocBytes: number | 'custom';
  maxBatchImageBytes: number | 'custom';
  storageBytes: number | 'custom';
  storageWarningPercent: number;
  retentionMonths: number;
  apiAccess: boolean;
  concurrencyLimit: number | 'custom';
  queueSlots: number | 'custom';
  pixelLimitMegapixels: number;
  maxSidePixels: number;
  ocrAccuracyCerPercent: number;
}

export const PLAN_LIMITS_MAP: Record<PlanTier, PlanLimitsMatrix> = {
  basic: {
    tier: 'basic',
    successfulDocsQuota: 5,
    successfulImagesQuota: 5,
    restoreCooldownHours: { guest: 12, account: 5 },
    maxInputPdfBytes: 2_000_000,
    maxInputDocxBytes: 5_000_000,
    maxInputImageBytes: 2_000_000,
    maxBatchFiles: 1,
    maxBatchDocBytes: 5_000_000,
    maxBatchImageBytes: 2_000_000,
    storageBytes: 5_000_000_000, // 5 ГБ (1 ГБ = 1_000_000_000 байт по ТЗ §3.3)
    storageWarningPercent: 75,
    retentionMonths: 6,
    apiAccess: true,
    concurrencyLimit: 1,
    queueSlots: 5,
    pixelLimitMegapixels: 40,
    maxSidePixels: 12_000,
    ocrAccuracyCerPercent: 2,
  },
  pro: {
    tier: 'pro',
    successfulDocsQuota: 30,
    successfulImagesQuota: 30,
    restoreCooldownHours: { guest: 12, account: 2 },
    maxInputPdfBytes: 30_000_000,
    maxInputDocxBytes: 30_000_000,
    maxInputImageBytes: 25_000_000,
    maxBatchFiles: 5,
    maxBatchDocBytes: 150_000_000,
    maxBatchImageBytes: 125_000_000,
    storageBytes: 15_000_000_000, // 15 ГБ
    storageWarningPercent: 75,
    retentionMonths: 6,
    apiAccess: true,
    concurrencyLimit: 2,
    queueSlots: 5,
    pixelLimitMegapixels: 40,
    maxSidePixels: 12_000,
    ocrAccuracyCerPercent: 2,
  },
  max: {
    tier: 'max',
    successfulDocsQuota: 100,
    successfulImagesQuota: 100,
    restoreCooldownHours: { guest: 12, account: 2 },
    maxInputPdfBytes: 100_000_000,
    maxInputDocxBytes: 100_000_000,
    maxInputImageBytes: 50_000_000,
    maxBatchFiles: 5,
    maxBatchDocBytes: 500_000_000,
    maxBatchImageBytes: 250_000_000,
    storageBytes: 50_000_000_000, // 50 ГБ
    storageWarningPercent: 75,
    retentionMonths: 6,
    apiAccess: true,
    concurrencyLimit: 3,
    queueSlots: 5,
    pixelLimitMegapixels: 40,
    maxSidePixels: 12_000,
    ocrAccuracyCerPercent: 2,
  },
  enterprise: {
    tier: 'enterprise',
    successfulDocsQuota: 'custom',
    successfulImagesQuota: 'custom',
    restoreCooldownHours: { guest: 12, account: 0 },
    maxInputPdfBytes: 'custom',
    maxInputDocxBytes: 'custom',
    maxInputImageBytes: 'custom',
    maxBatchFiles: 'custom',
    maxBatchDocBytes: 'custom',
    maxBatchImageBytes: 'custom',
    storageBytes: 'custom',
    storageWarningPercent: 75,
    retentionMonths: 6,
    apiAccess: true,
    concurrencyLimit: 'custom',
    queueSlots: 'custom',
    pixelLimitMegapixels: 40,
    maxSidePixels: 12_000,
    ocrAccuracyCerPercent: 2,
  },
};

/**
 * Схема запроса на создание сессии Stripe Checkout (ТЗ §11.1).
 * Доступно только для подтвержденных email.
 */
export const createCheckoutSessionSchema = z.object({
  plan: z.enum(['pro', 'max']),
  billingPeriod: BillingPeriodSchema,
  successUrl: z.string().url().optional(),
  cancelUrl: z.string().url().optional(),
});
export type CreateCheckoutSessionInput = z.infer<typeof createCheckoutSessionSchema>;

/**
 * Схема ответа создания сессии Stripe Checkout.
 */
export const checkoutSessionResponseSchema = z.object({
  sessionId: z.string(),
  checkoutUrl: z.string().url(),
  customerEmail: z.string().email(),
  plan: PlanTierSchema,
  billingPeriod: BillingPeriodSchema,
  amountEur: z.number().positive(),
  currency: z.literal('EUR'),
  expiresAt: z.string(),
});
export type CheckoutSessionResponse = z.infer<typeof checkoutSessionResponseSchema>;

/**
 * Схема запроса обращения по Enterprise-тарифу (ТЗ §11.14).
 */
export const enterpriseInquirySchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  companyName: z.string().min(1).max(100),
  estimatedMonthlyDocs: z.number().nonnegative().optional(),
  message: z.string().max(2000).optional(),
});
export type EnterpriseInquiryInput = z.infer<typeof enterpriseInquirySchema>;
