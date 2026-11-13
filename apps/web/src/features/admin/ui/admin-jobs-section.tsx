'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Search, ShieldAlert, CheckCircle2, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import type { AdminJobItem, JobStatus } from '../model/types';

interface AdminJobsSectionProps {
  jobs: AdminJobItem[];
  jobSearch: string;
  setJobSearch: (v: string) => void;
  jobFilter: 'all' | JobStatus;
  setJobFilter: (v: 'all' | JobStatus) => void;
}

export function AdminJobsSection({
  jobs,
  jobSearch,
  setJobSearch,
  jobFilter,
  setJobFilter,
}: AdminJobsSectionProps) {
  const t = useTranslations('admin.jobs');

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return (
          <Badge variant="signal-chip" className="bg-emerald-500/10 text-emerald-700 border-none gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Успешно
          </Badge>
        );
      case 'processing':
        return (
          <Badge variant="signal-chip" className="bg-signal-blue/10 text-signal-blue border-none gap-1">
            <Loader2 className="w-3 h-3 animate-spin" />
            В процессе
          </Badge>
        );
      case 'queued':
        return (
          <Badge variant="neutral" className="gap-1">
            <Clock className="w-3 h-3" />
            В очереди
          </Badge>
        );
      case 'failed':
        return (
          <Badge variant="muted" className="bg-red-500/10 text-red-600 border-none gap-1">
            <AlertCircle className="w-3 h-3" />
            Ошибка
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[40px] border border-black/10 bg-pure-white p-6 md:p-8">
        <CardHeader className="space-y-3 pb-6 border-b border-black/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-[20px] md:text-[24px]">
                {t('title')}
              </CardTitle>
              <CardDescription className="text-steel-gray text-[14px]">
                {t('description')}
              </CardDescription>
            </div>
            <Badge variant="neutral" className="gap-1.5 text-steel-gray">
              <ShieldAlert className="w-3.5 h-3.5" />
              {t('noPiiNotice')}
            </Badge>
          </div>

          {/* Панель поиска и фильтров */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-gray" />
              <Input
                type="text"
                placeholder={t('search')}
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="pl-10 rounded-full h-10 text-[14px]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              <Button
                variant={jobFilter === 'all' ? 'floating-cta' : 'secondary'}
                size="sm"
                onClick={() => setJobFilter('all')}
                className={`rounded-full text-[14px] h-9 ${jobFilter === 'all' ? 'bg-off-black text-pure-white hover:bg-black/80' : ''}`}
              >
                {t('filterAll')}
              </Button>
              <Button
                variant={jobFilter === 'completed' ? 'floating-cta' : 'secondary'}
                size="sm"
                onClick={() => setJobFilter('completed')}
                className={`rounded-full text-[14px] h-9 ${jobFilter === 'completed' ? 'bg-off-black text-pure-white hover:bg-black/80' : ''}`}
              >
                {t('filterCompleted')}
              </Button>
              <Button
                variant={jobFilter === 'processing' ? 'floating-cta' : 'secondary'}
                size="sm"
                onClick={() => setJobFilter('processing')}
                className={`rounded-full text-[14px] h-9 ${jobFilter === 'processing' ? 'bg-off-black text-pure-white hover:bg-black/80' : ''}`}
              >
                {t('filterProcessing')}
              </Button>
              <Button
                variant={jobFilter === 'queued' ? 'floating-cta' : 'secondary'}
                size="sm"
                onClick={() => setJobFilter('queued')}
                className={`rounded-full text-[14px] h-9 ${jobFilter === 'queued' ? 'bg-off-black text-pure-white hover:bg-black/80' : ''}`}
              >
                {t('filterQueued')}
              </Button>
              <Button
                variant={jobFilter === 'failed' ? 'floating-cta' : 'secondary'}
                size="sm"
                onClick={() => setJobFilter('failed')}
                className={`rounded-full text-[14px] h-9 ${jobFilter === 'failed' ? 'bg-off-black text-pure-white hover:bg-black/80' : ''}`}
              >
                {t('filterFailed')}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-black/10 text-steel-gray font-regular">
                  <th className="pb-3 pr-4 font-normal">{t('colJobId')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colDirection')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colStatus')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colDuration')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colTime')}</th>
                  <th className="pb-3 pl-4 font-normal">{t('colError')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 font-book text-off-black">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-steel-gray">
                      Задания не найдены
                    </td>
                  </tr>
                ) : (
                  jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-black/[0.02] transition-colors">
                      {/* Job ID */}
                      <td className="py-4 pr-4">
                        <div className="font-mono font-medium text-off-black">{job.id}</div>
                        <div className="font-mono text-[14px] text-steel-gray">User: {job.userId}</div>
                      </td>

                      {/* Направление */}
                      <td className="py-4 px-4 font-medium">
                        <Badge variant="neutral" className="uppercase text-[14px]">
                          {job.direction}
                        </Badge>
                      </td>

                      {/* Статус */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {getStatusBadge(job.status)}
                      </td>

                      {/* Длительность */}
                      <td className="py-4 px-4 whitespace-nowrap text-steel-gray">
                        {job.durationMs !== null ? `${(job.durationMs / 1000).toFixed(2)} с` : '—'}
                      </td>

                      {/* Время */}
                      <td className="py-4 px-4 whitespace-nowrap text-steel-gray">
                        {new Date(job.createdAt).toLocaleTimeString()}
                      </td>

                      {/* Диагностика ошибки (без PII) */}
                      <td className="py-4 pl-4">
                        {job.errorDiagnostic ? (
                          <span className="text-red-600 font-mono text-[14px]">
                            {job.errorDiagnostic}
                          </span>
                        ) : (
                          <span className="text-steel-gray">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
