'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { loginSchema, type LoginInput } from '@doc-converter/contracts';
import { Link, useRouter, useZodErrorMap } from '@/shared/i18n';
import { Button, Input, Checkbox } from '@/shared/ui';
import { AuthCard } from './auth-card';

export function LoginForm() {
  const t = useTranslations('auth.login');
  const errorMap = useZodErrorMap();
  const router = useRouter();

  const [showPassword, setShowPassword] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [formSuccess, setFormSuccess] = React.useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema, { errorMap }),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (_data: LoginInput) => {
    setIsSubmitting(true);
    setFormSuccess(null);

    try {
      // Имитация успешной аутентификации перед интеграцией с API NestJS
      await new Promise((resolve) => setTimeout(resolve, 600));
      setFormSuccess(t('demoSuccess'));
      setTimeout(() => {
        router.push('/account');
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

        {/* Пароль */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="text-[13px] font-regular text-off-black">
              {t('passwordLabel')}
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-[12px] font-book text-signal-blue hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>
          <div className="relative">
            <Input
              type={showPassword ? 'text' : 'password'}
              placeholder={t('passwordPlaceholder')}
              autoComplete="current-password"
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
          {errors.password?.message && (
            <p className="text-[12px] font-book text-red-600">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Чекбокс «Запомнить меня на 30 дней» */}
        <div className="pt-1">
          <Checkbox
            label={t('rememberMe')}
            {...register('rememberMe')}
          />
        </div>

        {/* Сообщение об успешной отправке */}
        {formSuccess && (
          <div className="rounded-[12px] border-[0.5px] border-emerald-500/30 bg-emerald-500/[0.04] p-3 text-[13px] font-book text-emerald-700">
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

        {/* Ссылки восстановления и перехода к регистрации */}
        <div className="pt-4 border-t border-black/[0.06] space-y-3 text-center">
          <div>
            <Link
              href="/auth/recovery-code"
              className="text-[12px] font-book text-steel-gray hover:text-signal-blue transition-colors"
            >
              {t('recoveryCode')}
            </Link>
          </div>

          <p className="text-[13px] font-book text-steel-gray">
            {t('noAccount')}{' '}
            <Link
              href="/auth/register"
              className="text-signal-blue hover:underline font-regular"
            >
              {t('signUp')}
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
