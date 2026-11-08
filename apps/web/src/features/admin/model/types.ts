import type { StaffRole } from '@doc-converter/contracts';

export type AdminTabKey = 'metrics' | 'users' | 'jobs' | 'billing' | 'emergency' | 'audit';

export interface StaffSession {
  email: string;
  role: StaffRole;
  authenticatedAt: string;
  twoFactorType: 'totp' | 'recovery_code';
}

export interface AdminUserItem {
  id: string;
  email: string;
  plan: 'basic' | 'pro' | 'max' | 'enterprise';
  docsUsed: number;
  docsLimit: number;
  imagesUsed: number;
  imagesLimit: number;
  storageUsedBytes: number;
  storageMaxBytes: number;
  isConversionsPaused: boolean;
  pauseReason: string | null;
  apiKeyStatus: 'active' | 'revoked' | 'none';
  createdAt: string;
}

export type JobStatus = 'queued' | 'processing' | 'completed' | 'failed';

export interface AdminJobItem {
  id: string;
  userId: string;
  direction: 'pdf-to-docx' | 'docx-to-pdf' | 'images-to-pdf' | 'pdf-to-images';
  status: JobStatus;
  durationMs: number | null;
  errorDiagnostic: string | null;
  createdAt: string;
}

export type PaymentStatus = 'succeeded' | 'refunded' | 'refund_failed';

export interface AdminPaymentItem {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  plan: string;
  interval: 'month' | 'year';
  status: PaymentStatus;
  refundFailureReason?: string;
  createdAt: string;
}

export interface AdminAuditItem {
  id: string;
  timestamp: string;
  actorEmail: string;
  actorRole: StaffRole;
  action: string;
  target: string;
  reason: string;
  ip: string;
  result: 'success' | 'failure';
}

export interface EmergencyActionModalState {
  isOpen: boolean;
  type: 'global_pause' | 'global_resume' | 'user_pause' | 'user_resume' | 'revoke_api_key';
  targetUserId?: string;
  userEmail?: string;
}
