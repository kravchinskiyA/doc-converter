'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link } from '../i18n';
import { Button } from './button';
import { LocaleSwitcher } from './locale-switcher';

export interface NavbarProps {
  isLoggedIn?: boolean;
  className?: string;
}

type DevMenuCategoryKey = 'main' | 'converters' | 'results' | 'auth' | 'service';

type DevMenuItemKey =
  | 'home'
  | 'pricing'
  | 'pdfToDocx'
  | 'docxToPdf'
  | 'imagesToPdf'
  | 'pdfToImages'
  | 'results'
  | 'login'
  | 'register'
  | 'verifyEmail'
  | 'forgotPassword'
  | 'recoveryCode'
  | 'account'
  | 'adminLogin'
  | 'adminDashboard'
  | 'apiDocs'
  | 'terms'
  | 'privacy';

interface PageLinkItem {
  key: DevMenuItemKey;
  /** Путь без префикса локали — его добавляет локализованный `Link`. */
  href: string;
  status: 'ready' | 'planned';
  /** Номер пункта плана реализации для незавершённых страниц. */
  step?: string;
}

interface PageCategory {
  category: DevMenuCategoryKey;
  items: PageLinkItem[];
}

const PAGE_GROUPS: PageCategory[] = [
  {
    category: 'main',
    items: [
      { key: 'home', href: '/', status: 'ready' },
      { key: 'pricing', href: '/pricing', status: 'planned', step: '1.8' },
    ],
  },
  {
    category: 'converters',
    items: [
      { key: 'pdfToDocx', href: '/convert/pdf-to-docx', status: 'planned', step: '1.4' },
      { key: 'docxToPdf', href: '/convert/docx-to-pdf', status: 'planned', step: '1.4' },
      { key: 'imagesToPdf', href: '/convert/images-to-pdf', status: 'planned', step: '1.4' },
      { key: 'pdfToImages', href: '/convert/pdf-to-images', status: 'planned', step: '1.4' },
    ],
  },
  {
    category: 'results',
    items: [{ key: 'results', href: '/results/demo-job-1', status: 'planned', step: '1.5' }],
  },
  {
    category: 'auth',
    items: [
      { key: 'login', href: '/auth/login', status: 'planned', step: '1.6' },
      { key: 'register', href: '/auth/register', status: 'planned', step: '1.6' },
      { key: 'verifyEmail', href: '/auth/verify-email', status: 'planned', step: '1.6' },
      { key: 'forgotPassword', href: '/auth/forgot-password', status: 'planned', step: '1.6' },
      { key: 'recoveryCode', href: '/auth/recovery-code', status: 'planned', step: '1.6' },
    ],
  },
  {
    category: 'service',
    items: [
      { key: 'account', href: '/account', status: 'planned', step: '1.7' },
      { key: 'adminLogin', href: '/admin/login', status: 'planned', step: '1.9' },
      { key: 'adminDashboard', href: '/admin/dashboard', status: 'planned', step: '1.9' },
      { key: 'apiDocs', href: '/api-docs', status: 'planned', step: '1.10' },
      { key: 'terms', href: '/terms', status: 'planned', step: '1.10' },
      { key: 'privacy', href: '/privacy', status: 'planned', step: '1.10' },
    ],
  },
];

