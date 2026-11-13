'use client';

import * as React from 'react';
import type {
  JobResult,
  OutputFileResult,
  CountdownState,
  ZipGenerationState,
} from './types';

/** 12 часов в миллисекундах (ТЗ §10.1: срок для гостя от момента готовности) */
const GUEST_EXPIRY_MS = 12 * 60 * 60 * 1000;

function createMockJob(jobId: string): JobResult {
  const isFailedDemo = jobId.includes('fail') || jobId.includes('error');
  const isPartialDemo = jobId.includes('partial');
  const isProcessingDemo = jobId.includes('process') || jobId.includes('queue');

  const now = new Date();
  const createdAt = new Date(now.getTime() - 2 * 60 * 1000).toISOString();
  const completedAt = isProcessingDemo
    ? undefined
    : new Date(now.getTime() - 1 * 60 * 1000).toISOString();
  const expiresAt = new Date(
    (completedAt ? new Date(completedAt).getTime() : now.getTime()) + GUEST_EXPIRY_MS
  ).toISOString();

  if (isFailedDemo) {
    const files: OutputFileResult[] = [
      {
        id: 'file-1',
        originalFileName: 'confidential_encrypted_contract.pdf',
        resultFileName: 'confidential_encrypted_contract.docx',
        outputFormat: 'docx',
        sizeBytes: 1024 * 512,
        status: 'failed',
        errorMessage: 'passwordProtected',
      },
    ];
    return {
      jobId,
      status: 'failed',
      direction: 'pdf-to-docx',
      createdAt,
      completedAt,
      expiresAt,
      isGuest: true,
      totalFiles: 1,
      completedFiles: 0,
      failedFiles: 1,
      files,
    };
  }

  if (isPartialDemo) {
    const files: OutputFileResult[] = [
      {
        id: 'file-1',
        originalFileName: 'annual_report_2024.pdf',
        resultFileName: 'annual_report_2024.docx',
        outputFormat: 'docx',
        sizeBytes: 1024 * 1024 * 2.4, // 2.4 MB
        status: 'completed',
        downloadUrl: `/api/v1/jobs/${jobId}/files/file-1/download`,
      },
      {
        id: 'file-2',
        originalFileName: 'scanned_damaged_pages.pdf',
        resultFileName: 'scanned_damaged_pages.docx',
        outputFormat: 'docx',
        sizeBytes: 1024 * 320,
        status: 'failed',
        errorMessage: 'ocrFailed',
      },
    ];
    return {
      jobId,
      status: 'partial',
      direction: 'pdf-to-docx',
      createdAt,
      completedAt,
      expiresAt,
      isGuest: true,
      totalFiles: 2,
      completedFiles: 1,
      failedFiles: 1,
      files,
      zipDownloadUrl: `/api/v1/jobs/${jobId}/download-zip`,
    };
  }

  if (isProcessingDemo) {
    const files: OutputFileResult[] = [
      {
        id: 'file-1',
        originalFileName: 'presentation_marketing_strategy.pdf',
        resultFileName: 'presentation_marketing_strategy.docx',
        outputFormat: 'docx',
        sizeBytes: 1024 * 1024 * 4.1,
        status: 'processing',
      },
      {
        id: 'file-2',
        originalFileName: 'financial_overview_q4.pdf',
        resultFileName: 'financial_overview_q4.docx',
        outputFormat: 'docx',
        sizeBytes: 1024 * 780,
        status: 'queued',
      },
    ];
    return {
      jobId,
      status: 'processing',
      direction: 'pdf-to-docx',
      createdAt,
      expiresAt,
      isGuest: true,
      totalFiles: 2,
      completedFiles: 0,
      failedFiles: 0,
      files,
    };
  }

  // По умолчанию: успешное задание с двумя готовыми файлами
  const files: OutputFileResult[] = [
    {
      id: 'file-1',
      originalFileName: 'annual_report_eu_standard.pdf',
      resultFileName: 'annual_report_eu_standard.docx',
      outputFormat: 'docx',
      sizeBytes: 1024 * 1024 * 1.8, // 1.8 MB
      status: 'completed',
      downloadUrl: `/api/v1/jobs/${jobId}/files/file-1/download`,
    },
    {
      id: 'file-2',
      originalFileName: 'executive_summary_2025.pdf',
      resultFileName: 'executive_summary_2025.docx',
      outputFormat: 'docx',
      sizeBytes: 1024 * 650, // 650 KB
      status: 'completed',
      downloadUrl: `/api/v1/jobs/${jobId}/files/file-2/download`,
    },
  ];

  return {
    jobId,
    status: 'completed',
    direction: 'pdf-to-docx',
    createdAt,
    completedAt,
    expiresAt,
    isGuest: true,
    totalFiles: 2,
    completedFiles: 2,
    failedFiles: 0,
    files,
    zipDownloadUrl: `/api/v1/jobs/${jobId}/download-zip`,
  };
}

