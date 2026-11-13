'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Search, KeyRound, PauseCircle, PlayCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Input } from '@/shared/ui/input';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import type { AdminUserItem, EmergencyActionModalState } from '../model/types';
import type { StaffRole } from '@doc-converter/contracts';

interface AdminUsersSectionProps {
  users: AdminUserItem[];
  userSearch: string;
  setUserSearch: (v: string) => void;
  userFilter: 'all' | 'active' | 'paused';
  setUserFilter: (v: 'all' | 'active' | 'paused') => void;
  staffRole: StaffRole;
  onOpenEmergencyModal: (
    type: EmergencyActionModalState['type'],
    targetUserId?: string,
    userEmail?: string
  ) => void;
}

export function AdminUsersSection({
  users,
  userSearch,
  setUserSearch,
  userFilter,
  setUserFilter,
  staffRole,
  onOpenEmergencyModal,
}: AdminUsersSectionProps) {
  const t = useTranslations('admin.users');

  const isAdmin = staffRole === 'admin';

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 МБ';
    const mb = bytes / (1024 * 1024);
    if (mb < 1024) return `${mb.toFixed(0)} МБ`;
    const gb = mb / 1024;
    return `${gb.toFixed(1)} ГБ`;
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
            {!isAdmin && (
              <Badge variant="muted" className="text-amber-700 bg-amber-500/10 border-amber-500/20">
                {t('supportNotice')}
              </Badge>
            )}
          </div>

          {/* Панель поиска и фильтрации */}
          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-steel-gray" />
              <Input
                type="text"
                placeholder={t('search')}
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="pl-10 rounded-full h-10 text-[14px]"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto">
              <Button
                variant={userFilter === 'all' ? 'floating-cta' : 'secondary'}
                size="sm"
                onClick={() => setUserFilter('all')}
                className={`rounded-full text-[14px] h-9 ${userFilter === 'all' ? 'bg-off-black text-pure-white hover:bg-black/80' : ''}`}
              >
                {t('filterAll')}
              </Button>
              <Button
                variant={userFilter === 'active' ? 'floating-cta' : 'secondary'}
                size="sm"
                onClick={() => setUserFilter('active')}
                className={`rounded-full text-[14px] h-9 ${userFilter === 'active' ? 'bg-off-black text-pure-white hover:bg-black/80' : ''}`}
              >
                {t('filterActive')}
              </Button>
              <Button
                variant={userFilter === 'paused' ? 'floating-cta' : 'secondary'}
                size="sm"
                onClick={() => setUserFilter('paused')}
                className={`rounded-full text-[14px] h-9 ${userFilter === 'paused' ? 'bg-off-black text-pure-white hover:bg-black/80' : ''}`}
              >
                {t('filterPaused')}
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-black/10 text-steel-gray font-regular">
                  <th className="pb-3 pr-4 font-normal">{t('colUser')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colPlan')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colQuotas')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colStorage')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colStatus')}</th>
                  <th className="pb-3 pl-4 font-normal text-right">{t('colActions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 font-book text-off-black">
                {users.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-steel-gray">
                      Пользователи по заданным критериям не найдены
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id} className="hover:bg-black/[0.02] transition-colors">
                      {/* Email + ID */}
                      <td className="py-4 pr-4">
                        <div className="font-regular">{user.email}</div>
                        <div className="font-mono text-[14px] text-steel-gray">{user.id}</div>
                      </td>

                      {/* Тариф */}
                      <td className="py-4 px-4">
                        <Badge variant="neutral" className="uppercase text-[14px]">
                          {user.plan}
                        </Badge>
                      </td>

                      {/* Квоты (документы / фото) */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div>
                          Док: <span className="font-regular">{user.docsUsed}</span> / {user.docsLimit}
                        </div>
                        <div className="text-[14px] text-steel-gray">
                          Фото: <span className="font-regular">{user.imagesUsed}</span> / {user.imagesLimit}
                        </div>
                      </td>

                      {/* Постоянное хранилище */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        {user.storageMaxBytes > 0 ? (
                          <div>
                            <span className="font-regular">{formatBytes(user.storageUsedBytes)}</span>
                            <span className="text-[14px] text-steel-gray"> / {formatBytes(user.storageMaxBytes)}</span>
                          </div>
                        ) : (
                          <span className="text-steel-gray">Гостевой (12ч)</span>
                        )}
                      </td>

                      {/* Статус */}
                      <td className="py-4 px-4">
                        {user.isConversionsPaused ? (
                          <div className="space-y-0.5">
                            <Badge variant="muted" className="bg-red-500/10 text-red-600 border-none">
                              Приостановлен
                            </Badge>
                            {user.pauseReason && (
                              <p className="text-[14px] text-steel-gray max-w-xs truncate" title={user.pauseReason}>
                                {user.pauseReason}
                              </p>
                            )}
                          </div>
                        ) : (
                          <Badge variant="signal-chip" className="bg-emerald-500/10 text-emerald-700 border-none">
                            Активен
                          </Badge>
                        )}
                      </td>

                      {/* Действия */}
                      <td className="py-4 pl-4 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Пауза / Возобновление */}
                          {user.isConversionsPaused ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!isAdmin}
                              onClick={() => onOpenEmergencyModal('user_resume', user.id, user.email)}
                              className="rounded-full h-8 text-[14px] gap-1 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/10"
                            >
                              <PlayCircle className="w-3 h-3" />
                              Возобновить
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!isAdmin}
                              onClick={() => onOpenEmergencyModal('user_pause', user.id, user.email)}
                              className="rounded-full h-8 text-[14px] gap-1 text-amber-600 border-amber-500/30 hover:bg-amber-500/10"
                            >
                              <PauseCircle className="w-3 h-3" />
                              Пауза
                            </Button>
                          )}

                          {/* Отзыв API ключа */}
                          {user.apiKeyStatus === 'active' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={!isAdmin}
                              onClick={() => onOpenEmergencyModal('revoke_api_key', user.id, user.email)}
                              className="rounded-full h-8 text-[14px] gap-1 text-red-600 border-red-500/30 hover:bg-red-500/10"
                              title="Отключить API-ключ (значение ключа администратору не раскрывается)"
                            >
                              <KeyRound className="w-3 h-3" />
                              Отключить ключ
                            </Button>
                          ) : user.apiKeyStatus === 'revoked' ? (
                            <span className="text-[14px] text-steel-gray px-2">Ключ отключен</span>
                          ) : (
                            <span className="text-[14px] text-steel-gray px-2">—</span>
                          )}
                        </div>
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
