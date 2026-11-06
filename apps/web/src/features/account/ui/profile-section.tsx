'use client';

import * as React from 'react';
import {
  User,
  Mail,
  Lock,
  CheckCircle2,
  AlertCircle,
  Clock,
  Edit2,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { Input } from '@/shared/ui/input';
import { Checkbox } from '@/shared/ui/checkbox';
import type { useAccountState } from '../model/use-account-state';

type ProfileSectionProps = ReturnType<typeof useAccountState>;

export function ProfileSection({
  userProfile,
  isEditingProfile,
  setIsEditingProfile,
  profileForm,
  setProfileForm,
  handleUpdateProfile,
  emailChangeFlow,
  setEmailChangeFlow,
  handleStartEmailChange,
  handleInitEmailSubmit,
  handleVerifyOldEmailCode,
  handleCompleteEmailChange,
  passwordChangeFlow,
  setPasswordChangeFlow,
  handleStartPasswordChange,
  handlePasswordInputSubmit,
  handleCompletePasswordChange,
}: ProfileSectionProps) {
  const [initEmailInput, setInitEmailInput] = React.useState('');
  const [oldEmailCodeInput, setOldEmailCodeInput] = React.useState('');
  const [newEmailCodeInput, setNewEmailCodeInput] = React.useState('');

  const [currentPass, setCurrentPass] = React.useState('');
  const [newPass, setNewPass] = React.useState('');
  const [confirmPass, setConfirmPass] = React.useState('');
  const [passEmailCode, setPassEmailCode] = React.useState('');

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-6">
      {/* Главная карточка профиля */}
      <Card className="rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-10">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-black/5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant="signal-chip">EU Region (Frankfurt)</Badge>
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3" />
                Email подтверждён
              </Badge>
            </div>
            <CardTitle className="text-[22px] md:text-[26px]">Личный профиль</CardTitle>
            <CardDescription className="text-steel-gray text-[14px]">
              Управление персональными данными, контактным адресом и безопасностью доступа
            </CardDescription>
          </div>
          {!isEditingProfile && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setProfileForm({
                  firstName: userProfile.firstName || '',
                  lastName: userProfile.lastName || '',
                });
                setIsEditingProfile(true);
              }}
              className="gap-2"
            >
              <Edit2 className="h-3.5 w-3.5" />
              Редактировать ФИО
            </Button>
          )}
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {isEditingProfile ? (
            <div className="rounded-[24px] border-[0.5px] border-black/10 bg-off-white/40 p-5 space-y-4 max-w-lg">
              <h4 className="text-[15px] font-medium text-off-black">Редактирование имени и фамилии</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[12px] font-regular text-steel-gray block mb-1">
                    Имя (необязательно, макс. 50 символов)
                  </label>
                  <Input
                    value={profileForm.firstName}
                    maxLength={50}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    placeholder="Например: Алексей"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-regular text-steel-gray block mb-1">
                    Фамилия (необязательно, макс. 50 символов)
                  </label>
                  <Input
                    value={profileForm.lastName}
                    maxLength={50}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    placeholder="Например: Коваленко"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" onClick={handleUpdateProfile}>
                  Сохранить изменения
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingProfile(false)}
                >
                  Отмена
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-[24px] border-[0.5px] border-black/5 bg-[#fdfdfd] p-4 flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-black/[0.04] flex items-center justify-center shrink-0">
                  <User className="h-5 w-5 text-off-black" />
                </div>
                <div>
                  <span className="text-[12px] text-steel-gray block">Владелец аккаунта</span>
                  <span className="text-[15px] font-book text-off-black">
                    {userProfile.firstName || userProfile.lastName
                      ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
                      : 'Имя не указано'}
                  </span>
                </div>
              </div>

              <div className="rounded-[24px] border-[0.5px] border-black/5 bg-[#fdfdfd] p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div className="h-10 w-10 rounded-full bg-black/[0.04] flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-off-black" />
                  </div>
                  <div className="truncate">
                    <span className="text-[12px] text-steel-gray block">Основной email</span>
                    <span className="text-[15px] font-book text-off-black truncate block">
                      {userProfile.email}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setInitEmailInput('');
                    handleStartEmailChange();
                  }}
                  className="shrink-0"
                >
                  Сменить
                </Button>
              </div>
            </div>
          )}

          {/* Безопасность и пароль */}
          <div className="pt-4 border-t border-black/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-black/[0.04] flex items-center justify-center shrink-0">
                <Lock className="h-5 w-5 text-off-black" />
              </div>
              <div>
                <span className="text-[14px] font-book text-off-black block">Пароль учётной записи</span>
                <span className="text-[12px] text-steel-gray block">
                  Защищён криптографическим хэшем scrypt. Смена пароля отзывает все сессии и API-ключ.
                </span>
              </div>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setCurrentPass('');
                setNewPass('');
                setConfirmPass('');
                setPassEmailCode('');
                handleStartPasswordChange();
              }}
            >
              Сменить пароль
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Диалог двухэтапной смены email (ТЗ §6.2) */}
      <Dialog
        open={emailChangeFlow.isOpen}
        onOpenChange={(open) => setEmailChangeFlow((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent
          onClose={() => setEmailChangeFlow((prev) => ({ ...prev, isOpen: false }))}
          className="max-w-[520px]"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="signal-chip">Двухэтапная процедура</Badge>
              {emailChangeFlow.step !== 'completed' && (
                <div className="flex items-center gap-1.5 text-[12px] text-steel-gray">
                  <Clock className="h-3.5 w-3.5 text-signal-blue" />
                  <span>Осталось: {formatTimer(emailChangeFlow.timeLeftSeconds)}</span>
                </div>
              )}
            </div>

            <h3 className="text-[20px] font-book text-off-black">Смена адреса электронной почты</h3>

            <p className="text-[13px] text-steel-gray leading-relaxed">
              По стандартам безопасности ТЗ §6.2 требуется подтверждение кодами из двух писем:
              первый отправляется на ваш текущий адрес, второй — на новый. Общий срок операции — 20 минут.
            </p>

            {emailChangeFlow.error && (
              <div className="p-3 rounded-pill border-[0.5px] border-red-500/30 bg-red-500/[0.05] text-red-600 text-[13px] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{emailChangeFlow.error}</span>
              </div>
            )}

            {emailChangeFlow.step === 'init' && (
              <div className="space-y-3 pt-2">
                <label className="text-[13px] font-regular text-off-black block">
                  Введите новый адрес электронной почты:
                </label>
                <Input
                  type="email"
                  value={initEmailInput}
                  onChange={(e) => setInitEmailInput(e.target.value)}
                  placeholder="new-email@example.com"
                  autoFocus
                />
                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={!initEmailInput.includes('@')}
                    onClick={() => handleInitEmailSubmit(initEmailInput)}
                  >
                    Отправить первый код
                  </Button>
                </div>
              </div>
            )}

            {emailChangeFlow.step === 'step1_old_email' && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-[20px] bg-black/[0.03] text-[13px] text-off-black">
                  Код №1 отправлен на старую почту: <strong>{userProfile.email}</strong>
                </div>
                <label className="text-[13px] font-regular text-off-black block">
                  Введите 6-значный код из письма на старую почту:
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  value={oldEmailCodeInput}
                  onChange={(e) => setOldEmailCodeInput(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="tracking-widest text-center text-[18px]"
                  autoFocus
                />
                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={oldEmailCodeInput.length !== 6}
                    onClick={() => handleVerifyOldEmailCode(oldEmailCodeInput)}
                  >
                    Подтвердить и выслать код №2
                  </Button>
                </div>
              </div>
            )}

            {emailChangeFlow.step === 'step2_new_email' && (
              <div className="space-y-4 pt-2">
                <div className="p-3 rounded-[20px] bg-black/[0.03] text-[13px] text-off-black">
                  Код №2 отправлен на новый адрес: <strong>{emailChangeFlow.newEmail}</strong>
                </div>
                <div>
                  <label className="text-[13px] font-regular text-off-black block mb-1">
                    Введите 6-значный код из письма на новую почту:
                  </label>
                  <Input
                    type="text"
                    maxLength={6}
                    value={newEmailCodeInput}
                    onChange={(e) => setNewEmailCodeInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="654321"
                    className="tracking-widest text-center text-[18px]"
                    autoFocus
                  />
                </div>

                <div className="pt-2 border-t border-black/5">
                  <Checkbox
                    id="term-sessions-check"
                    checked={emailChangeFlow.terminateSessionsAndApiKey}
                    onChange={(e) =>
                      setEmailChangeFlow((prev) => ({
                        ...prev,
                        terminateSessionsAndApiKey: e.target.checked,
                      }))
                    }
                    label="Выйти на всех устройствах и отключить API-ключ после смены email (ТЗ §6.2, рекомендуется)"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={newEmailCodeInput.length !== 6}
                    onClick={() => handleCompleteEmailChange(newEmailCodeInput)}
                  >
                    Завершить смену почты
                  </Button>
                </div>
              </div>
            )}

            {emailChangeFlow.step === 'completed' && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-[18px] font-book text-off-black">Адрес почты успешно изменён!</h4>
                <p className="text-[13px] text-steel-gray">
                  Новый email <strong>{userProfile.email}</strong> теперь используется для входа и всех уведомлений.
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => setEmailChangeFlow((prev) => ({ ...prev, isOpen: false }))}
                  >
                    Понятно
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог смены пароля (ТЗ §6.3) */}
      <Dialog
        open={passwordChangeFlow.isOpen}
        onOpenChange={(open) =>
          setPasswordChangeFlow((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent
          onClose={() => setPasswordChangeFlow((prev) => ({ ...prev, isOpen: false }))}
          className="max-w-[480px]"
        >
          <div className="space-y-4">
            <Badge variant="signal-chip">Безопасность scrypt</Badge>
            <h3 className="text-[20px] font-book text-off-black">Смена пароля аккаунта</h3>

            <p className="text-[13px] text-steel-gray leading-relaxed">
              По ТЗ §6.3 смена пароля подтверждается кодом на почту и немедленно завершает все активные сессии
              на всех устройствах, а также отзывает действующий API-ключ.
            </p>

            {passwordChangeFlow.error && (
              <div className="p-3 rounded-pill border-[0.5px] border-red-500/30 bg-red-500/[0.05] text-red-600 text-[13px] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{passwordChangeFlow.error}</span>
              </div>
            )}

            {passwordChangeFlow.step === 'input' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[12px] font-regular text-steel-gray block mb-1">
                    Текущий пароль
                  </label>
                  <Input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-regular text-steel-gray block mb-1">
                    Новый пароль (от 8 до 128 символов)
                  </label>
                  <Input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-[12px] font-regular text-steel-gray block mb-1">
                    Повторите новый пароль
                  </label>
                  <Input
                    type="password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={!currentPass || !newPass || !confirmPass}
                    onClick={() =>
                      handlePasswordInputSubmit(currentPass, newPass, confirmPass)
                    }
                  >
                    Далее: выслать код
                  </Button>
                </div>
              </div>
            )}

            {passwordChangeFlow.step === 'verify_code' && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-[20px] bg-black/[0.03] text-[13px] text-off-black">
                  6-значный проверочный код отправлен на <strong>{userProfile.email}</strong>
                </div>
                <label className="text-[13px] font-regular text-off-black block">
                  Введите 6-значный код:
                </label>
                <Input
                  type="text"
                  maxLength={6}
                  value={passEmailCode}
                  onChange={(e) => setPassEmailCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="tracking-widest text-center text-[18px]"
                  autoFocus
                />
                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={passEmailCode.length !== 6}
                    onClick={() => handleCompletePasswordChange(passEmailCode)}
                  >
                    Подтвердить смену пароля
                  </Button>
                </div>
              </div>
            )}

            {passwordChangeFlow.step === 'completed' && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-[18px] font-book text-off-black">Пароль успешно обновлён</h4>
                <p className="text-[13px] text-steel-gray">
                  Все другие сессии завершены, API-ключ отозван по соображениям безопасности.
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      setPasswordChangeFlow((prev) => ({ ...prev, isOpen: false }))
                    }
                  >
                    Закрыть
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