export function useJobResults(jobId: string) {
  const [job, setJob] = React.useState<JobResult>(() => createMockJob(jobId));
  const [zipState, setZipState] = React.useState<ZipGenerationState>('idle');
  const [downloadingFileId, setDownloadingFileId] = React.useState<string | null>(null);

  // Вычисление оставшегося времени до автоудаления (12 часов)
  const calculateCountdown = React.useCallback((): CountdownState => {
    const expiresTime = new Date(job.expiresAt).getTime();
    const now = Date.now();
    const diff = expiresTime - now;

    if (diff <= 0) {
      return {
        hours: 0,
        minutes: 0,
        seconds: 0,
        isExpired: true,
        formatted: '00:00:00',
      };
    }

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const pad = (n: number) => String(n).padStart(2, '0');
    return {
      hours,
      minutes,
      seconds,
      isExpired: false,
      formatted: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
    };
  }, [job.expiresAt]);

  const [countdown, setCountdown] = React.useState<CountdownState>(calculateCountdown);

  // Секундный таймер
  React.useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(calculateCountdown());
    }, 1000);
    return () => clearInterval(timer);
  }, [calculateCountdown]);

  // Симуляция завершения обработки, если задача была в статусе processing
  React.useEffect(() => {
    if (job.status === 'processing') {
      const finishTimeout = setTimeout(() => {
        setJob((prev) => {
          const updatedFiles = prev.files.map((f) => ({
            ...f,
            status: 'completed' as const,
            downloadUrl: `/api/v1/jobs/${prev.jobId}/files/${f.id}/download`,
          }));
          return {
            ...prev,
            status: 'completed',
            completedAt: new Date().toISOString(),
            completedFiles: updatedFiles.length,
            files: updatedFiles,
            zipDownloadUrl: `/api/v1/jobs/${prev.jobId}/download-zip`,
          };
        });
      }, 3500);
      return () => clearTimeout(finishTimeout);
    }
  }, [job.status]);

  // Скачивание отдельного файла
  const handleDownloadFile = React.useCallback(
    (file: OutputFileResult) => {
      setDownloadingFileId(file.id);

      // Имитация скачивания через Blob
      setTimeout(() => {
        const dummyContent = `Doc-Converter Result\nFile: ${file.resultFileName}\nJob: ${job.jobId}\nProcessed in EU (GDPR Compliant)\n`;
        const blob = new Blob([dummyContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.resultFileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        setDownloadingFileId(null);
      }, 600);
    },
    [job.jobId]
  );

  // Скачивание единого ZIP-архива (ТЗ §10.2: ZIP генерируется на лету)
  const handleDownloadAllZip = React.useCallback(() => {
    if (zipState === 'generating') return;
    setZipState('generating');

    setTimeout(() => {
      // Имитация создания ZIP
      const dummyContent = `PK\x03\x04DocConverterArchiveJob_${job.jobId}`;
      const blob = new Blob([dummyContent], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `job_${job.jobId}_converted_files.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setZipState('ready');
      setTimeout(() => setZipState('idle'), 2500);
    }, 1200);
  }, [job.jobId, zipState]);

  return {
    job,
    countdown,
    zipState,
    downloadingFileId,
    handleDownloadFile,
    handleDownloadAllZip,
  };
}

