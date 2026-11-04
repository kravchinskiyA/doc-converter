import * as React from 'react';
import { cn } from '../lib/utils';

export interface FooterProps {
  locale?: string;
  className?: string;
}

export function Footer({ locale = 'uk', className }: FooterProps) {
  return (
    <footer
      className={cn(
        'w-full bg-off-black text-pure-white pt-[60px] pb-[60px] px-6 md:px-[69px]',
        className
      )}
    >
      <div className="mx-auto max-w-content">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b-[0.5px] border-white/10">
          {/* Колонка 1: О бренде */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-[16px] font-regular tracking-tight text-pure-white">
              <span className="h-2 w-2 rounded-full bg-signal-blue inline-block" />
              <span>doc-converter</span>
            </div>
            <p className="text-[14px] font-book text-ash-gray leading-relaxed">
              Безопасный SaaS-конвертер документов и изображений. Серверная инфраструктура строго в регионе ЕС.
            </p>
          </div>

          {/* Колонка 2: Конвертеры */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-regular uppercase tracking-wider text-ash-gray">
              Конвертеры
            </h4>
            <ul className="space-y-2 text-[14px] font-book text-ash-gray">
              <li>
                <a href={`/${locale}/convert/pdf-to-docx`} className="hover:text-pure-white transition-colors">
                  PDF в DOCX (OCR)
                </a>
              </li>
              <li>
                <a href={`/${locale}/convert/docx-to-pdf`} className="hover:text-pure-white transition-colors">
                  DOCX в PDF
                </a>
              </li>
              <li>
                <a href={`/${locale}/convert/images-to-pdf`} className="hover:text-pure-white transition-colors">
                  Изображения в PDF
                </a>
              </li>
              <li>
                <a href={`/${locale}/convert/pdf-to-images`} className="hover:text-pure-white transition-colors">
                  PDF в JPG / WEBP
                </a>
              </li>
            </ul>
          </div>

          {/* Колонка 3: Сервис и API */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-regular uppercase tracking-wider text-ash-gray">
              Сервис
            </h4>
            <ul className="space-y-2 text-[14px] font-book text-ash-gray">
              <li>
                <a href={`/${locale}/pricing`} className="hover:text-pure-white transition-colors">
                  Тарифы и подписка
                </a>
              </li>
              <li>
                <a href={`/${locale}/api-docs`} className="hover:text-pure-white transition-colors">
                  REST API документация
                </a>
              </li>
              <li>
                <a href={`/${locale}/admin/login`} className="hover:text-pure-white transition-colors">
                  Служебный вход
                </a>
              </li>
            </ul>
          </div>

          {/* Колонка 4: Юридическая информация */}
          <div className="space-y-3">
            <h4 className="text-[12px] font-regular uppercase tracking-wider text-ash-gray">
              Безопасность
            </h4>
            <ul className="space-y-2 text-[14px] font-book text-ash-gray">
              <li>
                <a href={`/${locale}/privacy`} className="hover:text-pure-white transition-colors">
                  Конфиденциальность (GDPR)
                </a>
              </li>
              <li>
                <a href={`/${locale}/terms`} className="hover:text-pure-white transition-colors">
                  Условия обслуживания
                </a>
              </li>
              <li>
                <span className="text-[12px] text-ash-gray/80 inline-block border-[0.5px] border-white/10 rounded-pill px-2.5 py-0.5">
                  100% EU Data Isolation
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Нижняя строчка копирайта */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[13px] font-book text-ash-gray">
          <p>© {new Date().getFullYear()} doc-converter. Все права защищены.</p>
          <p className="text-[12px]">Шифрование SSE-KMS • Антивирус ClamAV • Без передачи данных сторонним AI</p>
        </div>
      </div>
    </footer>
  );
}

