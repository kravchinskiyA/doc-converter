'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Check, CheckSquare, Square } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import type { PdfPageMock } from '../model/types';

interface PageThumbnailGridProps {
  pages: PdfPageMock[];
  onTogglePage: (pageNumber: number) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  className?: string;
}

export function PageThumbnailGrid({
  pages,
  onTogglePage,
  onSelectAll,
  onDeselectAll,
  className,
}: PageThumbnailGridProps) {
  const t = useTranslations('convert.pdfToDocx');
  const selectedCount = pages.filter((p) => p.selected).length;

  return (
    <div className={cn('space-y-4', className)}>
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-[#0f1012]/10">
        <div>
          <h4 className="text-sm font-semibold text-[#0f1012]">{t('pagesTitle')}</h4>
          <p className="text-xs text-[#0f1012]/60">{t('pagesHint')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onSelectAll}
            className="h-8 text-xs rounded-full px-3"
          >
            <CheckSquare className="w-3.5 h-3.5 mr-1 text-[#0071e3]" />
            {t('selectAll')}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onDeselectAll}
            className="h-8 text-xs rounded-full px-3 text-[#0f1012]/70"
          >
            <Square className="w-3.5 h-3.5 mr-1" />
            {t('deselectAll')}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-[#0f1012]/70">
        <span>{t('selectedCount', { count: selectedCount, total: pages.length })}</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {pages.map((page) => (
          <button
            key={page.pageNumber}
            type="button"
            onClick={() => onTogglePage(page.pageNumber)}
            className={cn(
              'group relative flex flex-col items-center justify-between p-3 rounded-2xl border transition-all text-left bg-white select-none',
              page.selected
                ? 'border-[#0071e3] ring-2 ring-[#0071e3]/20'
                : 'border-[#0f1012]/10 hover:border-[#0f1012]/30 opacity-70 hover:opacity-100'
            )}
            aria-pressed={page.selected}
          >
            {/* Чекбокс в верхнем правом углу карточки */}
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-[#0f1012]">
                {t('pageCard', { number: page.pageNumber })}
              </span>
              <div
                className={cn(
                  'w-5 h-5 rounded-md flex items-center justify-center transition-colors',
                  page.selected
                    ? 'bg-[#0071e3] text-white'
                    : 'border border-[#0f1012]/20 bg-white'
                )}
              >
                {page.selected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
              </div>
            </div>

            {/* Стилизованная миниатюра документа A4 */}
            <div className="w-full aspect-[1/1.414] bg-[#fdfdfd] border border-[#0f1012]/10 rounded-lg p-2.5 flex flex-col justify-between overflow-hidden">
              <div className="space-y-1.5 w-full">
                <div className="h-1.5 bg-[#0f1012]/20 rounded w-3/4" />
                <div className="h-1 bg-[#0f1012]/10 rounded w-full" />
                <div className="h-1 bg-[#0f1012]/10 rounded w-5/6" />
                <div className="h-1 bg-[#0f1012]/10 rounded w-full" />
                <div className="h-1 bg-[#0f1012]/10 rounded w-2/3" />
              </div>
              <div className="pt-2 border-t border-[#0f1012]/5 flex justify-between items-center text-[9px] text-[#0f1012]/40">
                <span>doc-converter</span>
                <span>p.{page.pageNumber}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
