'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  CheckCircle2,
  Clock,
  RefreshCw,
  AlertTriangle,
  XCircle,
  Copy,
  Check,
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import type { JobResult } from '../model/types';

interface JobStatusCardProps {
  job: JobResult;
}

export function JobStatusCard({ job }: JobStatusCardProps) {
  const t = useTranslations('results');
  const [copied, setCopied] = React.useState(false);

  const handleCopyJobId = () => {
    navigator.clipboard.writeText(job.jobId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const renderStatusBadge = () => {
    switch (job.status) {
      case 'completed':
        return (
          <Badge variant="success" className="gap-1.5 py-1 px-3.5 text-[13px]">
            <CheckCircle2 className="h-4 w-4" />
            {t('badge.completed')}
          </Badge>
        );
      case 'partial':
        return (
          <Badge variant="signal-chip" className="gap-1.5 py-1 px-3.5 text-[13px]">
            <AlertTriangle className="h-4 w-4 text-signal-blue" />
            {t('badge.partial')}
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="signal-chip" className="gap-1.5 py-1 px-3.5 text-[13px]">
            <RefreshCw className="h-4 w-4 animate-spin text-signal-blue" />
            {t('badge.processing')}
          </Badge>
        );
      case 'queued':
        return (
          <Badge variant="neutral" className="gap-1.5 py-1 px-3.5 text-[13px]">
            <Clock className="h-4 w-4 text-steel-gray" />
            {t('badge.queued')}
          </Badge>
        );
      case 'failed':
      default:
        return (
          <Badge variant="error" className="gap-1.5 py-1 px-3.5 text-[13px]">
            <XCircle className="h-4 w-4" />
            {t('badge.failed')}
          </Badge>
        );
    }
  };

  const getStatusDescription = () => {
    switch (job.status) {
      case 'completed':
        return t('status.completedDesc');
      case 'partial':
        return t('status.partialDesc');
      case 'processing':
        return t('status.processingDesc');
      case 'queued':
        return t('status.queuedDesc');
      case 'failed':
      default:
        return t('status.failedDesc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Верхний ряд: статус и мета-данные */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
        <div className="flex items-center gap-3">
          {renderStatusBadge()}
          <span className="text-[13px] font-book text-steel-gray">
            {job.direction.toUpperCase().replace(/-/g, ' ')}
          </span>
        </div>

        {/* Копирование ID задания */}
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-book text-steel-gray">
            {t('summary.jobId')}:
          </span>
          <button
            type="button"
            onClick={handleCopyJobId}
            title={job.jobId}
            className="inline-flex items-center gap-1.5 text-[12px] font-mono text-off-black bg-black/[0.03] hover:bg-black/[0.06] border border-black/10 px-2.5 py-1 rounded-[8px] transition-colors"
          >
            <span>{job.jobId}</span>
            {copied ? (
              <Check className="h-3 w-3 text-emerald-600" />
            ) : (
              <Copy className="h-3 w-3 text-steel-gray" />
            )}
          </button>
        </div>
      </div>

      {/* Описание текущего состояния задания */}
      <div className="space-y-2">
        <h2 className="text-[20px] md:text-[24px] font-book tracking-tight text-off-black">
          {t('status.title')}
        </h2>
        <p className="text-[15px] leading-relaxed text-steel-gray font-book">
          {getStatusDescription()}
        </p>
      </div>

      {/* Индикатор прогресса для активной обработки */}
      {job.status === 'processing' && (
        <div className="space-y-1.5 pt-1">
          <div className="w-full bg-black/5 h-2 rounded-full overflow-hidden">
            <div className="h-full bg-signal-blue rounded-full animate-pulse w-3/4" />
          </div>
          <p className="text-[12px] text-steel-gray font-book text-right">
            {t('status.processingDesc')}
          </p>
        </div>
      )}

      {/* Сводные показатели задания */}
      <div className="grid grid-cols-3 gap-3 pt-2">
        <div className="p-3.5 rounded-[16px] bg-black/[0.02] border border-black/[0.04] text-center">
          <span className="block text-[11px] font-book text-steel-gray uppercase tracking-wider">
            {t('summary.total')}
          </span>
          <span className="text-[20px] font-regular text-off-black mt-0.5 block">
            {job.totalFiles}
          </span>
        </div>

        <div className="p-3.5 rounded-[16px] bg-emerald-500/[0.04] border border-emerald-500/20 text-center">
          <span className="block text-[11px] font-book text-emerald-700 uppercase tracking-wider">
            {t('summary.ready')}
          </span>
          <span className="text-[20px] font-regular text-emerald-700 mt-0.5 block">
            {job.completedFiles}
          </span>
        </div>

        <div className="p-3.5 rounded-[16px] bg-red-500/[0.04] border border-red-500/20 text-center">
          <span className="block text-[11px] font-book text-red-700 uppercase tracking-wider">
            {t('summary.failed')}
          </span>
          <span className="text-[20px] font-regular text-red-700 mt-0.5 block">
            {job.failedFiles}
          </span>
        </div>
      </div>
    </div>
  );
}
