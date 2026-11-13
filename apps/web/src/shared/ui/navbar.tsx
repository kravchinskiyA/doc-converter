'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, ChevronDown, CheckCircle2, Clock, Menu, X } from 'lucide-react';
import { cn } from '../lib/utils';
import { Link, usePathname } from '../i18n';
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
  | 'designSystem'
  | 'pdfToDocx'
  | 'docxToPdf'
  | 'imagesToPdf'
  | 'pdfToImages'
  | 'results'
  | 'login'
  | 'register'
  | 'verifyEmail'
  | 'forgotPassword'
  | 'resetPassword'
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
      { key: 'pricing', href: '/pricing', status: 'ready' },
      { key: 'designSystem', href: '/design-system', status: 'ready' },
    ],
  },
  {
    category: 'converters',
    items: [
      { key: 'pdfToDocx', href: '/convert/pdf-to-docx', status: 'ready' },
      { key: 'docxToPdf', href: '/convert/docx-to-pdf', status: 'ready' },
      { key: 'imagesToPdf', href: '/convert/images-to-pdf', status: 'ready' },
      { key: 'pdfToImages', href: '/convert/pdf-to-images', status: 'ready' },
    ],
  },
  {
    category: 'results',
    items: [{ key: 'results', href: '/results/demo-job-1', status: 'ready', step: '1.5' }],
  },
  {
    category: 'auth',
    items: [
      { key: 'login', href: '/auth/login', status: 'ready' },
      { key: 'register', href: '/auth/register', status: 'ready' },
      { key: 'verifyEmail', href: '/auth/verify-email', status: 'ready' },
      { key: 'forgotPassword', href: '/auth/forgot-password', status: 'ready' },
      { key: 'resetPassword', href: '/auth/reset-password', status: 'ready' },
      { key: 'recoveryCode', href: '/auth/recovery-code', status: 'ready' },
    ],
  },
  {
    category: 'service',
    items: [
      { key: 'account', href: '/account', status: 'ready', step: '1.7' },
      { key: 'adminLogin', href: '/admin/login', status: 'ready', step: '1.9' },
      { key: 'adminDashboard', href: '/admin/dashboard', status: 'ready', step: '1.9' },
      { key: 'apiDocs', href: '/api-docs', status: 'ready' },
      { key: 'terms', href: '/terms', status: 'ready' },
      { key: 'privacy', href: '/privacy', status: 'ready' },
    ],
  },
];

const PRIMARY_NAV_LINKS = [
  { key: 'pdfToDocx', href: '/convert/pdf-to-docx' },
  { key: 'docxToPdf', href: '/convert/docx-to-pdf' },
  { key: 'imagesToPdf', href: '/convert/images-to-pdf' },
  { key: 'pricing', href: '/pricing' },
] as const;

