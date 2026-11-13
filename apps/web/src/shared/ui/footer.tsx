import * as React from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '../lib/utils';
import { Link } from '../i18n';

export interface FooterProps {
  className?: string;
}

const LINK_CLASS = 'hover:text-pure-white transition-colors';

export function Footer({ className }: FooterProps) {
  const t = useTranslations('footer');

  return (
    <footer
      className={cn(
        'w-full bg-off-black text-pure-white pt-[60px] pb-[60px] px-6 md:px-[69px]',
        className
      )}
    >
      <div className="mx-auto max-w-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-white/10">
          {/* Колонка 1: О бренде */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-[16px] font-regular tracking-tight text-pure-white">
              <span className="h-2 w-2 rounded-full bg-signal-blue inline-block" />
              <span>doc-converter</span>
            </div>
            <p className="text-[14px] font-book text-ash-gray leading-relaxed">
              {t('tagline')}
            </p>
          </div>

          {/* Колонка 2: Конвертеры */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-regular uppercase tracking-wider text-ash-gray">
              {t('converters.title')}
            </h4>
            <ul className="space-y-2 text-[14px] font-book text-ash-gray">
              <li>
                <Link href="/convert/pdf-to-docx" className={LINK_CLASS}>
                  {t('converters.pdfToDocx')}
                </Link>
              </li>
              <li>
                <Link href="/convert/docx-to-pdf" className={LINK_CLASS}>
                  {t('converters.docxToPdf')}
                </Link>
              </li>
              <li>
                <Link href="/convert/images-to-pdf" className={LINK_CLASS}>
                  {t('converters.imagesToPdf')}
                </Link>
              </li>
              <li>
                <Link href="/convert/pdf-to-images" className={LINK_CLASS}>
                  {t('converters.pdfToImages')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Колонка 3: Сервис и API */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-regular uppercase tracking-wider text-ash-gray">
              {t('service.title')}
            </h4>
            <ul className="space-y-2 text-[14px] font-book text-ash-gray">
              <li>
                <Link href="/pricing" className={LINK_CLASS}>
                  {t('service.pricing')}
                </Link>
              </li>
              <li>
                <Link href="/api-docs" className={LINK_CLASS}>
                  {t('service.apiDocs')}
                </Link>
              </li>
              <li>
                <Link href="/design-system" className={LINK_CLASS}>
                  {t('service.designSystem')}
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className={LINK_CLASS}>
                  {t('service.staffLogin')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Колонка 4: Юридическая информация */}
          <div className="space-y-3">
            <h4 className="text-[14px] font-regular uppercase tracking-wider text-ash-gray">
              {t('security.title')}
            </h4>
            <ul className="space-y-2 text-[14px] font-book text-ash-gray">
              <li>
                <Link href="/privacy" className={LINK_CLASS}>
                  {t('security.privacy')}
                </Link>
              </li>
              <li>
                <Link href="/terms" className={LINK_CLASS}>
                  {t('security.terms')}
                </Link>
              </li>
              <li>
                <span className="text-[14px] text-ash-gray/80 inline-block border border-white/10 rounded-pill px-2.5 py-0.5">
                  {t('security.euIsolation')}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя строчка копирайта */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[14px] font-book text-ash-gray">
          <p>{t('copyright', { year: new Date().getFullYear() })}</p>
          <p className="text-[14px]">{t('bottomNote')}</p>
        </div>
      </div>
    </footer>
  );
}
