'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/shared/i18n';
import { FileText, Upload, ShieldCheck, Check, ArrowRight, Loader2, X } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import type { OcrLanguage } from '@doc-converter/contracts';
import { PageThumbnailGrid } from './page-thumbnail-grid';
import { SUPPORTED_OCR_LANGUAGES, type PdfPageMock } from '../model/types';

export function PdfToDocxForm() {
  const t = useTranslations('convert');
  const tDocx = useTranslations('convert.pdfToDocx');
  const router = useRouter();

  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<PdfPageMock[]>([]);
  const [selectedLanguages, setSelectedLanguages] = React.useState<OcrLanguage[]>(['uk', 'en', 'ru']);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [stepText, setStepText] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // При выборе PDF генерируем сетку страниц (по умолчанию 4 страницы для интерактивного выбора)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.toLowerCase().endsWith('.pdf')) {
      setFile(selected);
      // Симулируем 4-страничный документ с выбранными всеми страницами
      setPages([
        { pageNumber: 1, selected: true },
        { pageNumber: 2, selected: true },
        { pageNumber: 3, selected: true },
        { pageNumber: 4, selected: true },
      ]);
    }
  };

  const handleTogglePage = (pageNumber: number) => {
    setPages((prev) =>
      prev.map((p) => (p.pageNumber === pageNumber ? { ...p, selected: !p.selected } : p))
    );
  };

  const handleSelectAll = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: true })));
  };

  const handleDeselectAll = () => {
    setPages((prev) => prev.map((p) => ({ ...p, selected: false })));
  };

  const handleToggleLanguage = (lang: OcrLanguage) => {
    setSelectedLanguages((prev) => {
      if (prev.includes(lang)) {
        if (prev.length === 1) return prev; // минимум 1 язык
        return prev.filter((l) => l !== lang);
      }
      return [...prev, lang];
    });
  };

  const handleClear = () => {
    setFile(null);
    setPages([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsSubmitting(true);
    setStepText(t('flow.scanning'));

    await new Promise((resolve) => setTimeout(resolve, 600));
    setStepText(t('flow.dispatching'));

    await new Promise((resolve) => setTimeout(resolve, 600));
    setStepText(t('flow.ready'));

    await new Promise((resolve) => setTimeout(resolve, 400));
    router.push('/results/demo-job-1');
  };

  const selectedPagesCount = pages.filter((p) => p.selected).length;
  const isCtaDisabled = !file || selectedPagesCount === 0 || isSubmitting;

  return (
    <div className="space-y-8">
      {/* Скрытый инпут для выбора PDF */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Зона загрузки или информация о выбранном файле */}
      {!file ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="border-2 border-dashed border-[#0f1012]/15 hover:border-[#0071e3] transition-colors rounded-[32px] md:rounded-[44px] p-8 md:p-12 text-center flex flex-col items-center justify-center cursor-pointer bg-white group"
        >
          <div className="w-16 h-16 rounded-full bg-[#f2f2f4] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-[#0071e3]">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-lg md:text-xl font-medium text-[#0f1012] mb-1">
            {t('dropzone.pdfTitle')}
          </h3>
          <p className="text-[14px] md:text-sm text-[#0f1012]/60 mb-6">
            {t('dropzone.hint', { maxMb: 25, maxFiles: 1 })}
          </p>
          <Button type="button" size="lg" className="rounded-full px-6">
            <FileText className="w-4 h-4 mr-2" />
            {t('dropzone.chooseFile')}
          </Button>
        </div>
      ) : (
        <div className="p-5 md:p-6 rounded-[28px] bg-white border border-[#0f1012]/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <h4 className="text-sm font-semibold text-[#0f1012] truncate max-w-[280px] sm:max-w-md">
                {file.name}
              </h4>
              <p className="text-[14px] text-[#0f1012]/60">
                {(file.size / (1024 * 1024)).toFixed(2)} МБ • {pages.length} стор.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="rounded-full text-[#0f1012]/70 hover:text-destructive"
          >
            <X className="w-4 h-4 mr-1" />
            Змінити файл
          </Button>
        </div>
      )}

      {/* Интерактивный блок настроек (показывается при выбранном файле) */}
      {file && (
        <div className="space-y-8 animate-in fade-in-50 duration-300">
          {/* Сетка миниатюр страниц с мультивыбором */}
          <div className="p-6 md:p-8 rounded-[32px] md:rounded-[44px] bg-[#fdfdfd] border border-[#0f1012]/10">
            <PageThumbnailGrid
              pages={pages}
              onTogglePage={handleTogglePage}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />
          </div>

          {/* Селектор языков OCR */}
          <div className="p-6 md:p-8 rounded-[32px] md:rounded-[44px] bg-white border border-[#0f1012]/10 space-y-4">
            <div>
              <h4 className="text-sm md:text-base font-semibold text-[#0f1012]">
                {tDocx('ocrLanguagesTitle')}
              </h4>
              <p className="text-[14px] text-[#0f1012]/60">{tDocx('ocrLanguagesHint')}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {SUPPORTED_OCR_LANGUAGES.map((lang) => {
                const isSelected = selectedLanguages.includes(lang);
                return (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => handleToggleLanguage(lang)}
                    className={cn(
                      'px-3.5 py-1.5 rounded-full text-[14px] font-medium border transition-all flex items-center gap-1.5',
                      isSelected
                        ? 'bg-[#0071e3] text-white border-[#0071e3]'
                        : 'bg-white text-[#0f1012]/70 border-[#0f1012]/15 hover:border-[#0f1012]/40'
                    )}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    {tDocx(`languages.${lang}`)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Информационная карточка гарантий ТЗ §2.4 */}
          <div className="p-5 md:p-6 rounded-[28px] bg-[#f2f2f4]/60 border border-[#0f1012]/5 flex items-start gap-3.5 text-[14px] text-[#0f1012]/80">
            <ShieldCheck className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-[#0f1012] mb-0.5">{tDocx('layoutInfoTitle')}</p>
              <p className="text-[#0f1012]/70 leading-relaxed">{tDocx('layoutInfoDesc')}</p>
            </div>
          </div>

          {/* Кнопка запуска конвертации */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="neutral" className="rounded-full px-3 py-1 text-[14px] text-[#0f1012]/70">
                {t('features.cer')}
              </Badge>
              <Badge variant="neutral" className="rounded-full px-3 py-1 text-[14px] text-[#0f1012]/70">
                {t('features.eu')}
              </Badge>
            </div>

            <Button
              type="button"
              size="lg"
              disabled={isCtaDisabled}
              onClick={handleSubmit}
              className="w-full sm:w-auto rounded-full px-8 h-13 text-sm md:text-base font-medium bg-[#0f1012] text-white hover:bg-[#0071e3] transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {stepText || t('flow.dispatching')}
                </>
              ) : (
                <>
                  {tDocx('submit', { count: selectedPagesCount })}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
