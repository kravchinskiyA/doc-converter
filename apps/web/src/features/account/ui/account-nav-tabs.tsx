'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  User,
  HardDrive,
  Files,
  KeyRound,
  CreditCard,
  ShieldAlert,
  HelpCircle,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { AccountTabKey } from '../model/types';

interface AccountNavTabsProps {
  activeTab: AccountTabKey;
  onTabChange: (tab: AccountTabKey) => void;
  storageWarning?: boolean;
  hasPendingSupportRequests?: boolean;
  fileCount?: number;
}

export function AccountNavTabs({
  activeTab,
  onTabChange,
  storageWarning,
  hasPendingSupportRequests,
  fileCount = 0,
}: AccountNavTabsProps) {
  const t = useTranslations('account.tabs');

  const tabs: {
    id: AccountTabKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeVariant?: 'warning' | 'info' | 'danger';
  }[] = [
    { id: 'profile', label: t('profile'), icon: User },
    {
      id: 'storage',
      label: t('storage'),
      icon: HardDrive,
      badge: storageWarning ? '≥75%' : undefined,
      badgeVariant: 'warning',
    },
    {
      id: 'files',
      label: t('files'),
      icon: Files,
      badge: fileCount > 0 ? fileCount : undefined,
      badgeVariant: 'info',
    },
    { id: 'apiKey', label: t('apiKey'), icon: KeyRound },
    { id: 'subscription', label: t('subscription'), icon: CreditCard },
    { id: 'recovery', label: t('recovery'), icon: ShieldAlert },
    {
      id: 'support',
      label: t('support'),
      icon: HelpCircle,
      badge: hasPendingSupportRequests ? '1' : undefined,
      badgeVariant: 'warning',
    },
    { id: 'danger', label: t('danger'), icon: AlertTriangle },
  ];

  return (
    <nav className="flex w-full overflow-x-auto no-scrollbar gap-1.5 p-1.5 rounded-full border-[0.5px] border-black/10 bg-pure-white max-w-full">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'group inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-[14px] font-regular tracking-tight transition-all shrink-0',
              isActive
                ? 'bg-[#0f1012] text-pure-white font-book'
                : 'text-off-black hover:bg-black/[0.04]'
            )}
          >
            <Icon
              className={cn(
                'h-3.5 w-3.5 transition-colors',
                isActive ? 'text-pure-white' : 'text-steel-gray group-hover:text-off-black'
              )}
            />
            <span>{tab.label}</span>
            {tab.badge && (
              <span
                className={cn(
                  'ml-0.5 rounded-full px-1.5 py-0.2 text-[14px] font-regular leading-none',
                  tab.badgeVariant === 'warning'
                    ? 'bg-amber-500/20 text-amber-700'
                    : tab.badgeVariant === 'danger'
                    ? 'bg-red-500/20 text-red-700'
                    : isActive
                    ? 'bg-white/20 text-pure-white'
                    : 'bg-black/[0.06] text-steel-gray'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </nav>
  );
}

