export type ConversionDirection = 'pdf-to-docx';

export interface ConverterFile {
  id: string;
  file: File;
  name: string;
  size: number;
  type: string;
  isPdf: boolean;
  isTooLarge: boolean;
  isInvalidFormat: boolean;
}

export const GUEST_MAX_FILES = 5;
export const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB
export const INITIAL_GUEST_ATTEMPTS = 3;

