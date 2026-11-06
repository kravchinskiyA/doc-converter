import type {
  PlanTier,
  BillingPeriod,
  SupportAccessRequest,
} from '@doc-converter/contracts';

export type AccountTabKey =
  | 'profile'
  | 'storage'
  | 'files'
  | 'apiKey'
  | 'subscription'
  | 'recovery'
  | 'support'
  | 'danger';

export interface PaymentTransactionItem {
  id: string;
  date: string;
  description: string;
  amountEur: number;
  type: 'charge' | 'refund' | 'upgrade_proration' | 'downgrade_refund';
  status: 'succeeded' | 'pending' | 'failed';
  invoiceUrl?: string;
}

export interface EmailChangeFlowState {
  isOpen: boolean;
  step: 'init' | 'step1_old_email' | 'step2_new_email' | 'completed';
  newEmail: string;
  oldEmailCode: string;
  newEmailCode: string;
  terminateSessionsAndApiKey: boolean;
  timeLeftSeconds: number; // Общий таймер 20 минут (1200 сек)
  error?: string;
  isSubmitting: boolean;
}

export interface PasswordChangeFlowState {
  isOpen: boolean;
  step: 'input' | 'verify_code' | 'completed';
  currentPassword: string;
  newPassword: string;
  confirmNewPassword: string;
  emailCode: string;
  error?: string;
  isSubmitting: boolean;
}

export interface ApiKeyRotateFlowState {
  isOpen: boolean;
  step: 'confirm' | 'completed';
  emailCode: string;
  error?: string;
  isSubmitting: boolean;
}

export interface RecoveryCodesFlowState {
  isOpen: boolean;
  step: 'request_code' | 'display_codes';
  emailCode: string;
  codes: string[];
  hasConfirmedSaved: boolean;
  error?: string;
  isSubmitting: boolean;
}

export interface SupportAccessApprovalFlowState {
  isOpen: boolean;
  request: SupportAccessRequest | null;
  emailCode: string;
  error?: string;
  isSubmitting: boolean;
}

export interface CancelSubscriptionFlowState {
  isOpen: boolean;
  calculatedRefundEur: number;
  daysRemaining: number;
  isSubmitting: boolean;
}

export interface ChangePlanFlowState {
  isOpen: boolean;
  targetPlan: PlanTier;
  billingPeriod: BillingPeriod;
  isUpgrade: boolean;
  differenceEur: number;
  isSubmitting: boolean;
}

export interface DeleteAccountFlowState {
  isOpen: boolean;
  emailCode: string;
  confirmedCheckbox: boolean;
  error?: string;
  isSubmitting: boolean;
}

