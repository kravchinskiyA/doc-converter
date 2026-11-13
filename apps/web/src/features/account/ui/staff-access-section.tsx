'use client';

import * as React from 'react';
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
  const [approvalCodeInput, setApprovalCodeInput] = React.useState('');

  const formatDate = (isoString: string): string => {
    try {
      const d = new Date(isoString);
      return d.toLocaleDateString('ru-RU', {
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
            Ожидает подтверждения
          </Badge>
        );
      case 'active':
        return (
          <Badge variant="success" className="text-[14px]">
            <CheckCircle2 className="h-3 w-3" />
            Доступ активен (до 24ч)
          </Badge>
        );
      case 'revoked':
        return (
          <Badge variant="muted" className="text-[14px]">
            <XCircle className="h-3 w-3" />
            Отозван пользователем
          </Badge>
        );
      case 'expired':
        return (
          <Badge variant="neutral" className="text-[14px]">
            Истёк срок
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
              <Badge variant="signal-chip">GDPR Privacy</Badge>
              <Badge variant="neutral">ТЗ §12.17</Badge>
            </div>
            <CardTitle className="text-[22px] md:text-[26px]">
              Служебный доступ техподдержки
            </CardTitle>
            <CardDescription className="text-steel-gray text-[14px]">
              Контроль доступа сотрудников поддержки к конкретным файлам для разбора инцидентов и сбоев
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="p-4 rounded-[24px] bg-black/[0.03] border-[0.5px] border-black/5 flex items-start gap-3 text-[14px] text-steel-gray leading-relaxed">
            <ShieldCheck className="h-4 w-4 text-signal-blue shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-off-black block mb-0.5">
                Инвариант конфиденциальности:
              </span>
              Сотрудники сервиса <strong>не имеют прямого доступа</strong> к содержимому ваших документов.
              Доступ может быть предоставлен только по вашему прямому подтверждению кодом из письма
              к конкретным файлам на срок не более 24 часов и может быть отозван вами в любую секунду.
            </div>
          </div>

          {/* Список запросов */}
          {supportRequests.length === 0 ? (
            <div className="rounded-[28px] border-[0.5px] border-dashed border-black/15 p-10 text-center space-y-2 bg-[#fdfdfd]">
              <UserCheck className="h-7 w-7 text-steel-gray/60 mx-auto" />
              <h4 className="text-[15px] font-book text-off-black">Запросов на доступ нет</h4>
              <p className="text-[14px] text-steel-gray max-w-sm mx-auto">
                Когда инженер поддержки запросит просмотр сбойного файла по вашему тикету, запрос появится здесь.
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
                      <span className="text-steel-gray block text-[14px]">Причина запроса:</span>
                      <p className="text-off-black font-book">{req.reason}</p>
                    </div>

                    <div>
                      <span className="text-steel-gray block text-[14px]">Запрашиваемые файлы:</span>
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
                      <span>Запрошен: {formatDate(req.requestedAt)}</span>
                      <span>Действует до: {formatDate(req.expiresAt)}</span>
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
                        Подтвердить кодом на email
                      </Button>
                    )}

                    {req.status === 'active' && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSupportAccess(req.id)}
                        className="border-red-500/30 text-red-600 hover:bg-red-500/5 text-[14px] h-[34px]"
                      >
                        Отозвать доступ немедленно
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
            <Badge variant="signal-chip">Подтверждение ТЗ §12.17</Badge>
            <h3 className="text-[20px] font-book text-off-black">Предоставление доступа инженеру</h3>

            <p className="text-[14px] text-steel-gray leading-relaxed">
              Вы разрешаете инженеру <strong>{supportApprovalFlow.request?.staffName}</strong> просмотр указанных файлов
              на срок до 24 часов. Код подтверждения отправлен на вашу почту (<strong>{userProfile.email}</strong>).
            </p>

            {supportApprovalFlow.error && (
              <div className="p-3 rounded-pill border-[0.5px] border-red-500/30 bg-red-500/[0.05] text-red-600 text-[14px] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{supportApprovalFlow.error}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <label className="text-[14px] font-regular text-off-black block">
                Введите 6-значный проверочный код:
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
                  Отмена
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
                  Разрешить просмотр
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

