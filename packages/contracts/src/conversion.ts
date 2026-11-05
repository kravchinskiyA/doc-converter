import { z } from 'zod';

/**
 * Поддерживаемые направления конвертации в системе.
 */
export const ConversionDirectionSchema = z.enum([
  'pdf-to-docx',
  'docx-to-pdf',
  'images-to-pdf',
  'pdf-to-images',
  'pdf-to-jpg',
  'pdf-to-webp',
]);

export type ConversionDirection = z.infer<typeof ConversionDirectionSchema>;

/**
 * Допустимые языки OCR распознавания печатного текста (ТЗ §2.3).
 */
export const OcrLanguageSchema = z.enum(['uk', 'ru', 'en', 'fr', 'de', 'pl']);
export type OcrLanguage = z.infer<typeof OcrLanguageSchema>;

/**
 * Допустимые значения DPI для растрирования PDF в изображения (ТЗ §2.2).
 */
export const PdfRasterDpiSchema = z.union([
  z.literal(72),
  z.literal(150),
  z.literal(300),
]);
export type PdfRasterDpi = z.infer<typeof PdfRasterDpiSchema>;

/**
 * Качество сжатия изображений (1–100, по умолчанию 85).
 */
export const ImageQualitySchema = z.number().int().min(1).max(100);

/**
 * Целевой формат изображения для PDF → изображения.
 */
export const ImageOutputFormatSchema = z.enum(['jpg', 'webp']);
export type ImageOutputFormat = z.infer<typeof ImageOutputFormatSchema>;

/**
 * Параметры конвертации PDF → DOCX (OCR).
 */
export const PdfToDocxOptionsSchema = z.object({
  ocrLanguages: z.array(OcrLanguageSchema).min(1).default(['uk', 'ru', 'en']),
  pages: z.array(z.number().int().positive()).optional(),
  preserveLayout: z.boolean().default(true),
});
export type PdfToDocxOptions = z.infer<typeof PdfToDocxOptionsSchema>;

/**
 * Параметры конвертации DOCX → PDF (LibreOffice).
 */
export const DocxToPdfOptionsSchema = z.object({
  checkUnpackSize: z.boolean().default(true),
});
export type DocxToPdfOptions = z.infer<typeof DocxToPdfOptionsSchema>;

/**
 * Параметры конвертации изображений (JPG, PNG, WEBP) → PDF (ТЗ §2.1).
 */
export const ImagesToPdfOptionsSchema = z.object({
  /** Объединить все изображения в один PDF-документ (по умолчанию false) */
  mergeIntoSinglePdf: z.boolean().default(false),
  /** Порядок файлов (массив ID файлов в желаемом порядке страниц) */
  fileOrder: z.array(z.string()).optional(),
});
export type ImagesToPdfOptions = z.infer<typeof ImagesToPdfOptionsSchema>;

/**
 * Параметры конвертации PDF → изображения (JPG/WEBP, ТЗ §2.2).
 */
export const PdfToImagesOptionsSchema = z.object({
  format: ImageOutputFormatSchema.default('jpg'),
  dpi: PdfRasterDpiSchema.default(150),
  quality: ImageQualitySchema.default(85),
  pages: z.array(z.number().int().positive()).optional(),
});
export type PdfToImagesOptions = z.infer<typeof PdfToImagesOptionsSchema>;

/**
 * Унифицированная схема параметров конвертации.
 */
export const ConversionOptionsSchema = z.union([
  PdfToDocxOptionsSchema,
  DocxToPdfOptionsSchema,
  ImagesToPdfOptionsSchema,
  PdfToImagesOptionsSchema,
]);
export type ConversionOptions = z.infer<typeof ConversionOptionsSchema>;
