'use client';

import * as React from 'react';
import { AlertOctagon, RotateCcw, Home, LifeBuoy } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Link } from '@/shared/i18n';

interface ErrorViewProps {
  error?: Error & { digest?: string };
  reset?: () => void;
  title?: string;
  description?: string;
}

export function ErrorView({
  error,
  reset,
  title = '500 — Что-то пошло не так',
  description = 'Произошла непредвиденная внутренняя ошибка сервера. Ваши загруженные файлы и личные данные находятся в безопасности.',
}: ErrorViewProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4">
      <div className="max-w-[620px] w-full text-center space-y-6">
        <div className="rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-8 md:p-12 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center text-red-600">
            <AlertOctagon className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-center">
              <Badge variant="error">Системный сбой 500</Badge>
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-book tracking-tight text-off-black">
              {title}
            </h1>
            <p className="text-[14px] sm:text-[15px] text-steel-gray font-book leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          </div>

          {/* Идентификатор инцидента без раскрытия PII или трейсов */}
          {error?.digest && (
            <div className="p-3 rounded-2xl bg-[#f2f2f4]/80 text-[12px] font-mono text-steel-gray">
              Идентификатор сбоя (digest): {error.digest}
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            {reset && (
              <Button
                type="button"
                onClick={() => reset()}
                variant="floating-cta"
                className="w-full sm:w-auto h-11 px-6 bg-signal-blue text-pure-white hover:bg-signal-blue/90 border-transparent text-[13px] flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4 text-pure-white" />
                <span>Попробовать снова</span>
              </Button>
            )}
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="w-full sm:w-auto h-11 px-6 text-[13px] flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-steel-gray" />
                <span>На главную</span>
              </Button>
            </Link>
            <a
              href="mailto:support@doc-converter.com"
              className="w-full sm:w-auto"
            >
              <Button
                type="button"
                variant="secondary"
                className="w-full sm:w-auto h-11 px-5 text-[13px] flex items-center justify-center gap-2"
              >
                <LifeBuoy className="w-4 h-4 text-steel-gray" />
                <span>Поддержка</span>
              </Button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

