'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { registerSchema, type RegisterInput } from '@doc-converter/contracts';
import { Link, useRouter, useZodErrorMap } from '@/shared/i18n';
import { Button, Input, Checkbox } from '@/shared/ui';
import { AuthCard } from './auth-card';

export function RegisterForm() {
  const t = useTranslations('auth.register');
  const errorMap = useZodErrorMap();
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema, { errorMap }),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      acceptTerms: false as unknown as true,
    },
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsSubmitting(true);
    setFormSuccess(null);

    try {
      // Имитация создания аккаунта и отправки 6-значного OTP кода
      await new Promise((resolve) => setTimeout(resolve, 600));
      setFormSuccess(t('demoSuccess'));
      setTimeout(() => {
        router.push(`/auth/verify-email?email=${encodeURIComponent(data.email)}`);
      }, 700);
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

        {/* Пароль */}
        <div className="space-y-1.5">
          <label className="text-[14px] font-regular text-off-black">
            {t('passwordLabel')}
          </label>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('passwordPlaceholder')}
              autoComplete="new-password"
              error={!!errors.password}
              className="pr-10"
              {...register('password')}
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
          <p className="text-[14px] font-book text-steel-gray">
            {t('passwordHint')}
          </p>
          {errors.password?.message && (
            <p className="text-[14px] font-book text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Повтор пароля */}
        <div className="space-y-1.5">
          <label className="text-[14px] font-regular text-off-black">
            {t('confirmPasswordLabel')}
          </label>
          <div className="relative">
            <Input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder={t('confirmPasswordPlaceholder')}
              autoComplete="new-password"
              error={!!errors.confirmPassword}
              className="pr-10"
              {...register('confirmPassword')}
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
          {errors.confirmPassword?.message && (
            <p className="text-[14px] font-book text-red-600">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Чекбокс согласия с условиями */}
        <div className="space-y-1.5 pt-1">
          <Checkbox
            label={
              <span>
                {t('acceptTerms')
                  .split(t('termsLink'))[0]}
                <Link
                  href="/terms"
                  target="_blank"
                  className="text-signal-blue hover:underline"
                >
                  {t('termsLink')}
                </Link>
                {t('acceptTerms')
                  .split(t('termsLink'))[1]
                  ?.split(t('privacyLink'))[0]}
                <Link
                  href="/privacy"
                  target="_blank"
                  className="text-signal-blue hover:underline"
                >
                  {t('privacyLink')}
                </Link>
              </span>
            }
            {...register('acceptTerms')}
          />
          {errors.acceptTerms?.message && (
            <p className="text-[14px] font-book text-red-600">
              {errors.acceptTerms.message}
            </p>
          )}
        </div>

        {/* Сообщение об успешной отправке */}
        {formSuccess && (
          <div className="rounded-[12px] border-[0.5px] border-emerald-500/30 bg-emerald-500/[0.04] p-3 text-[14px] font-book text-emerald-700">
            {formSuccess}
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

        {/* Переход ко входу */}
        <div className="pt-4 border-t border-black/[0.06] text-center">
          <p className="text-[14px] font-book text-steel-gray">
            {t('hasAccount')}{' '}
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

