import * as React from 'react';
import { ArrowRight, Globe } from 'lucide-react';
import { cn } from '../lib/utils';
import { Button } from './button';

export interface NavbarProps {
  locale?: string;
  isLoggedIn?: boolean;
  className?: string;
}

export function Navbar({ locale = 'uk', isLoggedIn = false, className }: NavbarProps) {
  return (
    <header className={cn('sticky top-0 z-40 w-full px-4 pt-4 md:pt-[34px] pointer-events-none', className)}>
      <nav
        aria-label="Главная навигация"
        className="pointer-events-auto mx-auto flex max-w-fit items-center justify-between gap-4 md:gap-8 rounded-nav border-[0.5px] border-black/[0.08] bg-pure-white px-3 md:px-5 py-2"
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
        <div className="hidden md:flex items-center gap-6 text-[14px] font-book text-off-black">
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

        {/* Правый блок: Языки и вход/кабинет */}
        <div className="flex items-center gap-2.5">
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

