import type { PlanTier, BillingPeriod } from '@doc-converter/contracts';

export type PricingBillingPeriod = BillingPeriod;
export type PricingPlanTier = PlanTier;

export type SimulatedAuthStatus = 'verified' | 'unverified' | 'guest';

export interface CheckoutModalState {
  isOpen: boolean;
  targetPlan: 'pro' | 'max' | null;
  billingPeriod: PricingBillingPeriod;
  step: 'checkout' | 'processing' | 'success' | 'warning';
  warningType?: 'guest' | 'unverified';
}

export interface EnterpriseModalState {
  isOpen: boolean;
  isSubmitted: boolean;
}

export interface PlanFeatureItem {
  text: string;
  included: boolean;
  highlight?: boolean;
}

export interface PlanCardData {
  tier: PricingPlanTier;
  title: string;
  tagline: string;
  badge?: string;
  badgeVariant?: 'signal-chip' | 'neutral' | 'muted' | 'success';
  monthlyPriceEur: number | null;
  annualPriceEur: number | null;
  annualMonthlyEquivalentEur: number | null;
  annualSavingsEur: number | null;
  isPopular?: boolean;
  ctaText: string;
  ctaVariant: 'floating-cta' | 'outline' | 'secondary';
  features: PlanFeatureItem[];
}

export interface LimitCategoryRow {
  parameter: string;
  basic: string;
  pro: string;
  max: string;
  enterprise: string;
  tooltip?: string;
}

export interface LimitCategoryGroup {
  groupTitle: string;
  rows: LimitCategoryRow[];
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}