export function Navbar({ isLoggedIn = false, className }: NavbarProps) {
  const t = useTranslations('navigation');
  const pathname = usePathname();
  const [isPagesOpen, setIsPagesOpen] = React.useState(false);
  const [isMobileOpen, setIsMobileOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement | null>(null);
  const headerRef = React.useRef<HTMLElement | null>(null);

  // Закрытие мобильного меню при смене маршрута
  React.useEffect(() => {
    setIsMobileOpen(false);
    setIsPagesOpen(false);
  }, [pathname]);

  // Закрытие выпадающих меню при клике снаружи или нажатии Escape
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (dropdownRef.current && !dropdownRef.current.contains(target)) {
        setIsPagesOpen(false);
      }
      if (headerRef.current && !headerRef.current.contains(target)) {
        setIsMobileOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        setIsPagesOpen(false);
        setIsMobileOpen(false);
      }
    }

    if (isPagesOpen || isMobileOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPagesOpen, isMobileOpen]);

  // Блокировка прокрутки страницы при открытом полноэкранном мобильном меню
  React.useEffect(() => {
    if (!isMobileOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isMobileOpen]);

  return (
    <header
      ref={headerRef}
      className={cn('sticky top-0 z-40 w-full px-4 pt-4 md:pt-[34px] pointer-events-none', className)}
    >
      <nav
        aria-label={t('ariaLabel')}
        className="pointer-events-auto relative mx-auto flex w-full md:w-auto md:max-w-fit items-center justify-between gap-3 md:gap-7 rounded-nav border-[0.5px] border-black/[0.08] bg-pure-white px-3.5 md:px-5 py-2"
      >
        {/* Логотип */}
        <Link
          href="/"
          className="text-[15px] font-regular tracking-tight text-off-black hover:text-signal-blue transition-colors flex items-center gap-2 shrink-0"
        >
          <span className="h-2 w-2 rounded-full bg-signal-blue inline-block" />
          <span className="font-regular">doc-converter</span>
        </Link>

        {/* Навигационные ссылки (Desktop) */}
        <div className="hidden md:flex items-center gap-5 text-[14px] font-book text-off-black">
          {PRIMARY_NAV_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'hover:text-signal-blue transition-colors',
                pathname === item.href && 'text-signal-blue'
              )}
            >
              {t(`links.${item.key}`)}
            </Link>
          ))}
        </div>

        {/* Временное меню "Страницы" с выпадающим списком */}
        <div ref={dropdownRef} className="relative hidden sm:block">
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

        {/* Правый блок: Языки, вход/кабинет и мобильный бургер */}
        <div className="flex items-center gap-2">
          <LocaleSwitcher />

          <div className="hidden md:block">
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

          {/* Кнопка мобильного меню (Burger) */}
          <button
            type="button"
            onClick={() => {
              setIsMobileOpen((prev) => !prev);
              setIsPagesOpen(false);
            }}
            aria-expanded={isMobileOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileOpen ? t('mobileMenu.close') : t('mobileMenu.open')}
            className={cn(
              'md:hidden h-8 w-8 rounded-[10px] border-[0.5px] flex items-center justify-center transition-colors shrink-0',
              isMobileOpen
                ? 'border-signal-blue/40 bg-signal-blue/[0.06] text-signal-blue'
                : 'border-black/[0.08] bg-black/[0.02] text-off-black hover:border-black/20'
            )}
          >
            {isMobileOpen ? (
              <X className="h-4 w-4 stroke-[1.75]" />
            ) : (
              <Menu className="h-4 w-4 stroke-[1.75]" />
            )}
          </button>
        </div>
      </nav>

      {/* Полноэкранная мобильная панель навигации (выезжает справа) */}
      <div
        id="mobile-navigation"
        aria-hidden={!isMobileOpen}
        className={cn(
          'md:hidden fixed inset-0 z-50 bg-pure-white flex flex-col transition-transform duration-300 ease-out',
          isMobileOpen
            ? 'translate-x-0 pointer-events-auto'
            : 'translate-x-full pointer-events-none'
        )}
      >
        {/* Верхняя панель мобильного меню */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b-[0.5px] border-black/[0.06]">
          <Link
            href="/"
            onClick={() => setIsMobileOpen(false)}
            className="text-[15px] font-regular tracking-tight text-off-black hover:text-signal-blue transition-colors flex items-center gap-2"
          >
            <span className="h-2 w-2 rounded-full bg-signal-blue inline-block" />
            <span className="font-regular">doc-converter</span>
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label={t('mobileMenu.close')}
            className="h-8 w-8 rounded-[10px] border-[0.5px] border-black/[0.08] bg-black/[0.02] text-off-black hover:border-black/20 flex items-center justify-center transition-colors"
          >
            <X className="h-4 w-4 stroke-[1.75]" />
          </button>
        </div>

        {/* Центрированные ссылки и кнопка входа */}
        <div className="flex-1 flex flex-col items-center justify-center px-6 py-8 gap-8 overflow-y-auto">
          <nav
            aria-label={t('mobileMenu.title')}
            className="flex flex-col items-center gap-3 w-full max-w-[300px]"
          >
            {PRIMARY_NAV_LINKS.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileOpen(false)}
                  className={cn(
                    'w-full flex items-center justify-center px-5 py-3 rounded-[16px] text-[20px] font-book tracking-tight transition-colors text-center',
                    isActive
                      ? 'bg-signal-blue/[0.06] text-signal-blue'
                      : 'text-off-black hover:bg-black/[0.03] hover:text-signal-blue'
                  )}
                >
                  {t(`links.${item.key}`)}
                </Link>
              );
            })}
          </nav>

          <div className="flex flex-col items-center gap-4 w-full max-w-[240px] pt-4 border-t-[0.5px] border-black/[0.06]">
            {isLoggedIn ? (
              <Link
                href="/account"
                onClick={() => setIsMobileOpen(false)}
                className="w-full flex justify-center"
              >
                <Button size="lg" variant="floating-cta" className="w-full justify-center">
                  <span>{t('account')}</span>
                  <ArrowRight className="h-4 w-4 text-signal-blue" />
                </Button>
              </Link>
            ) : (
              <Link
                href="/auth/login"
                onClick={() => setIsMobileOpen(false)}
                className="w-full flex justify-center"
              >
                <Button size="lg" variant="floating-cta" className="w-full justify-center">
                  <span>{t('login')}</span>
                  <ArrowRight className="h-4 w-4 text-signal-blue" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
