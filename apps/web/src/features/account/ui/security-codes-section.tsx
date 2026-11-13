'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import {
  Key,
  Copy,
  Check,
  Download,
  AlertTriangle,
  Info,
  Lock,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import type { useAccountState } from '../model/use-account-state';

type SecurityCodesSectionProps = ReturnType<typeof useAccountState>;

export function SecurityCodesSection({
  userProfile,
  recoveryCodesCount,
  recoveryCodesFlow,
  setRecoveryCodesFlow,
  handleGenerateRecoveryCodes,
}: SecurityCodesSectionProps) {
  const t = useTranslations('account.recovery');
  const [copiedAll, setCopiedAll] = React.useState(false);
  const [requestCodeInput, setRequestCodeInput] = React.useState('');
  const [savedCheckbox, setSavedCheckbox] = React.useState(false);

  const handleCopyCodes = () => {
    if (recoveryCodesFlow.codes.length === 0) return;
    const text = [
      t('exportHeader'),
      t('exportAccount', { email: userProfile.email }),
      t('exportIssuedAt', { date: new Date().toISOString() }),
      t('exportNoteCopy'),
      '',
      ...recoveryCodesFlow.codes.map((c, i) => `${i + 1}. ${c}`),
    ].join('\n');
    navigator.clipboard.writeText(text);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownloadTxt = () => {
    if (recoveryCodesFlow.codes.length === 0) return;
    const text = [
      t('exportHeader'),
      t('exportAccount', { email: userProfile.email }),
      t('exportIssuedAt', { date: new Date().toISOString() }),
      t('exportNoteDownload'),
      '',
      ...recoveryCodesFlow.codes.map((c, i) => `${i + 1}. ${c}`),
    ].join('\n');
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `doc-converter-recovery-codes-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-10">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-black/5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="signal-chip">{t('owaspBadge')}</Badge>
              <Badge variant={recoveryCodesCount > 0 ? 'success' : 'error'}>
                {recoveryCodesCount > 0
                  ? t('availableBadge', { count: recoveryCodesCount })
                  : t('emptyBadge')}
              </Badge>
            </div>
            <CardTitle className="text-[22px] md:text-[26px]">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-steel-gray text-[14px]">
              {t('description')}
            </CardDescription>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setRequestCodeInput('');
              setRecoveryCodesFlow({
                isOpen: true,
                step: 'request_code',
                emailCode: '',
                codes: [],
                hasConfirmedSaved: false,
                isSubmitting: false,
              });
            }}
            className="gap-2 shrink-0"
          >
            <Key className="h-3.5 w-3.5" />
            {recoveryCodesCount > 0 ? t('replaceBtn') : t('issueBtn')}
          </Button>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="rounded-[28px] border-[0.5px] border-black/5 bg-[#fdfdfd] p-6 space-y-3">
            <div className="flex items-center justify-between text-[14px]">
              <span className="font-book text-off-black">{t('statusTitle')}</span>
              <span className="text-[14px] text-steel-gray">
                {t('statusHint')}
              </span>
            </div>

            <div className="flex items-center gap-3 py-2">
              <div className="h-12 w-12 rounded-full bg-black/[0.04] flex items-center justify-center shrink-0">
                <Lock className="h-6 w-6 text-off-black" />
              </div>
              <div>
                <p className="text-[14px] text-off-black font-book">
                  {t.rich('savedCount', {
                    count: recoveryCodesCount,
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <p className="text-[14px] text-steel-gray">
                  {t('oneTimeNote')}
                </p>
              </div>
            </div>
          </div>

          {/* Информационные правила ТЗ §6.5 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-[24px] border-[0.5px] border-black/5 bg-off-white/40 p-4 space-y-2">
              <span className="text-[14px] font-medium text-off-black flex items-center gap-1.5">
                <Info className="h-4 w-4 text-signal-blue" />
                {t('howToUseTitle')}
              </span>
              <p className="text-[14px] text-steel-gray leading-relaxed">
                {t('howToUseDesc')}
              </p>
            </div>

            <div className="rounded-[24px] border-[0.5px] border-black/5 bg-off-white/40 p-4 space-y-2">
              <span className="text-[14px] font-medium text-off-black flex items-center gap-1.5">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                {t('replaceRuleTitle')}
              </span>
              <p className="text-[14px] text-steel-gray leading-relaxed">
                {t('replaceRuleDesc')}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Диалог запроса email-кода и однократного показа кодов */}
      <Dialog
        open={recoveryCodesFlow.isOpen}
        onOpenChange={(open) =>
          setRecoveryCodesFlow((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent
          onClose={() => setRecoveryCodesFlow((prev) => ({ ...prev, isOpen: false }))}
          className="max-w-[540px]"
        >
          <div className="space-y-4">
            <Badge variant="signal-chip">{t('dialog.badge')}</Badge>
            <h3 className="text-[20px] font-book text-off-black">
              {recoveryCodesFlow.step === 'request_code'
                ? t('dialog.titleRequest')
                : t('dialog.titleDisplay')}
            </h3>

            {recoveryCodesFlow.error && (
              <div className="p-3 rounded-pill border-[0.5px] border-red-500/30 bg-red-500/[0.05] text-red-600 text-[14px] flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <span>{recoveryCodesFlow.error}</span>
              </div>
            )}

            {recoveryCodesFlow.step === 'request_code' && (
              <div className="space-y-3 pt-2">
                <p className="text-[14px] text-steel-gray leading-relaxed">
                  {t.rich('dialog.requestDesc', {
                    email: userProfile.email,
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <Input
                  type="text"
                  maxLength={6}
                  value={requestCodeInput}
                  onChange={(e) => setRequestCodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="tracking-widest text-center text-[18px]"
                  autoFocus
                />
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setRecoveryCodesFlow((prev) => ({ ...prev, isOpen: false }))
                    }
                  >
                    {t('dialog.cancel')}
                  </Button>
                  <Button
                    size="sm"
                    disabled={requestCodeInput.length !== 6}
                    onClick={() => handleGenerateRecoveryCodes(requestCodeInput)}
                  >
                    {t('dialog.generateBtn')}
                  </Button>
                </div>
              </div>
            )}

            {recoveryCodesFlow.step === 'display_codes' && (
              <div className="space-y-4 pt-1">
                <div className="p-3 rounded-[20px] border-[0.5px] border-amber-500/30 bg-amber-500/[0.05] text-[14px] text-amber-800 flex items-start gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
                  <div>
                    <strong>{t('dialog.warningTitle')}</strong>
                    <br />
                    {t('dialog.warningDesc')}
                  </div>
                </div>

                {/* Сетка кодов */}
                <div className="grid grid-cols-2 gap-2 p-3 rounded-[20px] bg-black/[0.03] border-[0.5px] border-black/5 font-mono text-[14px] text-off-black">
                  {recoveryCodesFlow.codes.map((code, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-[12px] bg-pure-white border-[0.5px] border-black/5 text-center tracking-wider"
                    >
                      <span className="text-[14px] text-steel-gray mr-1.5">{idx + 1}.</span>
                      {code}
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyCodes}
                    className="gap-2 flex-1"
                  >
                    {copiedAll ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" /> {t('dialog.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" /> {t('dialog.copyAll')}
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDownloadTxt}
                    className="gap-2 flex-1"
                  >
                    <Download className="h-4 w-4" /> {t('dialog.downloadTxt')}
                  </Button>
                </div>

                <div className="pt-2 border-t border-black/5">
                  <Checkbox
                    id="saved-codes-confirm"
                    checked={savedCheckbox}
                    onChange={(e) => setSavedCheckbox(e.target.checked)}
                    label={t('dialog.confirmCheckbox')}
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <Button
                    size="sm"
                    disabled={!savedCheckbox}
                    onClick={() => {
                      setSavedCheckbox(false);
                      setRecoveryCodesFlow((prev) => ({ ...prev, isOpen: false }));
                    }}
                  >
                    {t('dialog.closeBtn')}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

