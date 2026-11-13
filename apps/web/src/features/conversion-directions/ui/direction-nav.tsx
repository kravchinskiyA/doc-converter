'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/shared/i18n';
import { cn } from '@/shared/lib/utils';
import type { ConversionDirection } from '@doc-converter/contracts';

interface DirectionNavProps {
  currentDirection: ConversionDirection;
  className?: string;
}

export function DirectionNav({ currentDirection, className }: DirectionNavProps) {
  const t = useTranslations('convert');

  const isActive = (itemDirection: ConversionDirection) => {
    if (itemDirection === currentDirection) return true;
    if (
      itemDirection === 'pdf-to-images' &&
      (currentDirection === 'pdf-to-jpg' || currentDirection === 'pdf-to-webp')
    ) {
      return true;
    }
    return false;
  };

  const navItems = [
    {
      direction: 'pdf-to-docx' as ConversionDirection,
      href: '/convert/pdf-to-docx',
      label: t('directions.pdfToDocx.nav'),
    },
    {
      direction: 'docx-to-pdf' as ConversionDirection,
      href: '/convert/docx-to-pdf',
      label: t('directions.docxToPdf.nav'),
    },
    {
      direction: 'images-to-pdf' as ConversionDirection,
      href: '/convert/images-to-pdf',
      label: t('directions.imagesToPdf.nav'),
    },
    {
      direction: 'pdf-to-images' as ConversionDirection,
      href: '/convert/pdf-to-images',
      label: t('directions.pdfToImages.nav'),
    },
  ];

  return (
    <nav
      aria-label={t('switchDirection')}
      className={cn(
        'inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-full bg-[#f2f2f4] border border-[#0f1012]/10 max-w-full',
        className
      )}
    >
      {navItems.map((item) => {
        const active = isActive(item.direction);
        return (
          <Link
            key={item.direction}
            href={item.href}
            className={cn(
              'px-4 py-2 text-[14px] md:text-sm font-medium rounded-full transition-all duration-200 whitespace-nowrap',
              active
                ? 'bg-[#0f1012] text-white'
                : 'text-[#0f1012]/70 md:hover:text-[#0f1012] md:hover:bg-white/60'
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
