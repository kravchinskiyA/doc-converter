'use client';

import * as React from 'react';
import {
  AlertTriangle,
  Trash2,
  AlertCircle,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import type { useAccountState } from '../model/use-account-state';

type DangerZoneSectionProps = ReturnType<typeof useAccountState>;

export function DangerZoneSection({
  userProfile,
  deleteAccountFlow,
  setDeleteAccountFlow,
  handleDeleteAccountSubmit,
}: DangerZoneSectionProps) {
  const [deleteCodeInput, setDeleteCodeInput] = React.useState('');
  const [confirmedLoss, setConfirmedLoss] = React.useState(false);

  return (
    <div className="space-y-6">
      <Card className="rounded-[40px] border-[0.5px] border-red-500/30 bg-pure-white p-6 md:p-10">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-red-500/10">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="error">Опасная зона (Danger Zone)</Badge>
              <Badge variant="neutral">ТЗ §6.4</Badge>
            </div>
            <CardTitle className="text-[22px] md:text-[26px] text-red-600">
              Удаление аккаунта
            </CardTitle>
            <CardDescription className="text-steel-gray text-[14px]">
              Полное прекращение обслуживания, удаление файлов и аннулирование подписки
            </CardDescription>
          </div>

          <Button
            size="sm"
            onClick={() => {
              setDeleteCodeInput('');
              setConfirmedLoss(false);
              setDeleteAccountFlow({
                isOpen: true,
                emailCode: '',
                confirmedCheckbox: false,
                isSubmitting: false,
              });
            }}
            className="bg-red-600 hover:bg-red-700 text-white border-0 gap-2 shrink-0"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Удалить аккаунт навсегда
          </Button>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          <div className="rounded-[24px] border-[0.5px] border-red-500/20 bg-red-500/[0.03] p-5 space-y-3 text-[14px] text-red-950/80 leading-relaxed">
            <h4 className="font-medium text-[15px] text-red-700 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-600" />
              Последствия подтверждения удаления по ТЗ §6.4:
            </h4>
            <ul className="space-y-1.5 list-disc pl-5 text-[14px] text-red-900/90">
              <li>
                <strong>Все сохранённые документы и результаты:</strong> будут немедленно заблокированы
                и безвозвратно удалены из облачного хранилища S3 в течение 1 часа.
              </li>
              <li>
                <strong>Платная подписка:</strong> немедленно прекращается. Внимание: в отличие от самостоятельной
                отмены подписки, <strong>при удалении аккаунта возврат средств за оставшийся оплаченный период не производится</strong> (ТЗ §6.4, §11.3).
              </li>
              <li>
                <strong>Сессии и API-ключ:</strong> все сеансы входа на всех устройствах немедленно завершаются,
                API-ключ аннулируется, незавершённые задания в очереди останавливаются.
              </li>
              <li>
                <strong>Резервные копии:</strong> очищаются в соответствии с 30-дневным регламентом шифрованных бэкапов.
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Диалог подтверждения удаления кодом на email */}
      <Dialog
        open={deleteAccountFlow.isOpen}
        onOpenChange={(open) =>
          setDeleteAccountFlow((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent
          onClose={() => setDeleteAccountFlow((prev) => ({ ...prev, isOpen: false }))}
          className="max-w-[500px]"
        >
          <div className="space-y-4">
            <Badge variant="error">Подтверждение удаления аккаунта</Badge>
            <h3 className="text-[20px] font-book text-off-black">Вы уверены, что хотите удалить аккаунт?</h3>

            <p className="text-[14px] text-steel-gray leading-relaxed">
              Это действие необратимо. Для подтверждения мы выслали 6-значный проверочный код на ваш email{' '}
              <strong>{userProfile.email}</strong>.
            </p>

            {deleteAccountFlow.error && (
              <div className="p-3 rounded-pill border-[0.5px] border-red-500/30 bg-red-500/[0.05] text-red-600 text-[14px] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{deleteAccountFlow.error}</span>
              </div>
            )}

            <div className="space-y-3 pt-2">
              <label className="text-[14px] font-regular text-off-black block">
                Введите 6-значный код из письма:
              </label>
              <Input
                type="text"
                maxLength={6}
                value={deleteCodeInput}
                onChange={(e) => setDeleteCodeInput(e.target.value.replace(/\D/g, ''))}
                placeholder="123456"
                className="tracking-widest text-center text-[18px]"
                autoFocus
              />

              <div className="pt-2 border-t border-black/5">
                <Checkbox
                  id="delete-loss-checkbox"
                  checked={confirmedLoss}
                  onChange={(e) => setConfirmedLoss(e.target.checked)}
                  label="Я понимаю, что все файлы будут удалены, а остаток оплаты за подписку не возвращается"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setDeleteAccountFlow((prev) => ({ ...prev, isOpen: false }))
                  }
                >
                  Отмена
                </Button>
                <Button
                  size="sm"
                  disabled={deleteCodeInput.length !== 6 || !confirmedLoss}
                  className="bg-red-600 hover:bg-red-700 text-white border-0"
                  onClick={() => handleDeleteAccountSubmit(deleteCodeInput)}
                >
                  Подтвердить удаление
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

