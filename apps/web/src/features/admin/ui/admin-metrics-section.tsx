'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  HardDrive,
  ShieldCheck,
  Server,
  CheckCircle2,
  Cpu,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import type { ServiceMetrics } from '@doc-converter/contracts';

interface AdminMetricsSectionProps {
  metrics: ServiceMetrics;
}

export function AdminMetricsSection({ metrics }: AdminMetricsSectionProps) {
  const t = useTranslations('admin.metrics');

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 МБ';
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(1)} МБ`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} ГБ`;
  };

  const bullmqHealthy = metrics.bullmq.status === 'healthy';
  const clamavHealthy = metrics.clamav.status === 'online';

  return (
    <div className="space-y-6">
      {/* Карточка 1: BullMQ Очереди и воркеры */}
      <Card className="rounded-[40px] border border-black/10 bg-pure-white p-6 md:p-8">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-black/5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant={bullmqHealthy ? 'signal-chip' : 'muted'}>
                {bullmqHealthy ? 'BullMQ Online' : 'BullMQ Degraded'}
              </Badge>
              <Badge variant="neutral">Global Concurrency: 5</Badge>
            </div>
            <CardTitle className="text-[20px] md:text-[24px]">
              {t('bullmq.title')}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2 text-[14px] text-steel-gray font-book">
            <Cpu className="w-4 h-4 text-signal-blue" />
            <span>Параллельность:</span>
            <span className="font-regular text-off-black">
              {metrics.bullmq.concurrencyCurrent} / {metrics.bullmq.concurrencyMax} потоков
            </span>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="rounded-[24px] bg-[#f2f2f4] p-4 text-center space-y-1">
              <span className="text-[14px] text-steel-gray font-book">{t('bullmq.active')}</span>
              <p className="text-[22px] font-regular text-signal-blue">
                {metrics.bullmq.activeJobs}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f2f2f4] p-4 text-center space-y-1">
              <span className="text-[14px] text-steel-gray font-book">{t('bullmq.waiting')}</span>
              <p className="text-[22px] font-regular text-off-black">
                {metrics.bullmq.waitingJobs}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f2f2f4] p-4 text-center space-y-1">
              <span className="text-[14px] text-steel-gray font-book">{t('bullmq.completed')}</span>
              <p className="text-[22px] font-regular text-emerald-600">
                {metrics.bullmq.completedJobsToday}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f2f2f4] p-4 text-center space-y-1">
              <span className="text-[14px] text-steel-gray font-book">{t('bullmq.failed')}</span>
              <p className="text-[22px] font-regular text-red-600">
                {metrics.bullmq.failedJobsToday}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f2f2f4] p-4 text-center space-y-1">
              <span className="text-[14px] text-steel-gray font-book">{t('bullmq.delayed')}</span>
              <p className="text-[22px] font-regular text-off-black">
                {metrics.bullmq.delayedJobs}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f2f2f4] p-4 text-center space-y-1">
              <span className="text-[14px] text-steel-gray font-book">{t('bullmq.avgDuration')}</span>
              <p className="text-[20px] font-regular text-off-black">
                {(metrics.bullmq.avgDurationMs / 1000).toFixed(1)} с
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Карточки 2 и 3: Amazon S3 и ClamAV */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Amazon S3 EU */}
        <Card className="rounded-[40px] border border-black/10 bg-pure-white p-6 md:p-8">
          <CardHeader className="space-y-1 pb-6 border-b border-black/5">
            <div className="flex items-center gap-2">
              <Badge variant="signal-chip">eu-central-1</Badge>
              <Badge variant="neutral">SSE-KMS Encrypted</Badge>
            </div>
            <CardTitle className="text-[20px] md:text-[22px] flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-signal-blue" />
              {t('s3.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[24px] bg-[#f2f2f4] p-4 space-y-1">
                <span className="text-[14px] text-steel-gray font-book">{t('s3.tempUsed')}</span>
                <p className="text-[20px] font-regular text-off-black">
                  {formatBytes(metrics.storageS3.tempUsedBytes)}
                </p>
                <p className="text-[14px] text-steel-gray">Автоочистка через 12 часов</p>
              </div>

              <div className="rounded-[24px] bg-[#f2f2f4] p-4 space-y-1">
                <span className="text-[14px] text-steel-gray font-book">{t('s3.resultsUsed')}</span>
                <p className="text-[20px] font-regular text-off-black">
                  {formatBytes(metrics.storageS3.resultsUsedBytes)}
                </p>
                <p className="text-[14px] text-steel-gray">Хранение до 6 месяцев</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[14px] pt-2 border-t border-black/5">
              <span className="text-steel-gray font-book">{t('s3.objects')}:</span>
              <span className="font-regular text-off-black">
                {metrics.storageS3.totalObjects.toLocaleString()} шт.
              </span>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-steel-gray font-book">{t('s3.cleanedToday')}:</span>
              <span className="font-regular text-emerald-600">
                {metrics.storageS3.cleanedTodayCount} файлов
              </span>
            </div>
          </CardContent>
        </Card>

        {/* ClamAV Antivirus Daemon */}
        <Card className="rounded-[40px] border border-black/10 bg-pure-white p-6 md:p-8">
          <CardHeader className="space-y-1 pb-6 border-b border-black/5">
            <div className="flex items-center gap-2">
              <Badge variant={clamavHealthy ? 'signal-chip' : 'muted'} className="gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {clamavHealthy ? 'clamd Healthy' : 'clamd Updating'}
              </Badge>
              <Badge variant="neutral">Сканирование ДО обработки</Badge>
            </div>
            <CardTitle className="text-[20px] md:text-[22px] flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
              {t('clamav.title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-[24px] bg-[#f2f2f4] p-4 space-y-1">
                <span className="text-[14px] text-steel-gray font-book">{t('clamav.scanned')}</span>
                <p className="text-[20px] font-regular text-off-black">
                  {metrics.clamav.scannedTodayCount}
                </p>
                <p className="text-[14px] text-steel-gray">100% входящих потоков</p>
              </div>

              <div className="rounded-[24px] bg-[#f2f2f4] p-4 space-y-1">
                <span className="text-[14px] text-steel-gray font-book">{t('clamav.threats')}</span>
                <p className="text-[20px] font-regular text-emerald-600">
                  {metrics.clamav.threatsBlockedTodayCount} угроз
                </p>
                <p className="text-[14px] text-steel-gray">Чистый входящий поток</p>
              </div>
            </div>

            <div className="flex items-center justify-between text-[14px] pt-2 border-t border-black/5">
              <span className="text-steel-gray font-book">{t('clamav.signatures')}:</span>
              <span className="font-mono text-[14px] text-off-black">
                {metrics.clamav.signaturesVersion}
              </span>
            </div>
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-steel-gray font-book">Heartbeat демона:</span>
              <span className="font-regular text-steel-gray text-[14px]">
                {new Date(metrics.clamav.lastHeartbeat).toLocaleTimeString()} UTC
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Карточка 4: Базы данных и Redis */}
      <Card className="rounded-[40px] border border-black/10 bg-pure-white p-6 md:p-8">
        <CardHeader className="space-y-1 pb-4">
          <CardTitle className="text-[18px] md:text-[20px] flex items-center gap-2">
            <Server className="w-5 h-5 text-signal-blue" />
            {t('infra.title')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-[24px] bg-[#f2f2f4] p-4 space-y-1">
              <span className="text-[14px] text-steel-gray font-book">{t('infra.globalPause')}</span>
              <p
                className={`text-[16px] font-regular ${
                  metrics.infrastructure.globalConversionsPaused
                    ? 'text-red-600'
                    : 'text-emerald-600'
                }`}
              >
                {metrics.infrastructure.globalConversionsPaused
                  ? t('infra.globalPauseActive')
                  : t('infra.globalPauseNormal')}
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f2f2f4] p-4 space-y-1">
              <span className="text-[14px] text-steel-gray font-book">{t('infra.redis')}</span>
              <p className="text-[16px] font-regular text-off-black">
                Connected • {metrics.infrastructure.redisMemoryUsedMb} МБ ОЗУ
              </p>
            </div>

            <div className="rounded-[24px] bg-[#f2f2f4] p-4 space-y-1">
              <span className="text-[14px] text-steel-gray font-book">{t('infra.db')}</span>
              <p className="text-[16px] font-regular text-off-black">
                {metrics.infrastructure.dbConnectionsActive} / {metrics.infrastructure.dbConnectionsMax} активных
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
