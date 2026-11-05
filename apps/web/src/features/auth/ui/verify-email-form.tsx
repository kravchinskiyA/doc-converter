'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { ArrowRight, Clock, RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import { verifyEmailSchema, type VerifyEmailInput } from '@doc-converter/contracts';
import { Link, useRouter, useZodErrorMap } from '@/shared/i18n';
import { Button, Input } from '@/shared/ui';
import { AuthCard } from './auth-card';

const EXPIRATION_SECONDS = 600; // 10 минут по ТЗ §6.1
const COOLDOWN_SECONDS = 60; // 60 секунд кулдаун повторной отправки
const MAX_ATTEMPTS = 5; // 5 попыток ввода кода

export function VerifyEmailForm() {
  const t = useTranslations('auth.verifyEmail');
  const errorMap = useZodErrorMap();
  const router = useRouter();
  const searchParams = useSearchParams();

  const queryEmail = searchParams.get('email') || '';
  const [email, setEmail] = React.useState(queryEmail);
  const [isEditingEmail, setIsEditingEmail] = React.useState(!queryEmail);

  // Таймеры и попытки
  const [timeLeft, setTimeLeft] = React.useState(EXPIRATION_SECONDS);
  const [cooldown, setCooldown] = React.useState(COOLDOWN_SECONDS);
  const [attemptsLeft, setAttemptsLeft] = React.useState(MAX_ATTEMPTS);
  const [isResending, setIsResending] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [feedbackMessage, setFeedbackMessage] = React.useState<string | null>(null);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyEmailInput>({
    resolver: zodResolver(verifyEmailSchema, { errorMap }),
    defaultValues: {
      email: queryEmail,
      code: '',
    },
  });

  // Синхронизация email в форме
  React.useEffect(() => {
    setValue('email', email);
  }, [email, setValue]);

  // Таймер истечения кода (10 минут)
  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  // Таймер кулдауна повторной отправки (60 секунд)
  React.useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleResendCode = async () => {
    if (cooldown > 0 || isResending) return;

    setIsResending(true);
    setErrorMessage(null);

    try {
      // Имитация повторной отправки OTP
      await new Promise((resolve) => setTimeout(resolve, 500));
      setTimeLeft(EXPIRATION_SECONDS);
      setCooldown(COOLDOWN_SECONDS);
      setAttemptsLeft(MAX_ATTEMPTS);
      setFeedbackMessage(t('resendSuccess'));
      setTimeout(() => setFeedbackMessage(null), 4000);
    } finally {
      setIsResending(false);
    }
  };

  const onSubmit = async (_data: VerifyEmailInput) => {
    if (timeLeft <= 0) {
      setErrorMessage(t('expired'));
      return;
    }

    if (attemptsLeft <= 0) {
      setErrorMessage(t('attemptsExhausted'));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setFeedbackMessage(null);

    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      setFeedbackMessage(t('demoSuccess'));
      setTimeout(() => {
        router.push('/account');
      }, 800);
    } catch {
      setAttemptsLeft((prev) => Math.max(0, prev - 1));
      setErrorMessage(t('attemptsLeft', { count: attemptsLeft - 1 }));
    } finally {
      setIsSubmitting(false);
    }
  };

  const isExpired = timeLeft <= 0;
  const isAttemptsExhausted = attemptsLeft <= 0;

  return (
    <AuthCard
      title={t('title')}
      subtitle={email ? `${t('subtitle')} ${email}` : t('emailNotice')}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 text-left">
        {/* Редактирование email если не передан через query */}
        {isEditingEmail ? (
          <div className="space-y-1.5">
            <label className="text-[13px] font-regular text-off-black">Email</label>
            <div className="flex gap-2">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
              />
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setIsEditingEmail(false)}
              >
                OK
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 rounded-[12px] bg-black/[0.03] border-[0.5px] border-black/[0.05]">
            <span className="text-[14px] font-book text-off-black truncate pr-2">
              {email}
            </span>
            <button
              type="button"
              onClick={() => setIsEditingEmail(true)}
              className="text-[12px] font-book text-signal-blue hover:underline shrink-0"
            >
              {t('changeEmail')}
            </button>
          </div>
        )}

        {/* Скрытое поле email для валидации формы */}
        <input type="hidden" {...register('email')} />

        {/* Поле 6-значного кода */}
        <div className="space-y-2">
          <label className="text-[13px] font-regular text-off-black block">
            {t('codeLabel')}
          </label>
          <Input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={6}
            placeholder={t('codePlaceholder')}
            disabled={isExpired || isAttemptsExhausted || isSubmitting}
            error={!!errors.code || isExpired || isAttemptsExhausted}
            className="text-center font-mono text-[22px] tracking-[0.4em] h-[52px]"
            {...register('code')}
          />
          <div className="flex items-center justify-between text-[12px] font-book text-steel-gray pt-1">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-steel-gray" />
              {isExpired ? (
                <span className="text-red-600">{t('expired')}</span>
              ) : (
                t('expiresIn', { time: formatTimer(timeLeft) })
              )}
            </span>
            <span className={attemptsLeft <= 2 ? 'text-red-600' : 'text-steel-gray'}>
              {t('attemptsLeft', { count: attemptsLeft })}
            </span>
          </div>
          {errors.code?.message && (
            <p className="text-[12px] font-book text-red-600">
              {errors.code.message}
            </p>
          )}
        </div>

        {/* Сообщения об ошибках или успехе */}
        {errorMessage && (
          <div className="flex items-start gap-2 rounded-[12px] border-[0.5px] border-red-500/30 bg-red-500/[0.04] p-3 text-[13px] font-book text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {feedbackMessage && (
          <div className="rounded-[12px] border-[0.5px] border-emerald-500/30 bg-emerald-500/[0.04] p-3 text-[13px] font-book text-emerald-700">
            {feedbackMessage}
          </div>
        )}

        {/* Кнопка отправки формы */}
        <Button
          type="submit"
          variant="floating-cta"
          disabled={isSubmitting || isExpired || isAttemptsExhausted}
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

        {/* Кнопка повторной отправки кода */}
        <div className="flex items-center justify-center pt-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={cooldown > 0 || isResending}
            onClick={handleResendCode}
            className="text-[13px] text-steel-gray hover:text-off-black"
          >
            <RefreshCw
              className={`h-3.5 w-3.5 mr-1.5 ${isResending ? 'animate-spin' : ''}`}
            />
            {cooldown > 0
              ? t('resendCooldown', { seconds: cooldown })
              : t('resendButton')}
          </Button>
        </div>

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

