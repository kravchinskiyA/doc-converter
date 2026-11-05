import type { ConversionDirection, OcrLanguage, PdfRasterDpi } from '@doc-converter/contracts';

export interface ConverterFileItem {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  previewUrl?: string;
  isInvalidFormat: boolean;
  isTooLarge: boolean;
}

export interface PdfPageMock {
  pageNumber: number;
  selected: boolean;
}

export interface DirectionMeta {
  direction: ConversionDirection;
  canonicalPath: string;
  accept: string;
  maxFiles: number;
  maxFileSizeMb: number;
}

export const DIRECTION_CONFIGS: Record<ConversionDirection, DirectionMeta> = {
  'pdf-to-docx': {
    direction: 'pdf-to-docx',
    canonicalPath: '/convert/pdf-to-docx',
    accept: '.pdf,application/pdf',
    maxFiles: 1,
    maxFileSizeMb: 25,
  },
  'docx-to-pdf': {
    direction: 'docx-to-pdf',
    canonicalPath: '/convert/docx-to-pdf',
    accept: '.docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    maxFiles: 1,
    maxFileSizeMb: 25,
  },
  'images-to-pdf': {
    direction: 'images-to-pdf',
    canonicalPath: '/convert/images-to-pdf',
    accept: '.jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp',
    maxFiles: 5,
    maxFileSizeMb: 25,
  },
  'pdf-to-images': {
    direction: 'pdf-to-images',
    canonicalPath: '/convert/pdf-to-images',
    accept: '.pdf,application/pdf',
    maxFiles: 1,
    maxFileSizeMb: 25,
  },
  'pdf-to-jpg': {
    direction: 'pdf-to-jpg',
    canonicalPath: '/convert/pdf-to-images',
    accept: '.pdf,application/pdf',
    maxFiles: 1,
    maxFileSizeMb: 25,
  },
  'pdf-to-webp': {
    direction: 'pdf-to-webp',
    canonicalPath: '/convert/pdf-to-images',
    accept: '.pdf,application/pdf',
    maxFiles: 1,
    maxFileSizeMb: 25,
  },
};

export const SUPPORTED_OCR_LANGUAGES: OcrLanguage[] = ['uk', 'ru', 'en', 'fr', 'de', 'pl'];
export const SUPPORTED_DPIS: PdfRasterDpi[] = [72, 150, 300];