export function Navbar({ isLoggedIn = false, className }: NavbarProps) {
  const t = useTranslations('navigation');
  const [isPagesOpen, setIsPagesOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);

  // Закрытие при клике снаружи или нажатии Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsPagesOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsPagesOpen(false);
      }
    }

    if (isPagesOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPagesOpen]);

  return (
    <header className={cn('sticky top-0 z-40 w-full px-4 pt-4 md:pt-[34px] pointer-events-none', className)}>
      <nav
        aria-label={t('ariaLabel')}
        className="pointer-events-auto relative mx-auto flex max-w-fit items-center justify-between gap-3 md:gap-7 rounded-nav border-[0.5px] border-black/[0.08] bg-pure-white px-3 md:px-5 py-2"
      >
        {/* Логотип */}
        <Link
          href="/"
          className="text-[15px] font-regular tracking-tight text-off-black hover:text-signal-blue transition-colors flex items-center gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-signal-blue inline-block" />
          <span className="font-regular">doc-converter</span>
        </Link>

        {/* Навигационные ссылки */}
        <div className="hidden md:flex items-center gap-5 text-[14px] font-book text-off-black">
          <Link href="/convert/pdf-to-docx" className="hover:text-signal-blue transition-colors">
            {t('links.pdfToDocx')}
          </Link>
          <Link href="/convert/docx-to-pdf" className="hover:text-signal-blue transition-colors">
            {t('links.docxToPdf')}
          </Link>
          <Link href="/convert/images-to-pdf" className="hover:text-signal-blue transition-colors">
            {t('links.imagesToPdf')}
          </Link>
          <Link href="/pricing" className="hover:text-signal-blue transition-colors">
            {t('links.pricing')}
          </Link>
        </div>

        {/* Временное меню "Страницы" с выпадающим списком */}
        <div ref={dropdownRef} className="relative">
          <button
            type="button"
            onClick={() => setIsPagesOpen((prev) => !prev)}
            aria-expanded={isPagesOpen}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1 rounded-[8px] text-[13px] font-book transition-all',
              isPagesOpen
                ? 'bg-signal-blue/10 text-signal-blue'
                : 'text-off-black hover:text-signal-blue hover:bg-black/[0.03]'
            )}
          >
            <span>{t('devMenu.trigger')}</span>
            <ChevronDown
              className={cn(
                'h-3.5 w-3.5 transition-transform duration-200',
                isPagesOpen && 'rotate-180 text-signal-blue'
              )}
            />
          </button>

          {/* Выпадающий список страниц */}
          {isPagesOpen && (
            <div className="absolute top-full mt-3.5 left-1/2 -translate-x-1/2 md:translate-x-0 md:left-auto md:right-0 w-[310px] sm:w-[360px] max-h-[72vh] overflow-y-auto bg-pure-white border-[0.5px] border-black/[0.1] rounded-[20px] p-2.5 z-50 text-left">
              <div className="px-2.5 py-1.5 mb-1 border-b border-black/[0.05] flex items-center justify-between">
                <span className="text-[11px] font-regular text-ash-gray uppercase tracking-wider">
                  {t('devMenu.title')}
                </span>
                <span className="text-[11px] font-book text-steel-gray">
                  {t('devMenu.badge')}
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {PAGE_GROUPS.map((group) => (
                  <div key={group.category} className="space-y-1">
                    <p className="px-2.5 text-[10px] font-regular text-ash-gray uppercase tracking-wider">
                      {t(`devMenu.categories.${group.category}`)}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsPagesOpen(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-[13px] font-book text-off-black hover:bg-black/[0.03] hover:text-signal-blue transition-colors group"
                        >
                          <span className="truncate pr-2">{t(`devMenu.items.${item.key}`)}</span>
                          <span className="shrink-0 flex items-center gap-1 text-[11px]">
                            {item.status === 'ready' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-[6px]">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                {t('devMenu.ready')}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-ash-gray bg-black/[0.03] px-1.5 py-0.5 rounded-[6px] group-hover:text-steel-gray">
                                <Clock className="h-2.5 w-2.5" />
                                {item.step}
                              </span>
                            )}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Правый блок: Языки и вход/кабинет */}
        <div className="flex items-center gap-2">
          <LocaleSwitcher />

          {isLoggedIn ? (
            <Link href="/account">
              <Button size="sm" variant="floating-cta">
                {t('account')}
              </Button>
            </Link>
          ) : (
            <Link href="/auth/login">
              <Button size="sm" variant="floating-cta">
                {t('login')}
                <ArrowRight className="h-3.5 w-3.5 text-signal-blue" />
              </Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
