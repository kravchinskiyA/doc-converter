'use client';

import * as React from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import {
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import type { useAccountState } from '../model/use-account-state';
import type { SupportAccessRequest } from '@doc-converter/contracts';

type StaffAccessSectionProps = ReturnType<typeof useAccountState>;

export function StaffAccessSection({
  userProfile,
  supportRequests,
  supportApprovalFlow,
  setSupportApprovalFlow,
  handleApproveSupportAccess,
  handleRevokeSupportAccess,
}: StaffAccessSectionProps) {
  const t = useTranslations('account.support');
  const format = useFormatter();
  const [approvalCodeInput, setApprovalCodeInput] = React.useState('');

  const formatDate = (isoString: string): string => {
    try {
      return format.dateTime(new Date(isoString), {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return isoString;
    }
  };

  const getStatusBadge = (status: SupportAccessRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <Badge variant="signal-chip" className="text-[14px]">
            {t('status.pending')}
          </Badge>
        );
      case 'active':
        return (
          <Badge variant="success" className="text-[14px]">
            <CheckCircle2 className="h-3 w-3" />
            {t('status.active')}
          </Badge>
        );
      case 'revoked':
        return (
          <Badge variant="muted" className="text-[14px]">
            <XCircle className="h-3 w-3" />
            {t('status.revoked')}
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="neutral" className="text-[14px]">
            {t('status.expired')}
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-10">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-black/5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="signal-chip">{t('gdprBadge')}</Badge>
              <Badge variant="neutral">{t('specBadge')}</Badge>
            </div>
            <CardTitle className="text-[22px] md:text-[26px]">
              {t('title')}
            </CardTitle>
            <CardDescription className="text-steel-gray text-[14px]">
              {t('description')}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="p-4 rounded-[24px] bg-black/[0.03] border-[0.5px] border-black/5 flex items-start gap-3 text-[14px] text-steel-gray leading-relaxed">
            <ShieldCheck className="h-4 w-4 text-signal-blue shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-off-black block mb-0.5">
                {t('privacyTitle')}
              </span>
              {t.rich('privacyDesc', {
                bold: (chunks) => <strong>{chunks}</strong>,
              })}
            </div>
          </div>

          {/* Список запросов */}
          {supportRequests.length === 0 ? (
            <div className="rounded-[28px] border-[0.5px] border-dashed border-black/15 p-10 text-center space-y-2 bg-[#fdfdfd]">
              <UserCheck className="h-7 w-7 text-steel-gray/60 mx-auto" />
              <h4 className="text-[15px] font-book text-off-black">{t('emptyTitle')}</h4>
              <p className="text-[14px] text-steel-gray max-w-sm mx-auto">
                {t('emptyDesc')}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {supportRequests.map((req) => (
                <div
                  key={req.id}
                  className="rounded-[28px] border-[0.5px] border-black/10 bg-[#fdfdfd] p-5 md:p-6 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/5 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-book text-[15px] text-off-black">{req.staffName}</span>
                      <span className="text-[14px] text-steel-gray font-mono">({req.staffEmail})</span>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>

                  <div className="space-y-2 text-[14px]">
                    <div>
                      <span className="text-steel-gray block text-[14px]">{t('reasonLabel')}</span>
                      <p className="text-off-black font-book">{req.reason}</p>
                    </div>

                    <div>
                      <span className="text-steel-gray block text-[14px]">{t('filesLabel')}</span>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {req.fileNames.map((fn, idx) => (
                          <Badge key={idx} variant="neutral" className="text-[14px] py-0.5">
                            <FileCheck className="h-3 w-3 text-signal-blue mr-1" />
                            {fn}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[14px] text-steel-gray pt-1">
                      <span>{t('requestedAt', { date: formatDate(req.requestedAt) })}</span>
                      <span>{t('expiresAt', { date: formatDate(req.expiresAt) })}</span>
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/5">
                    {req.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => {
                          setApprovalCodeInput('');
                          setSupportApprovalFlow({
                            isOpen: true,
                            request: req,
                            emailCode: '',
                            isSubmitting: false,
                          });
                        }}
                        className="text-[14px] h-[34px]"
                      >
                        {t('approveBtn')}
                      </Button>
                    )}

                    {req.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSupportAccess(req.id)}
                        className="border-red-500/30 text-red-600 hover:bg-red-500/5 text-[14px] h-[34px]"
                      >
                        {t('revokeBtn')}
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Диалог подтверждения доступа кодом */}
      <Dialog
        open={supportApprovalFlow.isOpen}
        onOpenChange={(open) =>
          setSupportApprovalFlow((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent
          onClose={() => setSupportApprovalFlow((prev) => ({ ...prev, isOpen: false }))}
          className="max-w-[480px]"
        >
          <div className="space-y-4">
            <Badge variant="signal-chip">{t('dialog.badge')}</Badge>
            <h3 className="text-[20px] font-book text-off-black">{t('dialog.title')}</h3>

            <p className="text-[14px] text-steel-gray leading-relaxed">
              {t.rich('dialog.description', {
                staffName: supportApprovalFlow.request?.staffName ?? '',
                email: userProfile.email,
                bold: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>

            {supportApprovalFlow.error && (
              <div className="p-3 rounded-pill border-[0.5px] border-red-500/30 bg-red-500/[0.05] text-red-600 text-[14px] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{supportApprovalFlow.error}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <label className="text-[14px] font-regular text-off-black block">
                {t('dialog.codeLabel')}
              </label>
              <Input
                type="text"
                maxLength={6}
                value={approvalCodeInput}
                onChange={(e) => setApprovalCodeInput(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="tracking-widest text-center text-[18px]"
                autoFocus
              />
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSupportApprovalFlow((prev) => ({ ...prev, isOpen: false }))
                  }
                >
                  {t('dialog.cancel')}
                </Button>
                <Button
                  size="sm"
                  disabled={approvalCodeInput.length !== 6 || !supportApprovalFlow.request}
                  onClick={() =>
                    supportApprovalFlow.request &&
                    handleApproveSupportAccess(
                      supportApprovalFlow.request.id,
                      approvalCodeInput
                    )
                  }
                >
                  {t('dialog.submit')}
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

