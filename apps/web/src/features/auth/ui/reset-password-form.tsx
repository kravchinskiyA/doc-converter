'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordInput } from '@doc-converter/contracts';
import { Link, useRouter, useZodErrorMap } from '@/shared/i18n';
import { Button, Input } from '@/shared/ui';
import { AuthCard } from './auth-card';

export function ResetPasswordForm() {
  const t = useTranslations('auth.resetPassword');
  const errorMap = useZodErrorMap();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get('email') || '';

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema, { errorMap }),
    defaultValues: {
      email: queryEmail,
      code: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  React.useEffect(() => {
    if (queryEmail) {
      setValue('email', queryEmail);
    }
  }, [queryEmail, setValue]);

  const onSubmit = async (_data: ResetPasswordInput) => {
    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      // Имитация сброса пароля
      await new Promise((resolve) => setTimeout(resolve, 600));
      setFeedbackMessage(t('demoSuccess'));
      setTimeout(() => {
        router.push('/auth/login');
      }, 900);
    } catch {
      // Ошибки будут обрабатываться через машинные коды ошибок API
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthCard title={t('title')} subtitle={t('subtitle')}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 text-left">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-regular text-off-black">
            {t('emailLabel')}
          </label>
          <Input
            type="email"
            placeholder={t('emailPlaceholder')}
            autoComplete="email"
            error={!!errors.email}
            {...register('email')}
          />
          {errors.email?.message && (
            <p className="text-[12px] font-book text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* 6-значный код */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-regular text-off-black">
            {t('codeLabel')}
          </label>
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder={t('codePlaceholder')}
            autoComplete="one-time-code"
            error={!!errors.code}
            className="font-mono text-[18px] tracking-[0.25em]"
            {...register('code')}
          />
          {errors.code?.message && (
            <p className="text-[12px] font-book text-red-600">
              {errors.code.message}
            </p>
          )}
        </div>

        {/* Новый пароль */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-regular text-off-black">
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
            <p className="text-[12px] font-book text-red-600">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        {/* Повтор нового пароля */}
        <div className="space-y-1.5">
          <label className="text-[13px] font-regular text-off-black">
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
            <p className="text-[12px] font-book text-red-600">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* Предупреждение безопасности по ТЗ §6.3 */}
        <div className="flex items-start gap-2.5 rounded-[12px] bg-red-500/[0.04] border-[0.5px] border-red-500/20 p-3 text-[12px] font-book text-steel-gray leading-relaxed">
          <ShieldAlert className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
          <span>{t('securityNotice')}</span>
        </div>

        {/* Сообщение об успехе */}
        {feedbackMessage && (
          <div className="rounded-[12px] border-[0.5px] border-emerald-500/30 bg-emerald-500/[0.04] p-3 text-[13px] font-book text-emerald-700">
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

        {/* Ссылка возврата */}
        <div className="pt-4 border-t border-black/[0.06] text-center">
          <Link
            href="/auth/login"
            className="text-[13px] font-book text-signal-blue hover:underline"
          >
            {t('backToLogin')}
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}

