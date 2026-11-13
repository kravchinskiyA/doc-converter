'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Globe, ChevronDown } from 'lucide-react';
import { cn } from '../lib/utils';
import { isLocale, routing, usePathname, useRouter } from '../i18n';

export interface LocaleSwitcherProps {
  className?: string;
}

/**
 * Переключатель языка интерфейса. Сохраняет текущий путь и меняет только префикс локали;
 * выбор запоминается middleware next-intl в cookie `NEXT_LOCALE`.
 */
export function LocaleSwitcher({ className }: LocaleSwitcherProps) {
  const t = useTranslations('navigation.localeSwitcher');
  const tLanguages = useTranslations('common.languages');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = React.useTransition();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const nextLocale = event.target.value;
    if (!isLocale(nextLocale) || nextLocale === locale) return;

    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <label
      className={cn(
        'relative flex items-center gap-1 text-[14px] text-steel-gray pl-2 pr-1.5 py-1 rounded-[6px] border-[0.5px] border-black/5 bg-black/[0.02] hover:border-black/15 transition-colors focus-within:border-signal-blue/50',
        isPending && 'opacity-60',
        className,
      )}
    >
      <span className="sr-only">{t('label')}</span>
      <Globe className="h-3.5 w-3.5 text-ash-gray" aria-hidden="true" />
      <span className="uppercase text-[14px] font-regular" aria-hidden="true">
        {locale}
      </span>
      <ChevronDown className="h-3 w-3 text-ash-gray" aria-hidden="true" />
      <select
        value={locale}
        onChange={handleChange}
        disabled={isPending}
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      >
        {routing.locales.map((item) => (
          <option key={item} value={item}>
            {tLanguages(item)}
          </option>
        ))}
      </select>
    </label>
  );
}

