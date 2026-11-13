'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  FileUp,
  FileText,
  ArrowRight,
  Trash2,
  ChevronUp,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  Plus,
} from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Badge,
} from '@/shared/ui';
import { Link, useFormatFileSize, useRouter } from '@/shared/i18n';
import {
  type ConverterFile,
  GUEST_MAX_FILES,
  MAX_FILE_SIZE_BYTES,
  INITIAL_GUEST_ATTEMPTS,
} from '../types';

type ConversionStep = 'antivirus' | 'queue' | 'redirect';

const MAX_FILE_SIZE_MB = MAX_FILE_SIZE_BYTES / (1024 * 1024);

export function QuickConverter() {
  const t = useTranslations('quickConverter');
  const formatFileSize = useFormatFileSize();
  const router = useRouter();
  const [files, setFiles] = React.useState<ConverterFile[]>([]);
  const [isDragging, setIsDragging] = React.useState(false);
  const [guestAttempts, setGuestAttempts] = React.useState<number>(() => {
    if (typeof window === 'undefined') return INITIAL_GUEST_ATTEMPTS;
    try {
      const savedAttempts = localStorage.getItem('doc_converter_guest_attempts');
      if (savedAttempts !== null) {
        const parsed = parseInt(savedAttempts, 10);
        if (!isNaN(parsed) && parsed >= 0) {
          return parsed;
        }
      }
    } catch {
      // Игнорируем недоступность storage
    }
    return INITIAL_GUEST_ATTEMPTS;
  });
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [conversionStep, setConversionStep] = React.useState<ConversionStep | null>(null);

  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  const handleFiles = (incomingFiles: FileList | File[]) => {
    setErrorMessage(null);
    const newFiles: ConverterFile[] = [];
    const arrayFiles = Array.from(incomingFiles);

    const availableSlots = GUEST_MAX_FILES - files.length;
    if (availableSlots <= 0) {
      setErrorMessage(t('limits.reached', { max: GUEST_MAX_FILES }));
      return;
    }

    if (arrayFiles.length > availableSlots) {
      setErrorMessage(
        t('limits.partiallyAdded', {
          added: availableSlots,
          total: arrayFiles.length,
          max: GUEST_MAX_FILES,
        })
      );
    }

    const filesToProcess = arrayFiles.slice(0, availableSlots);

    for (const file of filesToProcess) {
      const lowerName = file.name.toLowerCase();
      const isPdf = lowerName.endsWith('.pdf') || file.type === 'application/pdf';
      const isTooLarge = file.size > MAX_FILE_SIZE_BYTES;
      const isInvalidFormat = !isPdf;

      newFiles.push({
        id: `${file.name}-${file.size}-${Date.now()}-${Math.random()}`,
        file,
        name: file.name,
        size: file.size,
        type: file.type,
        isPdf,
        isTooLarge,
        isInvalidFormat,
      });
    }

    setFiles([...files, ...newFiles]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    const newFiles = [...files];
    const item = newFiles[index];
    const prevItem = newFiles[index - 1];
    if (item && prevItem) {
      newFiles[index] = prevItem;
      newFiles[index - 1] = item;
      setFiles(newFiles);
    }
  };

  const handleMoveDown = (index: number) => {
    if (index === files.length - 1) return;
    const newFiles = [...files];
    const item = newFiles[index];
    const nextItem = newFiles[index + 1];
    if (item && nextItem) {
      newFiles[index] = nextItem;
      newFiles[index + 1] = item;
      setFiles(newFiles);
    }
  };

  const handleRemove = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setErrorMessage(null);
  };

  const handleClearAll = () => {
    setFiles([]);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasInvalidFiles = files.some((f) => f.isTooLarge || f.isInvalidFormat);
  const canConvert =
    files.length > 0 && !hasInvalidFiles && guestAttempts > 0 && !conversionStep;

  const handleStartConversion = () => {
    if (!canConvert) return;

    // Списание 1 гостевой попытки
    const newAttempts = Math.max(0, guestAttempts - 1);
    setGuestAttempts(newAttempts);
    try {
      localStorage.setItem('doc_converter_guest_attempts', newAttempts.toString());
    } catch {
      // Игнорируем
    }

    // Этапы конвертации для демонстрации надежного пайплайна
    setConversionStep('antivirus');

    setTimeout(() => {
      setConversionStep('queue');
      setTimeout(() => {
        setConversionStep('redirect');
        setTimeout(() => {
          const fakeJobId = `job-${Date.now().toString().slice(-6)}`;
          router.push(`/results/${fakeJobId}`);
        }, 600);
      }, 700);
    }, 800);
  };

  return (
    <Card className="w-full max-w-[860px] text-left">
      <CardHeader className="pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <CardTitle>{t('title')}</CardTitle>
            <CardDescription>
              {t('description')}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant={guestAttempts > 0 ? 'neutral' : 'signal-chip'}
              className="text-[12px]"
            >
              {t('guestAttempts', { count: guestAttempts, total: INITIAL_GUEST_ATTEMPTS })}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Скрытый нативный инпут */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,application/pdf"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              handleFiles(e.target.files);
            }
          }}
        />

        {/* Drag and Drop зона при пустом списке */}
        {files.length === 0 ? (
          <div
            onDragOver={handleDragOver}
            onDragEnter={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border border-dashed rounded-[24px] p-8 md:p-14 text-center transition-all flex flex-col items-center justify-center cursor-pointer select-none ${
              isDragging
                ? 'border-signal-blue bg-signal-blue/[0.04]'
                : 'border-black/15 hover:border-signal-blue/50 bg-black/[0.01]'
            }`}
          >
            <div className="h-12 w-12 rounded-full bg-signal-blue/5 flex items-center justify-center text-signal-blue mb-4">
              <FileUp className="h-6 w-6 stroke-[1.5]" />
            </div>
            <p className="text-[15px] font-book text-off-black mb-1">
              {t('dropzone.title')}
            </p>
            <p className="text-[13px] font-book text-ash-gray">
              {t('dropzone.hint', { maxMb: MAX_FILE_SIZE_MB, maxFiles: GUEST_MAX_FILES })}
            </p>

            <div className="mt-5">
              <Button
                variant="floating-cta"
                size="sm"
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
              >
                {t('dropzone.chooseFiles')}
                <ArrowRight className="h-3.5 w-3.5 text-signal-blue" />
              </Button>
            </div>
          </div>
        ) : (
          /* Список выбранных файлов */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-book text-off-black">
                  {t('list.selected', { count: files.length, max: GUEST_MAX_FILES })}
                </span>
                <span className="text-[12px] font-book text-ash-gray">
                  {t('list.totalSize', {
                    size: formatFileSize(files.reduce((acc, f) => acc + f.size, 0)),
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {files.length < GUEST_MAX_FILES && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-[13px] text-signal-blue hover:bg-signal-blue/5"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Plus className="h-3.5 w-3.5 mr-1" />
                    {t('list.addMore')}
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[13px] text-steel-gray hover:text-off-black"
                  onClick={handleClearAll}
                >
                  {t('list.clear')}
                </Button>
              </div>
            </div>

            {/* Карточки файлов */}
            <div className="space-y-2">
              {files.map((file, idx) => (
                <div
                  key={file.id}
                  className={`flex items-center justify-between p-3.5 rounded-[16px] border-[0.5px] transition-colors ${
                    file.isTooLarge || file.isInvalidFormat
                      ? 'border-red-300 bg-red-500/[0.02]'
                      : 'border-black/[0.08] bg-pure-white hover:border-black/20'
                  }`}
                >
                  {/* Левая часть: Иконка + Имя + Размер */}
                  <div className="flex items-center gap-3 min-w-0 pr-2">
                    <div className="h-9 w-9 rounded-[10px] bg-black/[0.03] flex items-center justify-center shrink-0 text-off-black">
                      <FileText className="h-4 w-4 stroke-[1.5]" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[14px] font-book text-off-black truncate max-w-[260px] sm:max-w-[380px]">
                        {file.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[12px] font-book text-ash-gray">
                          {formatFileSize(file.size)}
                        </span>
                        {file.isTooLarge && (
                          <span className="text-[11px] font-book text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {t('fileStatus.tooLarge', { maxMb: MAX_FILE_SIZE_MB })}
                          </span>
                        )}
                        {file.isInvalidFormat && (
                          <span className="text-[11px] font-book text-red-600 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {t('fileStatus.invalidFormat')}
                          </span>
                        )}
                        {!file.isTooLarge && !file.isInvalidFormat && (
                          <span className="text-[11px] font-book text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            {t('fileStatus.ready')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Правая часть: Управление порядком и удаление */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      aria-label={t('aria.moveUp')}
                      disabled={idx === 0}
                      onClick={() => handleMoveUp(idx)}
                      className="h-7 w-7 rounded-[8px] flex items-center justify-center text-steel-gray hover:text-off-black hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronUp className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={t('aria.moveDown')}
                      disabled={idx === files.length - 1}
                      onClick={() => handleMoveDown(idx)}
                      className="h-7 w-7 rounded-[8px] flex items-center justify-center text-steel-gray hover:text-off-black hover:bg-black/5 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                    >
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      aria-label={t('aria.remove')}
                      onClick={() => handleRemove(file.id)}
                      className="h-7 w-7 rounded-[8px] flex items-center justify-center text-steel-gray hover:text-red-600 hover:bg-red-50 transition-colors ml-1"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Направление конвертации (только PDF → DOCX) */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-black/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-book text-steel-gray">
                  {t('direction.label')}
                </span>
                <Badge variant="neutral">{t('direction.pdfToDocx')}</Badge>
              </div>

              {/* Кнопка запуска */}
              <div className="flex items-center gap-3 self-end sm:self-auto">
                {conversionStep ? (
                  <div className="flex items-center gap-2 text-[13px] text-signal-blue font-book">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>{t(`steps.${conversionStep}`)}</span>
                  </div>
                ) : (
                  <Button
                    variant="floating-cta"
                    disabled={!canConvert}
                    onClick={handleStartConversion}
                  >
                    {t('convert', { count: files.length })}
                    <ArrowRight className="h-3.5 w-3.5 text-signal-blue" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Сообщение об ошибке лимитов */}
        {errorMessage && (
          <div className="rounded-[14px] border border-red-200 bg-red-50/50 p-3 flex items-center gap-2 text-[13px] text-red-600">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Предупреждение об исчерпании попыток */}
        {guestAttempts === 0 && (
          <div className="rounded-[14px] border border-signal-blue/20 bg-signal-blue/[0.03] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px]">
            <span className="text-off-black font-book">
              {t('attemptsExhausted.text', { total: INITIAL_GUEST_ATTEMPTS })}
            </span>
            <Link href="/auth/register">
              <Button size="sm" variant="floating-cta">
                {t('attemptsExhausted.cta')}
                <ArrowRight className="h-3 w-3 text-signal-blue" />
              </Button>
            </Link>
          </div>
        )}

        {/* Быстрый переход в расширенный режим PDF → DOCX */}
        <div className="mt-4 pt-4 border-t border-black/[0.06] flex flex-wrap items-center gap-2">
          <span className="text-[13px] font-book text-steel-gray mr-2">
            {t('modes.label')}
          </span>
          <Link href="/convert/pdf-to-docx">
            <Badge
              variant="signal-chip"
              className="hover:bg-signal-blue/5 cursor-pointer"
            >
              {t('modes.pdfPages')}
            </Badge>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
