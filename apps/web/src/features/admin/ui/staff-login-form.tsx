'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ShieldCheck, KeyRound, Lock, Mail, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { staffLoginSchema, type StaffLoginInput, type StaffRole } from '@doc-converter/contracts';
import { Link, useRouter, useZodErrorMap } from '@/shared/i18n';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';

interface StaffLoginFormProps {
  onSuccess?: (email: string, role: StaffRole, twoFactorType: 'totp' | 'recovery_code') => void;
}

export function StaffLoginForm({ onSuccess }: StaffLoginFormProps) {
  const t = useTranslations('admin.login');
  const errorMap = useZodErrorMap();
  const router = useRouter();

  const [useRecoveryCode, setUseRecoveryCode] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [authError, setAuthError] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<StaffLoginInput>({
    resolver: zodResolver(staffLoginSchema, { errorMap }),
    defaultValues: {
      email: 'sec-admin@doc-converter.eu',
      password: 'StrongOperatorPassword2026!',
      totpCode: '123456',
      recoveryCode: '',
      useRecoveryCode: false,
    },
  });

  const onSubmit = async (data: StaffLoginInput) => {
    setIsSubmitting(true);
    setAuthError(null);

    try {
      // Имитация серверной проверки Better Auth + TOTP/Recovery code
      await new Promise((resolve) => setTimeout(resolve, 500));

      const role: StaffRole = data.email.includes('support') ? 'support' : 'admin';
      const factorType = data.useRecoveryCode ? 'recovery_code' : 'totp';

      if (onSuccess) {
        onSuccess(data.email, role, factorType);
      } else {
        router.push('/admin/dashboard');
      }
    } catch {
      setAuthError('Ошибка авторизации. Проверьте реквизиты и 2FA код.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoLogin = (role: StaffRole) => {
    const email = role === 'admin' ? 'sec-admin@doc-converter.eu' : 'support-agent@doc-converter.eu';
    setValue('email', email);
    setValue('password', 'StrongOperatorPassword2026!');
    setValue('totpCode', '123456');
    setValue('useRecoveryCode', false);
    setUseRecoveryCode(false);

    if (onSuccess) {
      onSuccess(email, role, 'totp');
    } else {
      router.push('/admin/dashboard');
    }
  };

  return (
    <div className="mx-auto w-full max-w-[480px]">
      <Card className="rounded-[40px] border border-black/10 bg-pure-white p-6 md:p-10">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="flex justify-center">
            <Badge variant="signal-chip" className="gap-1.5 py-1 px-3">
              <ShieldCheck className="w-3.5 h-3.5" />
              {t('badge')}
            </Badge>
          </div>
          <CardTitle className="text-[24px] md:text-[28px] font-book tracking-tight">
            {t('title')}
          </CardTitle>
          <CardDescription className="text-steel-gray text-[14px] leading-relaxed">
            {t('subtitle')}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {authError && (
            <div className="rounded-[16px] bg-red-500/10 border border-red-500/20 p-3 text-[13px] text-red-600 font-book">
              {authError}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-regular text-off-black flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-steel-gray" />
                {t('emailLabel')}
              </label>
              <Input
                type="email"
                placeholder={t('emailPlaceholder')}
                {...register('email')}
                className="rounded-full h-11"
              />
              {errors.email && (
                <p className="text-[12px] text-red-500 font-book">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-[13px] font-regular text-off-black flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-steel-gray" />
                {t('passwordLabel')}
              </label>
              <Input
                type="password"
                placeholder="••••••••••••"
                {...register('password')}
                className="rounded-full h-11"
              />
              {errors.password && (
                <p className="text-[12px] text-red-500 font-book">{errors.password.message}</p>
              )}
            </div>

            {/* 2FA: TOTP or Recovery Code */}
            {!useRecoveryCode ? (
              <div className="space-y-1.5">
                <label className="text-[13px] font-regular text-off-black flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-signal-blue" />
                  {t('totpLabel')}
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  placeholder="000000"
                  {...register('totpCode')}
                  className="rounded-full h-11 text-center font-mono tracking-widest text-[18px]"
                />
                <p className="text-[12px] text-steel-gray font-book">{t('totpHint')}</p>
                {errors.totpCode && (
                  <p className="text-[12px] text-red-500 font-book">{errors.totpCode.message}</p>
                )}
              </div>
            ) : (
              <div className="space-y-1.5">
                <label className="text-[13px] font-regular text-off-black flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  {t('recoveryCodeLabel')}
                </label>
                <Input
                  type="text"
                  placeholder="ABCD-EFGH-1234"
                  {...register('recoveryCode')}
                  className="rounded-full h-11 font-mono text-center tracking-wider text-[14px]"
                />
                <p className="text-[12px] text-steel-gray font-book">{t('recoveryCodeHint')}</p>
                {errors.recoveryCode && (
                  <p className="text-[12px] text-red-500 font-book">
                    {errors.recoveryCode.message}
                  </p>
                )}
              </div>
            )}

            {/* Переключение типа второго фактора */}
            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  const nextVal = !useRecoveryCode;
                  setUseRecoveryCode(nextVal);
                  setValue('useRecoveryCode', nextVal);
                }}
                className="text-[13px] text-signal-blue hover:underline font-book"
              >
                {useRecoveryCode ? t('useTotpCode') : t('useRecoveryCode')}
              </button>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full h-11 bg-signal-blue text-pure-white hover:bg-signal-blue/90 gap-2 text-[14px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {t('submitting')}
                </>
              ) : (
                <>
                  {t('submit')}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </form>

          {/* Быстрый демо-вход для тестирования ролей */}
          <div className="border-t border-black/10 pt-4 space-y-2.5">
            <p className="text-[12px] text-steel-gray text-center font-book">
              {t('demoNotice')}
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('admin')}
                className="rounded-full text-[12px] h-9"
              >
                {t('demoAdmin')}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => handleDemoLogin('support')}
                className="rounded-full text-[12px] h-9"
              >
                {t('demoSupport')}
              </Button>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="text-[13px] text-steel-gray hover:text-off-black transition-colors inline-flex items-center gap-1.5 font-book"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              {t('backToHome')}
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
