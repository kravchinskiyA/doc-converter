import { z } from 'zod';

/**
 * Валидация пароля по ТЗ §6.1 / §6.3:
 * От 8 до 128 символов включительно.
 * Разрешены пробелы, кириллица, латиница и спецсимволы.
 */
export const passwordSchema = z
  .string()
  .min(8, 'passwordLength')
  .max(128, 'passwordLength');

/**
 * Валидация адреса электронной почты.
 */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .min(1, 'required')
  .email('invalidEmail');

/**
 * Валидация 6-значного цифрового почтового кода (ТЗ §6.1).
 */
export const emailCodeSchema = z
  .string()
  .trim()
  .regex(/^\d{6}$/, 'codeFormat');

/**
 * Валидация резервного кода восстановления (ТЗ §6.5).
 * 12-32 символов (включая дефисы и пробелы).
 */
export const recoveryCodeSchema = z
  .string()
  .trim()
  .min(8, 'recoveryCodeFormat')
  .max(32, 'recoveryCodeFormat');

/**
 * Схема формы входа (Login).
 */
export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional().default(false),
});

export type LoginInput = z.infer<typeof loginSchema>;

/**
 * Схема формы регистрации (Register).
 */
export const registerSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: z.string().min(1, 'required'),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'termsRequired',
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'passwordsMismatch',
    path: ['confirmPassword'],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

/**
 * Схема подтверждения почты 6-значным кодом (Verify Email).
 */
export const verifyEmailSchema = z.object({
  email: emailSchema,
  code: emailCodeSchema,
});

export type VerifyEmailInput = z.infer<typeof verifyEmailSchema>;

/**
 * Схема запроса сброса пароля (Forgot Password).
 */
export const forgotPasswordSchema = z.object({
  email: emailSchema,
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

/**
 * Схема установки нового пароля (Reset Password).
 */
export const resetPasswordSchema = z
  .object({
    email: emailSchema,
    code: emailCodeSchema,
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'passwordsMismatch',
    path: ['confirmNewPassword'],
  });

export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

/**
 * Схема восстановления доступа через резервный код при потере почты (ТЗ §6.5).
 */
export const accountRecoverySchema = z
  .object({
    recoveryCode: recoveryCodeSchema,
    newEmail: emailSchema,
    newEmailCode: emailCodeSchema,
    newPassword: passwordSchema,
    confirmNewPassword: z.string().min(1, 'required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'passwordsMismatch',
    path: ['confirmNewPassword'],
  });

export type AccountRecoveryInput = z.infer<typeof accountRecoverySchema>;

