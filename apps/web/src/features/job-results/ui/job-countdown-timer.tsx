'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Clock, ShieldCheck, UserPlus, AlertCircle } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Link } from '@/shared/i18n';
import type { CountdownState } from '../model/types';

interface JobCountdownTimerProps {
  countdown: CountdownState;
  isGuest: boolean;
}

export function JobCountdownTimer({ countdown, isGuest }: JobCountdownTimerProps) {
  const t = useTranslations('results.ttl');
  const tActions = useTranslations('results.actions');

  return (
    <div className="rounded-[28px] border-[0.5px] border-black/[0.06] bg-black/[0.02] p-5 sm:p-6 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Левая часть: информация о сроке хранения и GDPR */}
        <div className="space-y-2 max-w-xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="signal-chip" className="gap-1.5">
              <ShieldCheck className="h-3.5 w-3.5 text-signal-blue" />
              {t('badge')}
            </Badge>
            <Badge variant={isGuest ? 'neutral' : 'success'}>
              {isGuest ? t('guestBadge') : t('accountBadge')}
            </Badge>
          </div>
          <p className="text-[14px] leading-relaxed text-steel-gray font-book">
            {isGuest ? t('guestWarning') : t('accountBenefit')}
          </p>
        </div>

        {/* Правая часть: интерактивный счетчик обратного отсчета */}
        <div className="flex flex-col items-start md:items-end gap-1 shrink-0">
          <div className="text-[12px] font-book text-steel-gray flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-signal-blue" />
            {t('timeRemaining')}
          </div>

          {countdown.isExpired ? (
            <div className="flex items-center gap-1.5 text-red-600 font-book text-[14px]">
              <AlertCircle className="h-4 w-4" />
              <span>{t('expired')}</span>
            </div>
          ) : (
            <div className="flex items-baseline gap-2 font-mono text-[22px] sm:text-[26px] tracking-tight text-off-black">
              <span className="bg-pure-white border-[0.5px] border-black/10 px-2.5 py-0.5 rounded-[10px]">
                {String(countdown.hours).padStart(2, '0')}
                <span className="text-[11px] font-sans text-steel-gray ml-1">
                  {t('hours')}
                </span>
              </span>
              <span className="text-steel-gray/50">:</span>
              <span className="bg-pure-white border-[0.5px] border-black/10 px-2.5 py-0.5 rounded-[10px]">
                {String(countdown.minutes).padStart(2, '0')}
                <span className="text-[11px] font-sans text-steel-gray ml-1">
                  {t('minutes')}
                </span>
              </span>
              <span className="text-steel-gray/50">:</span>
              <span className="bg-pure-white border-[0.5px] border-black/10 px-2.5 py-0.5 rounded-[10px]">
                {String(countdown.seconds).padStart(2, '0')}
                <span className="text-[11px] font-sans text-steel-gray ml-1">
                  {t('seconds')}
                </span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Призыв зарегистрироваться для гостя для бессрочного сохранения до 6 месяцев */}
      {isGuest && !countdown.isExpired && (
        <div className="mt-4 pt-4 border-t border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[13px] font-book text-steel-gray">
          <span>{t('accountBenefit')}</span>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-1.5 text-signal-blue hover:underline whitespace-nowrap font-regular"
          >
            <UserPlus className="h-3.5 w-3.5" />
            <span>{tActions('signUpToSave')}</span>
          </Link>
        </div>
      )}
    </div>
  );
}
