'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Info,
  Server,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import type { useAccountState } from '../model/use-account-state';

type StorageSectionProps = ReturnType<typeof useAccountState>;

export function StorageSection({
  storageQuota,
  files,
  isClearStorageOpen,
  setIsClearStorageOpen,
  handleClearAllStorage,
}: StorageSectionProps) {
  const t = useTranslations('account.storage');
  const tUnits = useTranslations('account.units');

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return `0 ${tUnits('mb')}`;
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(1)} ${tUnits('mb')}`;
    const gb = mb / 1024;
    return `${gb.toFixed(2)} ${tUnits('gb')}`;
  };

  const percentUsed = Math.min(
    100,
    Math.round((storageQuota.usedBytes / storageQuota.totalBytes) * 100)
  );

  return (
    <div className="space-y-6">
      <Card className="rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-10">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-black/5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="signal-chip">{t('s3Badge')}</Badge>
              <Badge variant="neutral">{t('planBadge', { plan: storageQuota.plan.toUpperCase() })}</Badge>
            </div>
            <CardTitle className="text-[22px] md:text-[26px]">{t('title')}</CardTitle>
            <CardDescription className="text-steel-gray text-[14px]">
              {t('description')}
            </CardDescription>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsClearStorageOpen(true)}
            disabled={files.length === 0}
            className="gap-2 border-red-500/30 text-red-600 hover:bg-red-500/5 shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
            {t('clearAllBtn')}
          </Button>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {/* Предупреждения по лимитам ТЗ §10.3 */}
          {storageQuota.isOver100 ? (
            <div className="rounded-[24px] border-[0.5px] border-red-500/30 bg-red-500/[0.04] p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14px] font-medium text-red-700">
                  {t('over100Title')}
                </h4>
                <p className="text-[14px] text-red-600/90 mt-1 leading-relaxed">
                  {t('over100Desc')}
                </p>
              </div>
            </div>
          ) : storageQuota.isOver75 ? (
            <div className="rounded-[24px] border-[0.5px] border-amber-500/30 bg-amber-500/[0.04] p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14px] font-medium text-amber-700">
                  {t('over75Title')}
                </h4>
                <p className="text-[14px] text-amber-700/80 mt-1 leading-relaxed">
                  {t('over75Desc', {
                    used: formatBytes(storageQuota.usedBytes),
                    total: formatBytes(storageQuota.totalBytes),
                  })}
                </p>
              </div>
            </div>
          ) : null}

          {/* Интерактивная шкала заполнения */}
          <div className="rounded-[28px] border-[0.5px] border-black/5 bg-[#fdfdfd] p-6 space-y-4">
            <div className="flex items-center justify-between text-[14px]">
              <span className="font-book text-off-black">{t('usedLabel')}</span>
              <span className="font-regular text-steel-gray">
                {t.rich('usedOf', {
                  used: formatBytes(storageQuota.usedBytes),
                  total: formatBytes(storageQuota.totalBytes),
                  percent: percentUsed,
                  bold: (chunks) => <strong className="text-off-black font-medium">{chunks}</strong>,
                })}
              </span>
            </div>

            {/* Прогресс-бар с отметкой 75% */}
            <div className="relative w-full h-3.5 rounded-full bg-black/[0.06] overflow-hidden">
              <div
                className={`h-full transition-all duration-500 rounded-full ${
                  storageQuota.isOver100
                    ? 'bg-red-500'
                    : storageQuota.isOver75
                    ? 'bg-amber-500'
                    : 'bg-[#0f1012]'
                }`}
                style={{ width: `${percentUsed}%` }}
              />
              {/* Вертикальная метка 75% */}
              <div
                className="absolute top-0 bottom-0 w-[1.5px] bg-black/30 z-10"
                style={{ left: '75%' }}
                title={t('thresholdTitle')}
              />
            </div>

            <div className="flex items-center justify-between text-[14px] text-steel-gray pt-1">
              <span>{t('zeroGb')}</span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500" />
                {t('thresholdLabel', { size: formatBytes(storageQuota.warningThresholdBytes) })}
              </span>
              <span>{t('limitLabel', { size: formatBytes(storageQuota.totalBytes) })}</span>
            </div>
          </div>

          {/* Информационные правила хранения */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
            <div className="rounded-[22px] border-[0.5px] border-black/5 bg-off-white/30 p-4">
              <div className="flex items-center gap-2 text-off-black font-book text-[14px] mb-1">
                <Server className="h-4 w-4 text-signal-blue" />
                {t('rules.euTitle')}
              </div>
              <p className="text-[14px] text-steel-gray leading-relaxed">
                {t('rules.euDesc')}
              </p>
            </div>

            <div className="rounded-[22px] border-[0.5px] border-black/5 bg-off-white/30 p-4">
              <div className="flex items-center gap-2 text-off-black font-book text-[14px] mb-1">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {t('rules.retentionTitle')}
              </div>
              <p className="text-[14px] text-steel-gray leading-relaxed">
                {t('rules.retentionDesc')}
              </p>
            </div>

            <div className="rounded-[22px] border-[0.5px] border-black/5 bg-off-white/30 p-4">
              <div className="flex items-center gap-2 text-off-black font-book text-[14px] mb-1">
                <Info className="h-4 w-4 text-signal-blue" />
                {t('rules.batchTitle')}
              </div>
              <p className="text-[14px] text-steel-gray leading-relaxed">
                {t('rules.batchDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Диалог подтверждения полной очистки хранилища */}
      <Dialog open={isClearStorageOpen} onOpenChange={setIsClearStorageOpen}>
        <DialogContent onClose={() => setIsClearStorageOpen(false)} className="max-w-[480px]">
          <div className="space-y-4">
            <Badge variant="error">{t('clearDialog.badge')}</Badge>
            <h3 className="text-[20px] font-book text-off-black">{t('clearDialog.title')}</h3>
            <p className="text-[14px] text-steel-gray leading-relaxed">
              {t.rich('clearDialog.description', {
                count: files.length,
                size: formatBytes(storageQuota.usedBytes),
                bold: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>
            <div className="flex justify-end gap-2 pt-3 border-t border-black/5">
              <Button variant="ghost" size="sm" onClick={() => setIsClearStorageOpen(false)}>
                {t('clearDialog.cancel')}
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white border-0"
                onClick={handleClearAllStorage}
              >
                {t('clearDialog.confirm')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

