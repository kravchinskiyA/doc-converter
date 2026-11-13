'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/shared/i18n';
import {
  Image as ImageIcon,
  Upload,
  ArrowRight,
  Loader2,
  ChevronUp,
  ChevronDown,
  Trash2,
  Info,
  Layers,
  Plus,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Checkbox } from '@/shared/ui/checkbox';
import { cn } from '@/shared/lib/utils';
import type { ConverterFileItem } from '../model/types';

const MAX_IMAGES_COUNT = 5;
const MAX_IMAGE_SIZE_BYTES = 25 * 1024 * 1024;

export function ImagesToPdfForm() {
  const t = useTranslations('convert');
  const tImages = useTranslations('convert.imagesToPdf');
  const router = useRouter();

  const [files, setFiles] = React.useState<ConverterFileItem[]>([]);
  const [mergeIntoSinglePdf, setMergeIntoSinglePdf] = React.useState(false);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [stepText, setStepText] = React.useState<string | null>(null);
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFilesSelected = (selectedList: FileList | null) => {
    if (!selectedList || selectedList.length === 0) return;

    const newItems: ConverterFileItem[] = [];
    const validExts = ['.jpg', '.jpeg', '.png', '.webp'];

    for (let i = 0; i < selectedList.length; i++) {
      if (files.length + newItems.length >= MAX_IMAGES_COUNT) break;
      const file = selectedList[i];
      if (!file) continue;

      const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
      const isInvalidFormat = !validExts.includes(ext);
      const isTooLarge = file.size > MAX_IMAGE_SIZE_BYTES;

      newItems.push({
        id: `${file.name}-${file.size}-${Date.now()}-${i}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type || ext.slice(1).toUpperCase(),
        previewUrl: isInvalidFormat ? undefined : URL.createObjectURL(file),
        isInvalidFormat,
        isTooLarge,
      });
    }

    setFiles((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMoveUp = (index: number) => {
    if (index <= 0) return;
    setFiles((prev) => {
      const copy = [...prev];
      const current = copy[index];
      const prevItem = copy[index - 1];
      if (!current || !prevItem) return prev;

      copy[index - 1] = current;
      copy[index] = prevItem;
      return copy;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index >= files.length - 1) return;
    setFiles((prev) => {
      const copy = [...prev];
      const current = copy[index];
      const nextItem = copy[index + 1];
      if (!current || !nextItem) return prev;

      copy[index + 1] = current;
      copy[index] = nextItem;
      return copy;
    });
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => {
      const item = prev.find((f) => f.id === id);
      if (item?.previewUrl) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Drag and drop sorting handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) return;

    setFiles((prev) => {
      const copy = [...prev];
      const draggedItem = copy[draggedIndex];
      if (!draggedItem) return prev;

      copy.splice(draggedIndex, 1);
      copy.splice(targetIndex, 0, draggedItem);
      return copy;
    });
    setDraggedIndex(targetIndex);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  const handleSubmit = async () => {
    if (files.length === 0) return;
    setIsSubmitting(true);
    setStepText(t('flow.scanning'));

    await new Promise((resolve) => setTimeout(resolve, 600));
    setStepText(t('flow.dispatching'));

    await new Promise((resolve) => setTimeout(resolve, 600));
    setStepText(t('flow.ready'));

    await new Promise((resolve) => setTimeout(resolve, 400));
    router.push('/results/demo-job-1');
  };

  const validFiles = files.filter((f) => !f.isInvalidFormat && !f.isTooLarge);
  const isCtaDisabled = validFiles.length === 0 || isSubmitting;

  return (
    <div className="space-y-8">
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => handleFilesSelected(e.target.files)}
      />

      {files.length === 0 ? (
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
            {t('dropzone.imagesTitle')}
          </h3>
          <p className="text-[14px] md:text-sm text-[#0f1012]/60 mb-6">
            {t('dropzone.hint', { maxMb: 25, maxFiles: MAX_IMAGES_COUNT })}
          </p>
          <Button type="button" size="lg" className="rounded-full px-6">
            <ImageIcon className="w-4 h-4 mr-2" />
            {t('dropzone.chooseFiles')}
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          {/* Список файлов с возможностью перемещения */}
          <div className="p-6 md:p-8 rounded-[32px] md:rounded-[44px] bg-white border border-[#0f1012]/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-[#0f1012]/10">
              <div>
                <h4 className="text-sm md:text-base font-semibold text-[#0f1012]">
                  {tImages('orderTitle')}
                </h4>
                <p className="text-[14px] text-[#0f1012]/60">{tImages('orderHint')}</p>
              </div>

              {files.length < MAX_IMAGES_COUNT && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-full text-[14px]"
                >
                  <Plus className="w-3.5 h-3.5 mr-1" />
                  Додати ще
                </Button>
              )}
            </div>

            <div className="space-y-2.5">
              {files.map((item, index) => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={cn(
                    'flex items-center justify-between p-3 sm:p-4 rounded-2xl border transition-all bg-[#fdfdfd]',
                    draggedIndex === index
                      ? 'border-[#0071e3] ring-2 ring-[#0071e3]/20 bg-[#f2f2f4]'
                      : 'border-[#0f1012]/10 hover:border-[#0f1012]/25'
                  )}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <span className="text-[14px] font-mono text-[#0f1012]/40 w-5 text-center">
                      {index + 1}
                    </span>

                    {item.previewUrl ? (
                      <div className="w-12 h-12 rounded-xl border border-[#0f1012]/10 overflow-hidden bg-white shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.previewUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-[#f2f2f4] flex items-center justify-center shrink-0 text-[#0f1012]/40">
                        <ImageIcon className="w-5 h-5" />
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="text-[14px] sm:text-sm font-semibold text-[#0f1012] truncate max-w-[180px] sm:max-w-xs md:max-w-md">
                        {item.name}
                      </p>
                      <p className="text-[14px] text-[#0f1012]/50">
                        {(item.size / (1024 * 1024)).toFixed(2)} МБ
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMoveUp(index)}
                      className="p-1.5 rounded-lg hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none text-[#0f1012]/70"
                      aria-label={tImages('moveUp')}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      disabled={index === files.length - 1}
                      onClick={() => handleMoveDown(index)}
                      className="p-1.5 rounded-lg hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none text-[#0f1012]/70"
                      aria-label={tImages('moveDown')}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemove(item.id)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-[#0f1012]/50 hover:text-destructive transition-colors ml-1"
                      aria-label={tImages('remove')}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Переключатель «Объединить в один PDF» */}
          <div className="p-6 md:p-8 rounded-[32px] md:rounded-[44px] bg-[#fdfdfd] border border-[#0f1012]/10 space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="merge-toggle"
                checked={mergeIntoSinglePdf}
                onChange={(e) => setMergeIntoSinglePdf(e.target.checked)}
                className="mt-0.5"
              />
              <label htmlFor="merge-toggle" className="space-y-1 cursor-pointer select-none">
                <span className="text-sm font-semibold text-[#0f1012] block">
                  {tImages('mergeToggle')}
                </span>
                <span className="text-[14px] text-[#0f1012]/60 block leading-relaxed">
                  {tImages('mergeHint')}
                </span>
              </label>
            </div>

            <div className="p-4 rounded-2xl bg-[#f2f2f4]/60 border border-[#0f1012]/5 flex items-start gap-2.5 text-[14px] text-[#0f1012]/70">
              <Info className="w-4 h-4 text-[#0071e3] shrink-0 mt-0.5" />
              <span>{tImages('a4StandardInfo')}</span>
            </div>
          </div>

          {/* Действия */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="neutral" className="rounded-full px-3 py-1 text-[14px] text-[#0f1012]/70">
                {t('features.a4')}
              </Badge>
              <Badge variant="neutral" className="rounded-full px-3 py-1 text-[14px] text-[#0f1012]/70">
                {t('features.clamav')}
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
              ) : mergeIntoSinglePdf ? (
                <>
                  <Layers className="w-4 h-4 mr-2" />
                  {tImages('submitMerge', { count: validFiles.length })}
                </>
              ) : (
                <>
                  {tImages('submitSeparate', { count: validFiles.length })}
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
