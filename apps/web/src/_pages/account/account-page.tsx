'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
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

export function AccountPage() {
  const t = useTranslations('account.header');
  const account = useAccountState();

  return (
    <div className="min-h-screen bg-[#f2f2f4] text-off-black">
      <div className="px-4 sm:px-6 lg:px-8 pb-20 space-y-8">
        {/* Заголовок страницы */}
        <div className="space-y-3">
          <h1 className="text-[28px] md:text-[38px] font-book tracking-tight text-off-black">
            {t('title')}
          </h1>
          <p className="text-[15px] md:text-[16px] text-steel-gray font-book max-w-2xl leading-relaxed">
            {t('description')}
          </p>
        </div>

        {/* Двухколоночная область: вертикальная навигация + контент активной вкладки */}
        <div className="flex flex-col lg:flex-row lg:items-start gap-4">
          {/* Первая колонка: навигационная панель вкладок Augen Pro */}
          <aside className="w-full lg:w-[220px] shrink-0 sticky top-20 z-20 lg:top-24 bg-[#f2f2f4]/90 backdrop-blur-md lg:bg-transparent lg:backdrop-blur-none py-1 lg:py-0">
            <AccountNavTabs
              activeTab={account.activeTab}
              onTabChange={account.setActiveTab}
              storageWarning={account.storageQuota.isOver75}
              hasPendingSupportRequests={account.supportRequests.some(
                (r) => r.status === 'pending'
              )}
              fileCount={account.files.length}
            />
          </aside>

          {/* Вторая колонка: контент активной вкладки */}
          <div className="flex-1 min-w-0 w-full">
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
    </div>
  );
}

