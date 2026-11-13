'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Server } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { JobResultsView } from '@/features/job-results';

interface ResultsPageProps {
  jobId: string;
}

export function ResultsPage({ jobId }: ResultsPageProps) {
  const t = useTranslations('results');

  return (
    <div className="pb-8 md:pb-16 space-y-8 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Заголовок страницы и бейджи безопасности ЕС */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="signal-chip" className="gap-1.5">
            <Server className="h-3.5 w-3.5 text-signal-blue" />
            <span>EU Region (GDPR)</span>
          </Badge>
          <Badge variant="neutral" className="gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            <span>ClamAV Clean</span>
          </Badge>
        </div>

        <h1 className="text-[27px] md:text-[34px] leading-[1.2] font-book tracking-tight text-off-black">
          {(t('metadata.title').split('|')[0] ?? t('metadata.title')).trim()}
        </h1>
        <p className="text-[15px] leading-relaxed text-steel-gray font-book">
          {t('metadata.description')}
        </p>
      </div>

      {/* Основной интерактивный блок результатов */}
      <JobResultsView jobId={jobId} />
    </div>
  );
}
