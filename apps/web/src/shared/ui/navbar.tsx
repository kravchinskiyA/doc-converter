'use client';

import * as React from 'react';
import { ArrowRight, Globe, ChevronDown, CheckCircle2, Clock } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './button';

export interface NavbarProps {
  locale?: string;
  isLoggedIn?: boolean;
  className?: string;
}

interface PageLinkItem {
  title: string;
  href: string;
  status: 'ready' | 'planned';
  tag?: string;
}

interface PageCategory {
  category: string;
  items: PageLinkItem[];
}

export function Navbar({ locale = 'uk', isLoggedIn = false, className }: NavbarProps) {
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

  const pageGroups: PageCategory[] = [
    {
      category: 'Главные',
      items: [
        { title: 'Главная страница (Пункт 1.3)', href: `/${locale}`, status: 'ready', tag: 'Готово' },
        { title: 'Тарифы и подписка', href: `/${locale}/pricing`, status: 'planned', tag: '1.8' },
      ],
    },
    {
      category: 'Конвертеры (Пункт 1.4)',
      items: [
        { title: 'PDF → DOCX (OCR с миниатюрами)', href: `/${locale}/convert/pdf-to-docx`, status: 'planned', tag: '1.4' },
        { title: 'DOCX → PDF (LibreOffice)', href: `/${locale}/convert/docx-to-pdf`, status: 'planned', tag: '1.4' },
        { title: 'Изображения → PDF (A4 10мм)', href: `/${locale}/convert/images-to-pdf`, status: 'planned', tag: '1.4' },
        { title: 'PDF → Изображения (DPI / WebP)', href: `/${locale}/convert/pdf-to-images`, status: 'planned', tag: '1.4' },
      ],
    },
    {
      category: 'Результаты (Пункт 1.5)',
      items: [
        { title: 'Статус задачи и скачивание ZIP', href: `/${locale}/results/demo-job-1`, status: 'planned', tag: '1.5' },
      ],
    },
    {
      category: 'Авторизация (Пункт 1.6)',
      items: [
        { title: 'Вход в аккаунт', href: `/${locale}/auth/login`, status: 'planned', tag: '1.6' },
        { title: 'Регистрация', href: `/${locale}/auth/register`, status: 'planned', tag: '1.6' },
        { title: 'Подтверждение email (6 цифр)', href: `/${locale}/auth/verify-email`, status: 'planned', tag: '1.6' },
        { title: 'Сброс пароля', href: `/${locale}/auth/forgot-password`, status: 'planned', tag: '1.6' },
        { title: 'Резервный код восстановления', href: `/${locale}/auth/recovery-code`, status: 'planned', tag: '1.6' },
      ],
    },
    {
      category: 'Кабинет и Служебные (1.7, 1.9)',
      items: [
        { title: 'Личный кабинет пользователя', href: `/${locale}/account`, status: 'planned', tag: '1.7' },
        { title: 'Вход для персонала (TOTP 2FA)', href: `/${locale}/admin/login`, status: 'planned', tag: '1.9' },
        { title: 'Дашборд администратора', href: `/${locale}/admin/dashboard`, status: 'planned', tag: '1.9' },
        { title: 'Документация API', href: `/${locale}/api-docs`, status: 'planned', tag: '1.9' },
        { title: 'Условия использования', href: `/${locale}/terms`, status: 'planned', tag: '1.9' },
        { title: 'Политика конфиденциальности (GDPR)', href: `/${locale}/privacy`, status: 'planned', tag: '1.9' },
      ],
    },
  ];

  return (
    <header className={cn('sticky top-0 z-40 w-full px-4 pt-4 md:pt-[34px] pointer-events-none', className)}>
      <nav
        aria-label="Главная навигация"
        className="pointer-events-auto relative mx-auto flex max-w-fit items-center justify-between gap-3 md:gap-7 rounded-nav border-[0.5px] border-black/[0.08] bg-pure-white px-3 md:px-5 py-2"
      >
        {/* Логотип */}
        <a
          href={`/${locale}`}
          className="text-[15px] font-regular tracking-tight text-off-black hover:text-signal-blue transition-colors flex items-center gap-2"
        >
          <span className="h-2 w-2 rounded-full bg-signal-blue inline-block" />
          <span className="font-regular">doc-converter</span>
        </a>

        {/* Навигационные ссылки */}
        <div className="hidden md:flex items-center gap-5 text-[14px] font-book text-off-black">
          <a
            href={`/${locale}/convert/pdf-to-docx`}
            className="hover:text-signal-blue transition-colors"
          >
            PDF → DOCX
          </a>
          <a
            href={`/${locale}/convert/docx-to-pdf`}
            className="hover:text-signal-blue transition-colors"
          >
            DOCX → PDF
          </a>
          <a
            href={`/${locale}/convert/images-to-pdf`}
            className="hover:text-signal-blue transition-colors"
          >
            Изображения → PDF
          </a>
          <a
            href={`/${locale}/pricing`}
            className="hover:text-signal-blue transition-colors"
          >
            Тарифы
          </a>
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
            <span>Страницы</span>
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
                  Навигатор по страницам
                </span>
                <span className="text-[11px] font-book text-steel-gray">
                  dev-меню
                </span>
              </div>

              <div className="space-y-3 pt-1">
                {pageGroups.map((group) => (
                  <div key={group.category} className="space-y-1">
                    <p className="px-2.5 text-[10px] font-regular text-ash-gray uppercase tracking-wider">
                      {group.category}
                    </p>
                    <div className="space-y-0.5">
                      {group.items.map((item) => (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsPagesOpen(false)}
                          className="flex items-center justify-between px-2.5 py-1.5 rounded-[10px] text-[13px] font-book text-off-black hover:bg-black/[0.03] hover:text-signal-blue transition-colors group"
                        >
                          <span className="truncate pr-2">{item.title}</span>
                          <span className="shrink-0 flex items-center gap-1 text-[11px]">
                            {item.status === 'ready' ? (
                              <span className="inline-flex items-center gap-1 text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-[6px]">
                                <CheckCircle2 className="h-2.5 w-2.5" />
                                {item.tag}
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-ash-gray bg-black/[0.03] px-1.5 py-0.5 rounded-[6px] group-hover:text-steel-gray">
                                <Clock className="h-2.5 w-2.5" />
                                {item.tag}
                              </span>
                            )}
                          </span>
                        </a>
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
          <div className="flex items-center gap-1 text-[13px] text-steel-gray px-2 py-1 rounded-[6px] border-[0.5px] border-black/5 bg-black/[0.02]">
            <Globe className="h-3.5 w-3.5 text-ash-gray" />
            <span className="uppercase text-[11px] font-regular">{locale}</span>
          </div>

          {isLoggedIn ? (
            <a href={`/${locale}/account`}>
              <Button size="sm" variant="floating-cta">
                Кабинет
              </Button>
            </a>
          ) : (
            <a href={`/${locale}/auth/login`}>
              <Button size="sm" variant="floating-cta">
                Войти
                <ArrowRight className="h-3.5 w-3.5 text-signal-blue" />
              </Button>
            </a>
          )}
        </div>
      </nav>
    </header>
  );
}
