'use client';

import * as React from 'react';
import { FileQuestion, ArrowRight, Home, RefreshCw } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Link } from '@/shared/i18n';

interface NotFoundViewProps {
  title?: string;
  description?: string;
}

export function NotFoundView({
  title = '404 — Страница не найдена',
  description = 'Запрашиваемый адрес не существует, был удален или перемещен. Проверьте правильность введенного URL или воспользуйтесь навигацией ниже.',
}: NotFoundViewProps) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center pb-12 px-4">
      <div className="max-w-[620px] w-full text-center space-y-6">
        <div className="rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-8 md:p-12 space-y-6">
          <div className="mx-auto w-16 h-16 rounded-full bg-signal-blue/10 flex items-center justify-center text-signal-blue">
            <FileQuestion className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <div className="flex justify-center">
              <Badge variant="signal-chip">Код 404</Badge>
            </div>
            <h1 className="text-[28px] sm:text-[34px] font-book tracking-tight text-off-black">
              {title}
            </h1>
            <p className="text-[14px] sm:text-[15px] text-steel-gray font-book leading-relaxed max-w-md mx-auto">
              {description}
            </p>
          </div>

          {/* Быстрые ссылки на основные разделы */}
          <div className="p-4 rounded-2xl bg-[#f2f2f4]/60 text-left space-y-2">
            <div className="text-[14px] font-regular text-steel-gray uppercase tracking-wider">
              Популярные разделы:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[14px] font-book">
              <Link href="/convert/pdf-to-docx" className="text-signal-blue hover:underline flex items-center gap-1">
                <span>PDF → DOCX (Распознавание OCR)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/convert/docx-to-pdf" className="text-signal-blue hover:underline flex items-center gap-1">
                <span>DOCX → PDF (LibreOffice)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/pricing" className="text-signal-blue hover:underline flex items-center gap-1">
                <span>Тарифы и возможности</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link href="/api-docs" className="text-signal-blue hover:underline flex items-center gap-1">
                <span>Документация REST API</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="floating-cta"
                className="w-full sm:w-auto h-11 px-6 bg-signal-blue text-pure-white hover:bg-signal-blue/90 border-transparent text-[14px] flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4 text-pure-white" />
                <span>На главную страницу</span>
              </Button>
            </Link>
            <Link href="/convert/pdf-to-docx" className="w-full sm:w-auto">
              <Button
                variant="secondary"
                className="w-full sm:w-auto h-11 px-6 text-[14px] flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4 text-steel-gray" />
                <span>К конвертеру файлов</span>
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

