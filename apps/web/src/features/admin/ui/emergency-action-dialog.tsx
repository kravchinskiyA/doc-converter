'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldAlert } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import type { EmergencyActionModalState } from '../model/types';

interface EmergencyActionDialogProps {
  modal: EmergencyActionModalState;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export function EmergencyActionDialog({
  modal,
  onClose,
  onConfirm,
}: EmergencyActionDialogProps) {
  const t = useTranslations('admin.dialog');
  const [reason, setReason] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  if (!modal.isOpen) return null;

  const getTitle = () => {
    switch (modal.type) {
      case 'global_pause':
        return 'Экстренная глобальная приостановка приема конвертаций';
      case 'global_resume':
        return 'Возобновление штатного приема конвертаций';
      case 'user_pause':
        return `Приостановка конвертаций пользователя ${modal.userEmail || modal.targetUserId}`;
      case 'user_resume':
        return `Возобновление конвертаций пользователя ${modal.userEmail || modal.targetUserId}`;
      case 'revoke_api_key':
        return `Отключение API-ключа пользователя ${modal.userEmail || modal.targetUserId}`;
    }
  };

  const handleClose = () => {
    setReason('');
    setError(null);
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim().length < 10) {
      setError(t('minReasonError'));
      return;
    }
    const finalReason = reason.trim();
    setReason('');
    setError(null);
    onConfirm(finalReason);
  };

  return (
    <Dialog open={modal.isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="max-w-lg rounded-[32px] p-6 md:p-8 bg-pure-white border border-black/10">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-600">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-[18px] md:text-[20px] font-book">
                {getTitle()}
              </DialogTitle>
              <DialogDescription className="text-steel-gray text-[14px]">
                Действие фиксируется в журнале безопасности со сроком хранения 90 дней (ТЗ §12.14).
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-[14px] font-regular text-off-black">
              {t('reasonLabel')} <span className="text-red-500">*</span>
            </label>
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (error) setError(null);
              }}
              rows={3}
              placeholder={t('reasonPlaceholder')}
              className="w-full rounded-[16px] border border-black/15 p-3 text-[14px] font-book text-off-black focus:outline-none focus:border-signal-blue resize-none"
            />
            {error && <p className="text-[14px] text-red-500 font-book">{error}</p>}
          </div>

          <div className="flex items-center justify-end gap-3 pt-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
              className="rounded-full"
            >
              {t('cancel')}
            </Button>
            <Button
              type="submit"
              size="sm"
              className="rounded-full bg-signal-blue text-pure-white hover:bg-signal-blue/90"
            >
              {t('confirm')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
