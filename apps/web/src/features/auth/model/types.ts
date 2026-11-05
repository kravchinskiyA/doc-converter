import type {
  LoginInput,
  RegisterInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AccountRecoveryInput,
} from '@doc-converter/contracts';

export type {
  LoginInput,
  RegisterInput,
  VerifyEmailInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  AccountRecoveryInput,
};

export interface AuthFormState {
  status: 'idle' | 'submitting' | 'success' | 'error';
  errorMessage?: string;
  successMessage?: string;
}

