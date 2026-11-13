'use client';

import * as React from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ArrowRight, Eye, EyeOff, Loader2, ShieldAlert, KeyRound, MailCheck } from 'lucide-react';
import { accountRecoverySchema, type AccountRecoveryInput } from '@doc-converter/contracts';
import { Link, useRouter, useZodErrorMap } from '@/shared/i18n';
import { Button, Input } from '@/shared/ui';
import { AuthCard } from './auth-card';

export function RecoveryCodeForm() {
  const t = useTranslations('auth.recoveryCode');
  const errorMap = useZodErrorMap();
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSendingCode, setIsSendingCode] = React.useState(false);
  const [codeSentSuccess, setCodeSentSuccess] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<AccountRecoveryInput>({
    resolver: zodResolver(accountRecoverySchema, { errorMap }),
    defaultValues: {
      recoveryCode: '',
      newEmail: '',
      newEmailCode: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const newEmailValue = useWatch({ control, name: 'newEmail' });

  const handleSendEmailCode = async () => {
    if (!newEmailValue || !newEmailValue.includes('@')) return;

    setIsSendingCode(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setCodeSentSuccess(true);
      setTimeout(() => setCodeSentSuccess(false), 5000);
    } finally {
      setIsSendingCode(false);
    }
  };

  const onSubmit = async (_data: AccountRecoveryInput) => {
    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      // Имитация процедуры восстановления
      await new Promise((resolve) => setTimeout(resolve, 700));
      setFeedbackMessage(t('demoSuccess'));
      setTimeout(() => {
        router.push('/auth/login');
      }, 1000);
    } catch {
      // Ошибки будут обрабатываться через машинные коды ошибок API
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard
      title={t('title')}
      subtitle={t('subtitle')}
      className="max-w-[540px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
        {/* Предупреждение о последствиях применения резервного кода (ТЗ §6.5) */}
        {/* <div className="flex items-start gap-3 rounded-[16px] bg-red-500/[0.04] border border-red-500/25 p-4 text-[14px] font-book text-steel-gray leading-relaxed">
          <ShieldAlert className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <p className="font-regular text-off-black">{t('warning')}</p>
            <p className="text-[14px] text-ash-gray">{t('attemptsLimit')}</p>
          </div>
        </div> */}

        {/* Секция 1: Резервный код */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-1.5 text-[14px] font-regular text-ash-gray uppercase tracking-wider">
            <KeyRound className="h-3.5 w-3.5 text-signal-blue" />
            <span>{t('step1')}</span>
          </div>
          <div className="space-y-1.5">
            <label className="text-[14px] font-regular text-off-black">
              {t('codeLabel')}
            </label>
            <Input
              type="text"
              placeholder={t('codePlaceholder')}
              autoComplete="off"
              error={!!errors.recoveryCode}
              className="font-mono text-[16px] tracking-wider uppercase"
              {...register('recoveryCode')}
            />
            <p className="text-[14px] font-book text-steel-gray">
              {t('codeHint')}
            </p>
            {errors.recoveryCode?.message && (
              <p className="text-[14px] font-book text-red-600">
                {errors.recoveryCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Секция 2: Новый email и код подтверждения */}
        <div className="space-y-3 pt-2 border-t border-black/[0.06]">
          <div className="flex items-center gap-1.5 text-[14px] font-regular text-ash-gray uppercase tracking-wider">
            <MailCheck className="h-3.5 w-3.5 text-signal-blue" />
            <span>{t('step2')}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-regular text-off-black">
              {t('newEmailLabel')}
            </label>
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder={t('newEmailPlaceholder')}
                autoComplete="email"
                error={!!errors.newEmail}
                {...register('newEmail')}
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                disabled={isSendingCode || !newEmailValue}
                onClick={handleSendEmailCode}
                className="h-[44px] shrink-0 rounded-nav text-[15px]"
              >
                {isSendingCode ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-signal-blue" />
                ) : (
                  t('sendEmailCode')
                )}
              </Button>
            </div>
            {codeSentSuccess && (
              <p className="text-[14px] font-book text-emerald-600">
                Код надіслано на новий email
              </p>
            )}
            <p className="text-[14px] font-book text-steel-gray">
              {t('newEmailHint')}
            </p>
            {errors.newEmail?.message && (
              <p className="text-[14px] font-book text-red-600">
                {errors.newEmail.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-regular text-off-black">
              {t('emailCodeLabel')}
            </label>
            <Input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder={t('emailCodePlaceholder')}
              autoComplete="one-time-code"
              error={!!errors.newEmailCode}
              className="font-mono text-[17px] tracking-[0.25em]"
              {...register('newEmailCode')}
            />
            {errors.newEmailCode?.message && (
              <p className="text-[14px] font-book text-red-600">
                {errors.newEmailCode.message}
              </p>
            )}
          </div>
        </div>

        {/* Секция 3: Новый пароль */}
        <div className="space-y-3 pt-2 border-t border-black/[0.06]">
          <div className="flex items-center gap-1.5 text-[14px] font-regular text-ash-gray uppercase tracking-wider">
            <KeyRound className="h-3.5 w-3.5 text-signal-blue" />
            <span>{t('step3')}</span>
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-regular text-off-black">
              {t('newPasswordLabel')}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder={t('newPasswordPlaceholder')}
                autoComplete="new-password"
                error={!!errors.newPassword}
                className="pr-10"
                {...register('newPassword')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-gray hover:text-off-black transition-colors"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.newPassword?.message && (
              <p className="text-[14px] font-book text-red-600">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-[14px] font-regular text-off-black">
              {t('confirmPasswordLabel')}
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder={t('confirmPasswordPlaceholder')}
                autoComplete="new-password"
                error={!!errors.confirmNewPassword}
                className="pr-10"
                {...register('confirmNewPassword')}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-gray hover:text-off-black transition-colors"
                aria-label="Toggle confirm password visibility"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.confirmNewPassword?.message && (
              <p className="text-[14px] font-book text-red-600">
                {errors.confirmNewPassword.message}
              </p>
            )}
          </div>
        </div>

        {/* Сообщение об успешном выполнении */}
        {feedbackMessage && (
          <div className="rounded-[12px] border border-emerald-500/30 bg-emerald-500/[0.04] p-3 text-[14px] font-book text-emerald-700">
            {feedbackMessage}
          </div>
        )}

        {/* Кнопка отправки формы */}
        <Button
          type="submit"
          variant="floating-cta"
          disabled={isSubmitting}
          className="w-full h-[46px] text-[14px]"
        >
          {isSubmitting ? (
            <Loader2 className="h-4 w-4 animate-spin text-signal-blue" />
          ) : (
            <>
              {t('submit')}
              <ArrowRight className="h-4 w-4 text-signal-blue" />
            </>
          )}
        </Button>

        {/* Ссылка возврата ко входу */}
        <div className="pt-4 border-t border-black/[0.06] text-center">
          <Link
            href="/auth/login"
            className="text-[14px] font-book text-signal-blue hover:underline"
          >
            {t('backToLogin')}
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
