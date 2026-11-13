'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ArrowRight, Loader2, ShieldCheck } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordInput } from '@doc-converter/contracts';
import { Link, useRouter, useZodErrorMap } from '@/shared/i18n';
import { Button, Input } from '@/shared/ui';
import { AuthCard } from './auth-card';

export function ForgotPasswordForm() {
  const t = useTranslations('auth.forgotPassword');
  const errorMap = useZodErrorMap();
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema, { errorMap }),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsSubmitting(true);
    setFeedbackMessage(null);

    try {
      // Имитация отправки запроса сброса пароля
      await new Promise((resolve) => setTimeout(resolve, 600));
      setFeedbackMessage(t('demoSuccess'));
      setTimeout(() => {
        router.push(`/auth/reset-password?email=${encodeURIComponent(data.email)}`);
      }, 800);
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
          <label className="text-[14px] font-regular text-off-black">
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
            <p className="text-[14px] font-book text-red-600">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Информационное уведомление безопасности (OWASP) */}
        <div className="flex items-start gap-2.5 rounded-[12px] bg-black/[0.03] border border-black/[0.06] p-3 text-[14px] font-book text-steel-gray leading-relaxed">
          <ShieldCheck className="h-4 w-4 text-signal-blue shrink-0 mt-0.5" />
          <span>{t('notice')}</span>
        </div>

        {/* Сообщение об успешной отправке */}
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

        {/* Ссылки возврата и альтернативного восстановления */}
        <div className="pt-4 border-t border-black/[0.06] space-y-3 text-center">
          <div>
            <Link
              href="/auth/recovery-code"
              className="text-[14px] font-book text-steel-gray hover:text-signal-blue transition-colors"
            >
              {t('lostEmail')}{' '}
              <span className="text-signal-blue underline">
                {t('recoveryLink')}
              </span>
            </Link>
          </div>

          <p className="text-[14px] font-book text-steel-gray">
            {t('rememberPassword')}{' '}
            <Link
              href="/auth/login"
              className="text-signal-blue hover:underline font-regular"
            >
              {t('signIn')}
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}

