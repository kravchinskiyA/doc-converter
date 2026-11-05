'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, Server, Clock } from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import type { ConversionDirection } from '@doc-converter/contracts';
import {
  DirectionNav,
  PdfToDocxForm,
  DocxToPdfForm,
  ImagesToPdfForm,
  PdfToImagesForm,
} from '@/features/conversion-directions';

interface ConvertPageProps {
  direction: ConversionDirection;
}

export function ConvertPage({ direction }: ConvertPageProps) {
  const t = useTranslations('convert');

  const getHeading = () => {
    switch (direction) {
      case 'pdf-to-docx':
        return {
          title: t('directions.pdfToDocx.title'),
          subtitle: t('directions.pdfToDocx.subtitle'),
        };
      case 'docx-to-pdf':
        return {
          title: t('directions.docxToPdf.title'),
          subtitle: t('directions.docxToPdf.subtitle'),
        };
      case 'images-to-pdf':
        return {
          title: t('directions.imagesToPdf.title'),
          subtitle: t('directions.imagesToPdf.subtitle'),
        };
      case 'pdf-to-images':
      case 'pdf-to-jpg':
      case 'pdf-to-webp':
      default:
        return {
          title: t('directions.pdfToImages.title'),
          subtitle: t('directions.pdfToImages.subtitle'),
        };
    }
  };

  const { title, subtitle } = getHeading();

  const renderForm = () => {
    switch (direction) {
      case 'pdf-to-docx':
        return <PdfToDocxForm />;
      case 'docx-to-pdf':
        return <DocxToPdfForm />;
      case 'images-to-pdf':
        return <ImagesToPdfForm />;
      case 'pdf-to-jpg':
        return <PdfToImagesForm initialFormat="jpg" />;
      case 'pdf-to-webp':
        return <PdfToImagesForm initialFormat="webp" />;
      case 'pdf-to-images':
      default:
        return <PdfToImagesForm />;
    }
  };

  return (
    <div className="py-8 md:py-16 space-y-10 max-w-4xl mx-auto px-4 sm:px-6">
      {/* Навигатор направлений конвертации */}
      <div className="flex justify-center">
        <DirectionNav currentDirection={direction} />
      </div>

      {/* Заголовок направления */}
      <div className="text-center space-y-3 max-w-2xl mx-auto">
        <div className="flex items-center justify-center gap-2">
          <Badge variant="neutral" className="rounded-full px-3 py-1 text-xs text-[#0f1012]/70">
            {t('badge')}
          </Badge>
          <span className="w-1.5 h-1.5 rounded-full bg-[#0071e3]" />
          <span className="text-xs text-[#0f1012]/50 font-medium">ТЗ §2</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-[#0f1012] tracking-tight">
          {title}
        </h1>

        <p className="text-xs sm:text-sm md:text-base text-[#0f1012]/70 leading-relaxed font-light">
          {subtitle}
        </p>
      </div>

      {/* Основная карточка конвертера в стиле Augen Pro */}
      <div className="p-6 sm:p-8 md:p-12 rounded-[32px] sm:rounded-[44px] md:rounded-[54px] bg-[#fdfdfd] border border-[#0f1012]/10">
        {renderForm()}
      </div>

      {/* Гарантии безопасности и юрисдикции ЕС */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
        <div className="p-5 rounded-[28px] bg-white border border-[#0f1012]/10 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="text-xs font-semibold text-[#0f1012]">ClamAV Сканування</h5>
            <p className="text-[11px] text-[#0f1012]/60 leading-relaxed">
              Жоден файл не передається на обробку без попереднього антивірусного вердикту.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-[28px] bg-white border border-[#0f1012]/10 flex items-start gap-3">
          <Server className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="text-xs font-semibold text-[#0f1012]">Юрисдикція ЄС</h5>
            <p className="text-[11px] text-[#0f1012]/60 leading-relaxed">
              Воркери, S3 та черги розміщені виключно в ЄС. Файли не передаються третім особам.
            </p>
          </div>
        </div>

        <div className="p-5 rounded-[28px] bg-white border border-[#0f1012]/10 flex items-start gap-3">
          <Clock className="w-5 h-5 text-[#0071e3] shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <h5 className="text-xs font-semibold text-[#0f1012]">Контроль TTL (12 год)</h5>
            <p className="text-[11px] text-[#0f1012]/60 leading-relaxed">
              Вхідні та результуючі файли гарантовано видаляються після закінчення терміну доступності.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
