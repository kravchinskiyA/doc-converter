'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/shared/i18n';
import { FileCode, Upload, ShieldCheck, ArrowRight, Loader2, X, CheckCircle2 } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';

export function DocxToPdfForm() {
  const t = useTranslations('convert');
  const tDocx = useTranslations('convert.docxToPdf');
  const router = useRouter();

  const [file, setFile] = React.useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [stepText, setStepText] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.name.toLowerCase().endsWith('.docx')) {
      setFile(selected);
    }
  };

  const handleClear = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async () => {
    if (!file) return;
    setIsSubmitting(true);
    setStepText(t('flow.scanning'));

    await new Promise((resolve) => setTimeout(resolve, 600));
    setStepText(t('flow.dispatching'));

    await new Promise((resolve) => setTimeout(resolve, 600));
    setStepText(t('flow.ready'));

    await new Promise((resolve) => setTimeout(resolve, 400));
    router.push('/results/demo-job-1');
  };

  return (
    <div className="space-y-8">
      <input
        ref={fileInputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFileChange}
      />

      {!file ? (
        <div
          role="button"
          tabIndex={0}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          className="border-2 border-dashed border-[#0f1012]/15 hover:border-[#0071e3] transition-colors rounded-[32px] md:rounded-[44px] p-8 md:p-12 text-center flex flex-col items-center justify-center cursor-pointer bg-white group"
        >
          <div className="w-16 h-16 rounded-full bg-[#f2f2f4] flex items-center justify-center mb-4 group-hover:scale-105 transition-transform text-[#0071e3]">
            <Upload className="w-7 h-7" />
          </div>
          <h3 className="text-lg md:text-xl font-medium text-[#0f1012] mb-1">
            {t('dropzone.docxTitle')}
          </h3>
          <p className="text-[14px] md:text-sm text-[#0f1012]/60 mb-6">
            {t('dropzone.hint', { maxMb: 25, maxFiles: 1 })}
          </p>
          <Button type="button" size="lg" className="rounded-full px-6">
            <FileCode className="w-4 h-4 mr-2" />
            {t('dropzone.chooseFile')}
          </Button>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in-50 duration-300">
          <div className="p-5 md:p-6 rounded-[28px] bg-white border border-[#0f1012]/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3.5 min-w-0">
              <div className="w-12 h-12 rounded-2xl bg-[#0071e3]/10 text-[#0071e3] flex items-center justify-center shrink-0">
                <FileCode className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <h4 className="text-sm font-semibold text-[#0f1012] truncate max-w-[280px] sm:max-w-md">
                  {file.name}
                </h4>
                <p className="text-[14px] text-[#0f1012]/60">
                  {(file.size / (1024 * 1024)).toFixed(2)} МБ • Microsoft Word DOCX
                </p>
              </div>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="rounded-full text-[#0f1012]/70 hover:text-destructive"
            >
              <X className="w-4 h-4 mr-1" />
              Змінити файл
            </Button>
          </div>

          {/* Инспектор параметров безопасности DOCX */}
          <div className="p-6 md:p-8 rounded-[32px] md:rounded-[44px] bg-[#fdfdfd] border border-[#0f1012]/10 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#0071e3]" />
              <h4 className="text-sm md:text-base font-semibold text-[#0f1012]">
                {tDocx('inspectorTitle')}
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-[#0f1012]/5 space-y-1.5">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-[#0f1012]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Ліміт розпакування (500 МБ)
                </div>
                <p className="text-[14px] text-[#0f1012]/70 leading-relaxed">
                  {tDocx('unpackInfo')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#0f1012]/5 space-y-1.5">
                <div className="flex items-center gap-2 text-[14px] font-semibold text-[#0f1012]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Движок LibreOffice (ЕС)
                </div>
                <p className="text-[14px] text-[#0f1012]/70 leading-relaxed">
                  {tDocx('engineInfo')}
                </p>
              </div>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Badge variant="neutral" className="rounded-full px-3 py-1 text-[14px] text-[#0f1012]/70">
                {t('features.clamav')}
              </Badge>
              <Badge variant="neutral" className="rounded-full px-3 py-1 text-[14px] text-[#0f1012]/70">
                {t('features.eu')}
              </Badge>
            </div>

            <Button
              type="button"
              size="lg"
              disabled={isSubmitting}
              onClick={handleSubmit}
              className="w-full sm:w-auto rounded-full px-8 h-13 text-sm md:text-base font-medium bg-[#0f1012] text-white hover:bg-[#0071e3] transition-colors"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {stepText || t('flow.dispatching')}
                </>
              ) : (
                <>
                  {tDocx('submit')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
