import type {
  JobResult,
  JobStatus,
  FileConversionStatus,
  OutputFileResult,
  ConversionDirection,
} from '@doc-converter/contracts';

export type {
  JobResult,
  JobStatus,
  FileConversionStatus,
  OutputFileResult,
  ConversionDirection,
};

export interface CountdownState {
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
  formatted: string;
}

export type ZipGenerationState = 'idle' | 'generating' | 'ready' | 'error';

