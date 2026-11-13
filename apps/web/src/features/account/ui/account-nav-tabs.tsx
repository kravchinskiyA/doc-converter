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
  ChevronDown,
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isMobileMenuOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isMobileMenuOpen]);

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

  const fallbackTab: (typeof tabs)[number] = {
    id: 'profile',
    label: t('profile'),
    icon: User,
  };
  const currentTab = tabs.find((tab) => tab.id === activeTab) ?? fallbackTab;
  const CurrentIcon = currentTab.icon;

  const handleSelectTab = (tabId: AccountTabKey) => {
    onTabChange(tabId);
    setIsMobileMenuOpen(false);
  };

  const renderTabButtons = () =>
    tabs.map((tab) => {
      const Icon = tab.icon;
      const isActive = activeTab === tab.id;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => handleSelectTab(tab.id)}
          className={cn(
            'group inline-flex w-full items-center justify-start gap-2.5 text-left leading-snug rounded-[20px] px-4 py-2.5 text-[14px] font-regular tracking-tight transition-all',
            isActive
              ? 'bg-[#0f1012] text-pure-white font-book'
              : 'text-off-black hover:bg-black/[0.04]'
          )}
        >
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors',
              isActive ? 'text-pure-white' : 'text-steel-gray group-hover:text-off-black'
            )}
          />
          <span>{tab.label}</span>
          {tab.badge && (
            <span
              className={cn(
                'ml-auto rounded-full px-1.5 py-0.5 text-[14px] font-regular leading-none',
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
    });

  return (
    <>
      {/* Мобильная и планшетная кнопка с выпадающим списком */}
      <div ref={dropdownRef} className="relative inline-block lg:hidden">
        <button
          type="button"
          aria-expanded={isMobileMenuOpen}
          aria-haspopup="true"
          onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          className="inline-flex w-fit items-center gap-2.5 rounded-full border border-black/10 bg-pure-white px-4 py-2.5 text-[14px] font-book text-off-black transition-colors hover:bg-black/[0.02]"
        >
          <CurrentIcon className="h-4 w-4 shrink-0 text-off-black" />
          <span className="whitespace-nowrap">{currentTab.label}</span>
          {currentTab.badge && (
            <span
              className={cn(
                'rounded-full px-1.5 py-0.5 text-[14px] font-regular leading-none',
                currentTab.badgeVariant === 'warning'
                  ? 'bg-amber-500/20 text-amber-700'
                  : currentTab.badgeVariant === 'danger'
                  ? 'bg-red-500/20 text-red-700'
                  : 'bg-black/[0.06] text-steel-gray'
              )}
            >
              {currentTab.badge}
            </span>
          )}
          <ChevronDown
            className={cn(
              'h-4 w-4 shrink-0 text-steel-gray transition-transform duration-200',
              isMobileMenuOpen && 'rotate-180'
            )}
          />
        </button>

        {isMobileMenuOpen && (
          <nav className="absolute left-0 top-full z-30 mt-2 flex w-max min-w-[220px] max-w-[calc(100vw-2rem)] flex-col gap-1.5 rounded-[24px] border border-black/10 bg-pure-white p-2">
            {renderTabButtons()}
          </nav>
        )}
      </div>

      {/* Десктопная вертикальная навигация */}
      <nav className="hidden lg:flex lg:flex-col w-full gap-1.5 p-2 rounded-[28px] border border-black/10 bg-pure-white">
        {renderTabButtons()}
      </nav>
    </>
  );
}

