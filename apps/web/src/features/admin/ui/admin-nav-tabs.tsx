'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Activity,
  Users,
  Clock,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import type { AdminTabKey } from '../model/types';

interface AdminNavTabsProps {
  activeTab: AdminTabKey;
  onTabChange: (tab: AdminTabKey) => void;
  failedJobsCount?: number;
  globalPaused?: boolean;
}

export function AdminNavTabs({
  activeTab,
  onTabChange,
  failedJobsCount = 0,
  globalPaused = false,
}: AdminNavTabsProps) {
  const t = useTranslations('admin.tabs');

  const tabs: {
    id: AdminTabKey;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: string | number;
    badgeVariant?: 'danger' | 'warning' | 'info';
  }[] = [
    { id: 'metrics', label: t('metrics'), icon: Activity },
    { id: 'users', label: t('users'), icon: Users },
    {
      id: 'jobs',
      label: t('jobs'),
      icon: Clock,
      badge: failedJobsCount > 0 ? failedJobsCount : undefined,
      badgeVariant: 'danger',
    },
    { id: 'billing', label: t('billing'), icon: CreditCard },
    {
      id: 'emergency',
      label: t('emergency'),
      icon: AlertTriangle,
      badge: globalPaused ? 'PAUSED' : undefined,
      badgeVariant: 'danger',
    },
    { id: 'audit', label: t('audit'), icon: ShieldCheck },
  ];

  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-b border-black/10">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2.5 rounded-full text-[13px] md:text-[14px] font-regular transition-all whitespace-nowrap shrink-0',
              isActive
                ? 'bg-off-black text-pure-white'
                : 'text-steel-gray hover:text-off-black hover:bg-black/5'
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span>{tab.label}</span>

            {tab.badge !== undefined && (
              <span
                className={cn(
                  'px-2 py-0.5 rounded-full text-[11px] font-medium leading-none',
                  tab.badgeVariant === 'danger'
                    ? 'bg-red-500 text-pure-white'
                    : 'bg-signal-blue text-pure-white'
                )}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

