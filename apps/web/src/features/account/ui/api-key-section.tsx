'use client';

import * as React from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import {
  KeyRound,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  AlertCircle,
  PlusCircle,
  Terminal,
  ShieldCheck,
  Info,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import type { useAccountState } from '../model/use-account-state';

type ApiKeySectionProps = ReturnType<typeof useAccountState>;

export function ApiKeySection({
  userProfile,
  apiKey,
  rawApiKeyValue,
  isApiKeyRevealed,
  setIsApiKeyRevealed,
  handleCreateApiKey,
  apiKeyRotateFlow,
  setApiKeyRotateFlow,
  handleRotateApiKeySubmit,
}: ApiKeySectionProps) {
  const t = useTranslations('account.apiKey');
  const format = useFormatter();
  const [copied, setCopied] = React.useState(false);
  const [rotateCodeInput, setRotateCodeInput] = React.useState('');

  const handleCopy = () => {
    if (!apiKey.hasKey) return;
    navigator.clipboard.writeText(rawApiKeyValue);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (isoString?: string): string => {
    if (!isoString) return t('unknownDate');
    try {
      return format.dateTime(new Date(isoString), {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-10">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-black/5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="signal-chip">{t('restBadge')}</Badge>
              <Badge variant={apiKey.hasKey ? 'success' : 'neutral'}>
                {apiKey.hasKey ? t('activeBadge') : t('notIssuedBadge')}
              </Badge>
            </div>
            <CardTitle className="text-[22px] md:text-[26px]">{t('title')}</CardTitle>
            <CardDescription className="text-steel-gray text-[14px]">
              {t.rich('description', { code: (chunks) => <code>{chunks}</code> })}
            </CardDescription>
          </div>
          {apiKey.hasKey ? (
            <Button
              variant="outline"
              size="sm"
              disabled={apiKey.hasActiveConversions}
              onClick={() => {
                setRotateCodeInput('');
                setApiKeyRotateFlow({
                  isOpen: true,
                  step: 'confirm',
                  emailCode: '',
                  isSubmitting: false,
                });
              }}
              className="gap-2 shrink-0"
              title={
                apiKey.hasActiveConversions
                  ? t('rotateDisabledTitle')
                  : t('rotateTitle')
              }
            >
              <RefreshCw className="h-3.5 w-3.5" />
              {t('rotateBtn')}
            </Button>
          ) : (
            <Button
              size="sm"
              disabled={apiKey.hasActiveConversions}
              onClick={handleCreateApiKey}
              className="gap-2 shrink-0"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              {t('createBtn')}
            </Button>
          )}
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {apiKey.hasActiveConversions && (
            <div className="rounded-[24px] border-[0.5px] border-amber-500/30 bg-amber-500/[0.04] p-4 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-[14px] font-medium text-amber-700">
                  {t('activeConversionsTitle')}
                </h4>
                <p className="text-[14px] text-amber-700/80 mt-1 leading-relaxed">
                  {t('activeConversionsDesc')}
                </p>
              </div>
            </div>
          )}

          {apiKey.hasKey ? (
            <div className="space-y-4">
              <div className="rounded-[28px] border-[0.5px] border-black/10 bg-[#fdfdfd] p-5 space-y-3">
                <div className="flex items-center justify-between text-[14px] text-steel-gray">
                  <span>{t('currentKeyIssued', { date: formatDate(apiKey.createdAt) })}</span>
                  <span className="text-[14px] text-emerald-600 flex items-center gap-1">
                    <ShieldCheck className="h-3.5 w-3.5" /> {t('authEnabled')}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="relative flex-1">
                    <Input
                      type="text"
                      readOnly
                      value={isApiKeyRevealed ? rawApiKeyValue : apiKey.keyPreview}
                      className="font-mono text-[14px] bg-black/[0.02] pr-10 tracking-wider"
                    />
                    <button
                      type="button"
                      onClick={() => setIsApiKeyRevealed(!isApiKeyRevealed)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-steel-gray hover:text-off-black transition-colors"
                      title={isApiKeyRevealed ? t('hideKeyTitle') : t('showKeyTitle')}
                    >
                      {isApiKeyRevealed ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopy}
                    className="gap-2 shrink-0 h-[42px]"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4 text-emerald-600" />
                        {t('copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        {t('copy')}
                      </>
                    )}
                  </Button>
                </div>

                <p className="text-[14px] text-steel-gray pt-1">
                  {t('securityWarning')}
                </p>
              </div>

              {/* Пример использования curl */}
              <div className="rounded-[24px] border-[0.5px] border-black/10 bg-[#0f1012] p-5 text-pure-white space-y-3">
                <div className="flex items-center justify-between text-[14px] text-pure-white/70">
                  <span className="flex items-center gap-1.5">
                    <Terminal className="h-3.5 w-3.5 text-signal-blue" />
                    {t('curlTitle')}
                  </span>
                  <span className="text-[14px] font-mono text-pure-white/50">bash</span>
                </div>
                <pre className="font-mono text-[14px] text-emerald-400 overflow-x-auto p-3 rounded-[16px] bg-black/40 leading-relaxed">
{`curl -X POST https://doc-converter.internal/api/v1/jobs \\
  -H "X-API-Key: ${rawApiKeyValue.slice(0, 16)}..." \\
  -F "file=@document.pdf" \\
  -F "targetFormat=docx"`}
                </pre>
              </div>
            </div>
          ) : (
            <div className="rounded-[28px] border-[0.5px] border-dashed border-black/15 p-10 text-center space-y-3 bg-[#fdfdfd]">
              <KeyRound className="h-8 w-8 text-steel-gray/60 mx-auto" />
              <h4 className="text-[16px] font-book text-off-black">{t('emptyTitle')}</h4>
              <p className="text-[14px] text-steel-gray max-w-md mx-auto">
                {t('emptyDesc')}
              </p>
            </div>
          )}

          {/* Информационные правила ТЗ §7 */}
          <div className="p-4 rounded-[22px] bg-black/[0.03] border-[0.5px] border-black/5 flex items-start gap-3 text-[14px] text-steel-gray">
            <Info className="h-4 w-4 text-signal-blue shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-medium text-off-black block">{t('rulesTitle')}</span>
              <p>{t('rule1')}</p>
              <p>{t('rule2')}</p>
              <p>{t('rule3')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Диалог ротации API-ключа */}
      <Dialog
        open={apiKeyRotateFlow.isOpen}
        onOpenChange={(open) =>
          setApiKeyRotateFlow((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent
          onClose={() => setApiKeyRotateFlow((prev) => ({ ...prev, isOpen: false }))}
          className="max-w-[480px]"
        >
          <div className="space-y-4">
            <Badge variant="signal-chip">{t('rotateDialog.badge')}</Badge>
            <h3 className="text-[20px] font-book text-off-black">{t('rotateDialog.title')}</h3>

            <p className="text-[14px] text-steel-gray leading-relaxed">
              {t.rich('rotateDialog.description', {
                email: userProfile.email,
                bold: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>

            {apiKeyRotateFlow.error && (
              <div className="p-3 rounded-pill border-[0.5px] border-red-500/30 bg-red-500/[0.05] text-red-600 text-[14px] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{apiKeyRotateFlow.error}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <label className="text-[14px] font-regular text-off-black block">
                {t('rotateDialog.codeLabel')}
              </label>
              <Input
                type="text"
                maxLength={6}
                value={rotateCodeInput}
                onChange={(e) => setRotateCodeInput(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="tracking-widest text-center text-[18px]"
                autoFocus
              />
              <div className="pt-2 flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setApiKeyRotateFlow((prev) => ({ ...prev, isOpen: false }))
                  }
                >
                  {t('rotateDialog.cancel')}
                </Button>
                <Button
                  size="sm"
                  disabled={rotateCodeInput.length !== 6}
                  onClick={() => handleRotateApiKeySubmit(rotateCodeInput)}
                >
                  {t('rotateDialog.submit')}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

