'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/shared/i18n';
import {
  FileImage,
  Upload,
  ArrowRight,
  Loader2,
  X,
  Info,
  Sliders,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { cn } from '@/shared/lib/utils';
import type { ImageOutputFormat, PdfRasterDpi } from '@doc-converter/contracts';
import { PageThumbnailGrid } from './page-thumbnail-grid';
import { SUPPORTED_DPIS, type PdfPageMock } from '../model/types';

interface PdfToImagesFormProps {
  initialFormat?: ImageOutputFormat;
}

export function PdfToImagesForm({ initialFormat = 'jpg' }: PdfToImagesFormProps) {
  const t = useTranslations('convert');
  const tImages = useTranslations('convert.pdfToImages');
  const router = useRouter();

  const [file, setFile] = React.useState<File | null>(null);
  const [pages, setPages] = React.useState<PdfPageMock[]>([]);
  const [format, setFormat] = React.useState<ImageOutputFormat>(initialFormat);
  const [dpi, setDpi] = React.useState<PdfRasterDpi>(150);
  const [quality, setQuality] = React.useState<number>(85);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [stepText, setStepText] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.toLowerCase().endsWith('.pdf')) {
      setFile(selected);
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
      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf,application/pdf"
        className="hidden"
        onChange={handleFileChange}
      />

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
            <FileImage className="w-4 h-4 mr-2" />
            {t('dropzone.chooseFile')}
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="p-5 md:p-6 rounded-[28px] bg-white border border-[#0f1012]/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center shrink-0">
                <FileImage className="w-6 h-6" />
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

          {/* Панель настроек растрирования (Формат, DPI, Качество) */}
          <div className="p-6 md:p-8 rounded-[32px] md:rounded-[44px] bg-white border border-[#0f1012]/10 space-y-6">
            <div className="flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#0071e3]" />
              <h4 className="text-sm md:text-base font-semibold text-[#0f1012]">
                Параметри растрування (ТЗ §2.2)
              </h4>
            </div>

            {/* Выбор выходного формата: JPG или WebP */}
            <div className="space-y-2">
              <span className="text-[14px] font-semibold text-[#0f1012] block">
                {tImages('formatTitle')}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormat('jpg')}
                  className={cn(
                    'p-3.5 rounded-2xl border text-left transition-all',
                    format === 'jpg'
                      ? 'border-[#0071e3] bg-[#0071e3]/5 ring-1 ring-[#0071e3]'
                      : 'border-[#0f1012]/10 hover:border-[#0f1012]/20'
                  )}
                >
                  <span className="text-[14px] font-semibold text-[#0f1012] block">JPG</span>
                  <span className="text-[14px] text-[#0f1012]/60">{tImages('formatJpg')}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormat('webp')}
                  className={cn(
                    'p-3.5 rounded-2xl border text-left transition-all',
                    format === 'webp'
                      ? 'border-[#0071e3] bg-[#0071e3]/5 ring-1 ring-[#0071e3]'
                      : 'border-[#0f1012]/10 hover:border-[#0f1012]/20'
                  )}
                >
                  <span className="text-[14px] font-semibold text-[#0f1012] block">WebP</span>
                  <span className="text-[14px] text-[#0f1012]/60">{tImages('formatWebp')}</span>
                </button>
              </div>
            </div>

            {/* Выбор DPI: 72, 150, 300 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#0f1012] block">
                  {tImages('dpiTitle')}
                </span>
                <span className="text-[14px] text-[#0f1012]/50 font-mono">{dpi} DPI</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {SUPPORTED_DPIS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setDpi(val)}
                    className={cn(
                      'py-2.5 px-3 rounded-xl border text-center transition-all text-[14px] font-medium',
                      dpi === val
                        ? 'border-[#0071e3] bg-[#0071e3] text-white'
                        : 'border-[#0f1012]/10 hover:border-[#0f1012]/30 text-[#0f1012]/80 bg-[#fdfdfd]'
                    )}
                  >
                    {val} DPI
                  </button>
                ))}
              </div>
              <p className="text-[14px] text-[#0f1012]/60">{tImages('dpiInfo')}</p>
            </div>

            {/* Ползунок качества сжатия 1-100 */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[14px] font-semibold text-[#0f1012] block">
                  {tImages('qualityTitle')}
                </span>
                <span className="text-[14px] font-bold text-[#0071e3] font-mono">{quality}</span>
              </div>
              <input
                type="range"
                min={1}
                max={100}
                value={quality}
                onChange={(e) => setQuality(Number(e.target.value))}
                className="w-full accent-[#0071e3] cursor-pointer"
              />
              <p className="text-[14px] text-[#0f1012]/60">
                {tImages('qualityDesc', { quality })}
              </p>
            </div>

            {/* Заметка о белом фоне */}
            <div className="p-3.5 rounded-xl bg-[#f2f2f4]/60 border border-[#0f1012]/5 flex items-center gap-2 text-[14px] text-[#0f1012]/70">
              <Info className="w-4 h-4 text-[#0071e3] shrink-0" />
              <span>{tImages('whiteBgNotice')}</span>
            </div>
          </div>

          {/* Сетка миниатюр страниц */}
          <div className="p-6 md:p-8 rounded-[32px] md:rounded-[44px] bg-[#fdfdfd] border border-[#0f1012]/10">
            <PageThumbnailGrid
              pages={pages}
              onTogglePage={handleTogglePage}
              onSelectAll={handleSelectAll}
              onDeselectAll={handleDeselectAll}
            />
          </div>

          {/* Действия */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="neutral" className="rounded-full px-3 py-1 text-[14px] text-[#0f1012]/70">
                {dpi} DPI
              </Badge>
              <Badge variant="neutral" className="rounded-full px-3 py-1 text-[14px] text-[#0f1012]/70">
                Q{quality}
              </Badge>
              <Badge variant="neutral" className="rounded-full px-3 py-1 text-[14px] text-[#0f1012]/70">
                {format.toUpperCase()}
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
                  {tImages('submit', { format: format.toUpperCase(), count: selectedPagesCount })}
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
