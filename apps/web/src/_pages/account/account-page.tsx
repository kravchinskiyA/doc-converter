'use client';

import * as React from 'react';
import {
  AccountNavTabs,
  ProfileSection,
  StorageSection,
  SavedFilesTable,
  ApiKeySection,
  SubscriptionSection,
  SecurityCodesSection,
  StaffAccessSection,
  DangerZoneSection,
  useAccountState,
} from '@/features/account';
import { Badge } from '@/shared/ui/badge';

export function AccountPage() {
  const account = useAccountState();

  return (
    <div className="min-h-screen bg-[#f2f2f4] text-off-black">
      <div className="px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {/* Заголовок страницы */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="signal-chip">Личный кабинет</Badge>
            <Badge variant="neutral">GDPR & ISO/IEC 27001</Badge>
            <Badge variant="muted">ЕС Юрисдикция</Badge>
          </div>
          <h1 className="text-[28px] md:text-[38px] font-book tracking-tight text-off-black">
            Управление аккаунтом и хранилищем
          </h1>
          <p className="text-[15px] md:text-[16px] text-steel-gray font-book max-w-2xl leading-relaxed">
            Настройки безопасности, мониторинг квоты дискового пространства, скачивание результатов
            конвертации и управление подпиской.
          </p>
        </div>

        {/* Навигационная панель вкладок Augen Pro */}
        <div className="sticky top-20 z-20 pt-1 pb-2 bg-[#f2f2f4]/90 backdrop-blur-md">
          <AccountNavTabs
            activeTab={account.activeTab}
            onTabChange={account.setActiveTab}
            storageWarning={account.storageQuota.isOver75}
            hasPendingSupportRequests={account.supportRequests.some(
              (r) => r.status === 'pending'
            )}
            fileCount={account.files.length}
          />
        </div>

        {/* Контент активной вкладки */}
        <div className="pt-2">
          {account.activeTab === 'profile' && <ProfileSection {...account} />}
          {account.activeTab === 'storage' && <StorageSection {...account} />}
          {account.activeTab === 'files' && <SavedFilesTable {...account} />}
          {account.activeTab === 'apiKey' && <ApiKeySection {...account} />}
          {account.activeTab === 'subscription' && <SubscriptionSection {...account} />}
          {account.activeTab === 'recovery' && <SecurityCodesSection {...account} />}
          {account.activeTab === 'support' && <StaffAccessSection {...account} />}
          {account.activeTab === 'danger' && <DangerZoneSection {...account} />}
        </div>
      </div>
    </div>
  );
}

