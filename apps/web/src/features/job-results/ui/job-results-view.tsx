'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Archive, Plus, RefreshCw, CheckCircle2, User } from 'lucide-react';
import { Card } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Link } from '@/shared/i18n';
import { useJobResults } from '../model/use-job-results';
import { JobStatusCard } from './job-status-card';
import { JobCountdownTimer } from './job-countdown-timer';
import { JobFilesList } from './job-files-list';

interface JobResultsViewProps {
  jobId: string;
}

export function JobResultsView({ jobId }: JobResultsViewProps) {
  const t = useTranslations('results');
  const {
    job,
    countdown,
    zipState,
    downloadingFileId,
    handleDownloadFile,
    handleDownloadAllZip,
  } = useJobResults(jobId);

  const hasCompletedFiles = job.completedFiles > 0;

  return (
    <Card className="w-full max-w-[920px] mx-auto text-left space-y-8">
      {/* 1. Карточка статуса задания */}
      <JobStatusCard job={job} />

      {/* 2. Таймер доступности файлов (12 часов для гостя, ЕС GDPR) */}
      <JobCountdownTimer countdown={countdown} isGuest={job.isGuest} />

      {/* 3. Список файлов с индивидуальным статусом и скачиванием */}
      <JobFilesList
        files={job.files}
        downloadingFileId={downloadingFileId}
        onDownloadFile={handleDownloadFile}
      />

      {/* 4. Блок общих действий */}
      <div className="pt-6 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Кнопка возврата к новой конвертации */}
        <Link href="/">
          <Button variant="secondary" size="default" className="w-full sm:w-auto gap-2">
            <Plus className="h-4 w-4 text-signal-blue" />
            <span>{t('actions.newConversion')}</span>
          </Button>
        </Link>

        {/* Правые действия: Единый ZIP-архив */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {hasCompletedFiles && (
            <Button
              variant="floating-cta"
              size="default"
              disabled={zipState === 'generating'}
              onClick={handleDownloadAllZip}
              className="gap-2"
            >
              {zipState === 'generating' ? (
                <RefreshCw className="h-4 w-4 animate-spin text-signal-blue" />
              ) : zipState === 'ready' ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <Archive className="h-4 w-4 text-signal-blue" />
              )}
              <span>
                {zipState === 'generating'
                  ? t('actions.generatingZip')
                  : t('actions.downloadAllZip')}
              </span>
            </Button>
          )}

          {!job.isGuest && (
            <Link href="/account">
              <Button variant="outline" size="default" className="w-full sm:w-auto gap-2">
                <User className="h-4 w-4" />
                <span>{t('actions.goToAccount')}</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  );
}
