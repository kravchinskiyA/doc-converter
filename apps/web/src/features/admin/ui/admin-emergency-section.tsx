'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { AlertTriangle, ShieldAlert, CheckCircle2, PauseCircle, PlayCircle, Info } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import type { EmergencyActionModalState } from '../model/types';
import type { ServiceMetrics, StaffRole } from '@doc-converter/contracts';

interface AdminEmergencySectionProps {
  metrics: ServiceMetrics;
  staffRole: StaffRole;
  onOpenEmergencyModal: (type: EmergencyActionModalState['type']) => void;
}

export function AdminEmergencySection({
  metrics,
  staffRole,
  onOpenEmergencyModal,
}: AdminEmergencySectionProps) {
  const t = useTranslations('admin.emergency');
  const isAdmin = staffRole === 'admin';

  const isPaused = metrics.infrastructure.globalConversionsPaused;

  return (
    <div className="space-y-6">
      {/* Главная карточка глобальной приостановки */}
      <Card
        className={`rounded-[40px] border p-6 md:p-8 transition-colors ${
          isPaused
            ? 'border-red-500/30 bg-red-500/[0.03]'
            : 'border-black/10 bg-pure-white'
        }`}
      >
        <CardHeader className="space-y-3 pb-6 border-b border-black/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant="signal-chip"
                  className={isPaused ? 'bg-red-600 text-pure-white border-none' : 'bg-emerald-600 text-pure-white border-none'}
                >
                  {isPaused ? 'РЕЖИМ ПРИОСТАНОВКИ' : 'ШТАТНЫЙ РЕЖИМ'}
                </Badge>
                <Badge variant="neutral">Сайт & REST API</Badge>
              </div>
              <CardTitle className="text-[20px] md:text-[24px] flex items-center gap-2">
                <AlertTriangle className={`w-5 h-5 ${isPaused ? 'text-red-600' : 'text-signal-blue'}`} />
                {t('globalCardTitle')}
              </CardTitle>
              <CardDescription className="text-steel-gray text-[14px]">
                {t('globalCardDesc')}
              </CardDescription>
            </div>

            {/* Кнопка действия */}
            <div>
              {isPaused ? (
                <Button
                  disabled={!isAdmin}
                  onClick={() => onOpenEmergencyModal('global_resume')}
                  className="rounded-full bg-emerald-600 hover:bg-emerald-700 text-pure-white gap-2 text-[14px] h-11 px-6 shadow-none"
                >
                  <PlayCircle className="w-4 h-4" />
                  {t('resumeConversionsBtn')}
                </Button>
              ) : (
                <Button
                  disabled={!isAdmin}
                  onClick={() => onOpenEmergencyModal('global_pause')}
                  className="rounded-full bg-red-600 hover:bg-red-700 text-pure-white gap-2 text-[14px] h-11 px-6 shadow-none"
                >
                  <PauseCircle className="w-4 h-4" />
                  {t('pauseConversionsBtn')}
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {isPaused ? (
            <div className="rounded-[24px] bg-red-500/10 border border-red-500/20 p-5 space-y-2">
              <div className="flex items-center gap-2 text-red-700 font-medium text-[14px]">
                <ShieldAlert className="w-4 h-4" />
                <span>{t('pausedAlert')}</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-[14px] pt-2 text-off-black">
                <div>
                  <span className="text-steel-gray block text-[14px]">{t('pauseReasonPrefix')}</span>
                  <span className="font-medium">{metrics.infrastructure.globalPauseReason}</span>
                </div>
                <div>
                  <span className="text-steel-gray block text-[14px]">{t('pauseByPrefix')}</span>
                  <span className="font-mono">{metrics.infrastructure.globalPauseBy}</span>
                </div>
                <div>
                  <span className="text-steel-gray block text-[14px]">{t('pauseTimePrefix')}</span>
                  <span>{metrics.infrastructure.globalPauseAt ? new Date(metrics.infrastructure.globalPauseAt).toLocaleString() : '—'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-[24px] bg-emerald-500/10 border border-emerald-500/20 p-4 flex items-center gap-3 text-emerald-800 text-[14px]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Сервис принимает новые задачи конвертации через веб-интерфейс и публичный REST API в штатном режиме.
              </span>
            </div>
          )}

          <div className="rounded-[24px] bg-[#f2f2f4] p-4 flex items-start gap-3 text-[14px] text-steel-gray font-book">
            <Info className="w-4 h-4 text-signal-blue shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-regular text-off-black">Правила работы экстренной приостановки (ТЗ §12.16):</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li>Приостановка отклоняет новые задачи без списания тарифных квот и попыток.</li>
                <li>Уже принятые и обрабатываемые задачи в очередях BullMQ продолжаются и завершаются.</li>
                <li>Личный кабинет, просмотр файлов, скачивание результатов и управление подпиской сохраняют полную доступность.</li>
                <li>Любое изменение фиксируется в журнале аудита со сроком хранения 90 дней.</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
