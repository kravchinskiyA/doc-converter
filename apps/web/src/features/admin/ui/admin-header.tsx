'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { UserCheck, RefreshCw, LogOut, ShieldAlert } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import type { StaffSession } from '../model/types';
import type { StaffRole } from '@doc-converter/contracts';

interface AdminHeaderProps {
  session: StaffSession;
  onLogout: () => void;
  onSwitchRole: (newRole: StaffRole) => void;
  globalPauseActive?: boolean;
}

export function AdminHeader({
  session,
  onLogout,
  onSwitchRole,
  globalPauseActive,
}: AdminHeaderProps) {
  const t = useTranslations('admin.header');

  const isRoleAdmin = session.role === 'admin';

  return (
    <div className="space-y-4">
      {/* Предупреждение о глобальной паузе если активна */}
      {globalPauseActive && (
        <div className="rounded-[24px] bg-red-500/10 border border-red-500/20 p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-red-700">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <span className="text-[14px] font-book">
              Внимание: Прием новых конвертаций экстренно ПРИОСТАНОВЛЕН на всем сервисе.
            </span>
          </div>
          <Badge variant="signal-chip" className="bg-red-600 text-pure-white border-none shrink-0">
            PAUSED
          </Badge>
        </div>
      )}

      {/* Верхний ряд бейджей и статуса */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="signal-chip">{t('regionBadge')}</Badge>
          <Badge variant="neutral">{t('twoFactorBadge')}</Badge>
          <Badge
            variant={isRoleAdmin ? 'signal-chip' : 'muted'}
            className={isRoleAdmin ? 'bg-signal-blue text-pure-white border-none' : ''}
          >
            {isRoleAdmin ? 'Роль: Администратор' : 'Роль: Поддержка (Read-only)'}
          </Badge>
        </div>

        {/* Профиль оператора и действия */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-[14px] text-steel-gray font-book">
            <UserCheck className="w-4 h-4 text-signal-blue" />
            <span>{t('signedInAs')}</span>
            <span className="text-off-black font-regular">{session.email}</span>
          </div>

          {/* Кнопка смены роли для удобства ревью */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSwitchRole(isRoleAdmin ? 'support' : 'admin')}
            className="rounded-full gap-1.5 text-[14px] h-8"
            title="Переключить между Администратором и Поддержкой"
          >
            <RefreshCw className="w-3 h-3" />
            {isRoleAdmin ? 'Тест: Поддержка' : 'Тест: Администратор'}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={onLogout}
            className="rounded-full gap-1.5 text-[14px] h-8 text-red-600 hover:bg-red-500/10"
          >
            <LogOut className="w-3.5 h-3.5" />
            {t('logout')}
          </Button>
        </div>
      </div>

      {/* Главный заголовок */}
      <div>
        <h1 className="text-[28px] md:text-[38px] font-book tracking-tight text-off-black">
          {t('title')}
        </h1>
        <p className="text-[15px] md:text-[16px] text-steel-gray font-book max-w-2xl leading-relaxed">
          {t('subtitle')}
        </p>
      </div>
    </div>
  );
}
