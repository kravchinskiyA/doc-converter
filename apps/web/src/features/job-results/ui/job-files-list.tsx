'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  FileCheck,
  Download,
  AlertCircle,
  RefreshCw,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { useFormatFileSize } from '@/shared/i18n';
import type { OutputFileResult } from '../model/types';

interface JobFilesListProps {
  files: OutputFileResult[];
  downloadingFileId: string | null;
  onDownloadFile: (file: OutputFileResult) => void;
}

export function JobFilesList({
  files,
  downloadingFileId,
  onDownloadFile,
}: JobFilesListProps) {
  const t = useTranslations('results');
  const formatFileSize = useFormatFileSize();

  const getReasonText = (reasonKey?: string) => {
    if (!reasonKey) return t('reasons.genericError');
    switch (reasonKey) {
      case 'passwordProtected':
        return t('reasons.passwordProtected');
      case 'unpackLimitExceeded':
        return t('reasons.unpackLimitExceeded');
      case 'corruptedFile':
        return t('reasons.corruptedFile');
      case 'unsupportedFormat':
        return t('reasons.unsupportedFormat');
      case 'ocrFailed':
        return t('reasons.ocrFailed');
      case 'timeout':
        return t('reasons.timeout');
      default:
        return t('reasons.genericError');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-[18px] font-book tracking-tight text-off-black">
          {t('files.title')}
        </h3>
        <Badge variant="neutral" className="text-[14px]">
          {files.length}
        </Badge>
      </div>

      {files.length === 0 ? (
        <div className="p-8 text-center rounded-[24px] border border-dashed border-black/15 text-steel-gray font-book text-[14px]">
          {t('files.noFiles')}
        </div>
      ) : (
        <div className="space-y-3">
          {files.map((file) => {
            const isDownloading = downloadingFileId === file.id;

            return (
              <div
                key={file.id}
                className="p-4 sm:p-5 rounded-[24px] border border-black/[0.08] bg-pure-white transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                {/* Левая часть: Иконка и информация о файле */}
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <div
                    className={`h-11 w-11 rounded-[14px] flex items-center justify-center shrink-0 ${
                      file.status === 'completed'
                        ? 'bg-emerald-500/10 text-emerald-700'
                        : file.status === 'failed'
                        ? 'bg-red-500/10 text-red-600'
                        : 'bg-black/[0.04] text-steel-gray'
                    }`}
                  >
                    {file.status === 'completed' && <FileCheck className="h-5 w-5" />}
                    {file.status === 'failed' && <AlertCircle className="h-5 w-5" />}
                    {file.status === 'processing' && (
                      <RefreshCw className="h-5 w-5 animate-spin text-signal-blue" />
                    )}
                    {file.status === 'queued' && <Clock className="h-5 w-5" />}
                  </div>

                  <div className="min-w-0 space-y-1">
                    {/* Имена файлов */}
                    <div className="flex flex-wrap items-center gap-1.5 text-[14px] font-regular text-off-black truncate">
                      <span className="truncate max-w-[220px] sm:max-w-[280px]">
                        {file.originalFileName}
                      </span>
                      {file.status === 'completed' && (
                        <>
                          <ArrowRight className="h-3.5 w-3.5 text-steel-gray shrink-0" />
                          <span className="text-signal-blue font-regular truncate max-w-[220px] sm:max-w-[280px]">
                            {file.resultFileName}
                          </span>
                        </>
                      )}
                    </div>

                    {/* Дополнительная строка: размер или статус или ошибка */}
                    <div className="flex flex-wrap items-center gap-2 text-[14px] font-book text-steel-gray">
                      {file.status === 'completed' && (
                        <>
                          <span>{formatFileSize(file.sizeBytes)}</span>
                          <span>•</span>
                          <span className="uppercase font-mono text-[14px] bg-black/5 px-2 py-0.5 rounded-[6px]">
                            {file.outputFormat}
                          </span>
                        </>
                      )}

                      {file.status === 'processing' && (
                        <span className="text-signal-blue flex items-center gap-1">
                          {t('files.processing')}
                        </span>
                      )}

                      {file.status === 'queued' && (
                        <span>{t('files.inQueue')}</span>
                      )}

                      {file.status === 'failed' && (
                        <span className="text-red-600 font-book">
                          {getReasonText(file.errorMessage)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Правая часть: Действие скачивания */}
                <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                  {file.status === 'completed' && (
                    <Button
                      variant="floating-cta"
                      size="sm"
                      disabled={isDownloading}
                      onClick={() => onDownloadFile(file)}
                      className="gap-1.5"
                    >
                      {isDownloading ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin text-signal-blue" />
                      ) : (
                        <Download className="h-3.5 w-3.5 text-signal-blue" />
                      )}
                      <span>{t('files.download')}</span>
                    </Button>
                  )}

                  {file.status === 'processing' && (
                    <Badge variant="signal-chip" className="text-[14px]">
                      {t('badge.processing')}
                    </Badge>
                  )}

                  {file.status === 'queued' && (
                    <Badge variant="muted" className="text-[14px]">
                      {t('badge.queued')}
                    </Badge>
                  )}

                  {file.status === 'failed' && (
                    <Badge variant="error" className="text-[14px]">
                      {t('badge.failed')}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
