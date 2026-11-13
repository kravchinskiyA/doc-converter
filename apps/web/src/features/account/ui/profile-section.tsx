'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
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
  const t = useTranslations('account.profile');
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
              <Badge variant="success">
                <CheckCircle2 className="h-3 w-3" />
                {t('emailVerified')}
              </Badge>
            </div>
            <CardTitle className="text-[22px] md:text-[26px]">{t('title')}</CardTitle>
            <CardDescription className="text-steel-gray text-[14px]">
              {t('description')}
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
              {t('editNameBtn')}
            </Button>
          )}
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          {isEditingProfile ? (
            <div className="rounded-[24px] border-[0.5px] border-black/10 bg-off-white/40 p-5 space-y-4 max-w-lg">
              <h4 className="text-[15px] font-medium text-off-black">{t('editFormTitle')}</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-[14px] font-regular text-steel-gray block mb-1">
                    {t('firstNameLabel')}
                  </label>
                  <Input
                    value={profileForm.firstName}
                    maxLength={50}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, firstName: e.target.value }))
                    }
                    placeholder={t('firstNamePlaceholder')}
                  />
                </div>
                <div>
                  <label className="text-[14px] font-regular text-steel-gray block mb-1">
                    {t('lastNameLabel')}
                  </label>
                  <Input
                    value={profileForm.lastName}
                    maxLength={50}
                    onChange={(e) =>
                      setProfileForm((prev) => ({ ...prev, lastName: e.target.value }))
                    }
                    placeholder={t('lastNamePlaceholder')}
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2">
                <Button size="sm" onClick={handleUpdateProfile}>
                  {t('saveChanges')}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsEditingProfile(false)}
                >
                  {t('cancel')}
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
                  <span className="text-[14px] text-steel-gray block">{t('accountOwner')}</span>
                  <span className="text-[15px] font-book text-off-black">
                    {userProfile.firstName || userProfile.lastName
                      ? `${userProfile.firstName} ${userProfile.lastName}`.trim()
                      : t('nameNotSet')}
                  </span>
                </div>
              </div>

              <div className="rounded-[24px] border-[0.5px] border-black/5 bg-[#fdfdfd] p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 truncate">
                  <div className="h-10 w-10 rounded-full bg-black/[0.04] flex items-center justify-center shrink-0">
                    <Mail className="h-5 w-5 text-off-black" />
                  </div>
                  <div className="truncate">
                    <span className="text-[14px] text-steel-gray block">{t('primaryEmail')}</span>
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
                  {t('changeBtn')}
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
                <span className="text-[14px] font-book text-off-black block">{t('passwordTitle')}</span>
                <span className="text-[14px] text-steel-gray block">
                  {t('passwordHint')}
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
              {t('changePasswordBtn')}
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
              <Badge variant="signal-chip">{t('emailDialog.badge')}</Badge>
              {emailChangeFlow.step !== 'completed' && (
                <div className="flex items-center gap-1.5 text-[14px] text-steel-gray">
                  <Clock className="h-3.5 w-3.5 text-signal-blue" />
                  <span>{t('emailDialog.timeLeft', { time: formatTimer(emailChangeFlow.timeLeftSeconds) })}</span>
                </div>
              )}
            </div>

            <h3 className="text-[20px] font-book text-off-black">{t('emailDialog.title')}</h3>

            <p className="text-[14px] text-steel-gray leading-relaxed">
              {t('emailDialog.description')}
            </p>

            {emailChangeFlow.error && (
              <div className="p-3 rounded-pill border-[0.5px] border-red-500/30 bg-red-500/[0.05] text-red-600 text-[14px] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{emailChangeFlow.error}</span>
              </div>
            )}

            {emailChangeFlow.step === 'init' && (
              <div className="space-y-3 pt-2">
                <label className="text-[14px] font-regular text-off-black block">
                  {t('emailDialog.newEmailLabel')}
                </label>
                <Input
                  type="email"
                  value={initEmailInput}
                  onChange={(e) => setInitEmailInput(e.target.value)}
                  placeholder={t('emailDialog.newEmailPlaceholder')}
                  autoFocus
                />
                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={!initEmailInput.includes('@')}
                    onClick={() => handleInitEmailSubmit(initEmailInput)}
                  >
                    {t('emailDialog.sendFirstCode')}
                  </Button>
                </div>
              </div>
            )}

            {emailChangeFlow.step === 'step1_old_email' && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-[20px] bg-black/[0.03] text-[14px] text-off-black">
                  {t.rich('emailDialog.step1Sent', {
                    email: userProfile.email,
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </div>
                <label className="text-[14px] font-regular text-off-black block">
                  {t('emailDialog.step1CodeLabel')}
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
                    {t('emailDialog.step1Submit')}
                  </Button>
                </div>
              </div>
            )}

            {emailChangeFlow.step === 'step2_new_email' && (
              <div className="space-y-4 pt-2">
                <div className="p-3 rounded-[20px] bg-black/[0.03] text-[14px] text-off-black">
                  {t.rich('emailDialog.step2Sent', {
                    email: emailChangeFlow.newEmail,
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </div>
                <div>
                  <label className="text-[14px] font-regular text-off-black block mb-1">
                    {t('emailDialog.step2CodeLabel')}
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
                    label={t('emailDialog.terminateSessionsLabel')}
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <Button
                    size="sm"
                    disabled={newEmailCodeInput.length !== 6}
                    onClick={() => handleCompleteEmailChange(newEmailCodeInput)}
                  >
                    {t('emailDialog.step2Submit')}
                  </Button>
                </div>
              </div>
            )}

            {emailChangeFlow.step === 'completed' && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-[18px] font-book text-off-black">{t('emailDialog.completedTitle')}</h4>
                <p className="text-[14px] text-steel-gray">
                  {t.rich('emailDialog.completedDesc', {
                    email: userProfile.email,
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() => setEmailChangeFlow((prev) => ({ ...prev, isOpen: false }))}
                  >
                    {t('emailDialog.doneBtn')}
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
            <Badge variant="signal-chip">{t('passwordDialog.badge')}</Badge>
            <h3 className="text-[20px] font-book text-off-black">{t('passwordDialog.title')}</h3>

            <p className="text-[14px] text-steel-gray leading-relaxed">
              {t('passwordDialog.description')}
            </p>

            {passwordChangeFlow.error && (
              <div className="p-3 rounded-pill border-[0.5px] border-red-500/30 bg-red-500/[0.05] text-red-600 text-[14px] flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{passwordChangeFlow.error}</span>
              </div>
            )}

            {passwordChangeFlow.step === 'input' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="text-[14px] font-regular text-steel-gray block mb-1">
                    {t('passwordDialog.currentPassword')}
                  </label>
                  <Input
                    type="password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-regular text-steel-gray block mb-1">
                    {t('passwordDialog.newPassword')}
                  </label>
                  <Input
                    type="password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <label className="text-[14px] font-regular text-steel-gray block mb-1">
                    {t('passwordDialog.confirmPassword')}
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
                    {t('passwordDialog.nextSendCode')}
                  </Button>
                </div>
              </div>
            )}

            {passwordChangeFlow.step === 'verify_code' && (
              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-[20px] bg-black/[0.03] text-[14px] text-off-black">
                  {t.rich('passwordDialog.codeSent', {
                    email: userProfile.email,
                    bold: (chunks) => <strong>{chunks}</strong>,
                  })}
                </div>
                <label className="text-[14px] font-regular text-off-black block">
                  {t('passwordDialog.enterCode')}
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
                    {t('passwordDialog.submit')}
                  </Button>
                </div>
              </div>
            )}

            {passwordChangeFlow.step === 'completed' && (
              <div className="text-center py-4 space-y-3">
                <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
                <h4 className="text-[18px] font-book text-off-black">{t('passwordDialog.completedTitle')}</h4>
                <p className="text-[14px] text-steel-gray">
                  {t('passwordDialog.completedDesc')}
                </p>
                <div className="pt-2">
                  <Button
                    size="sm"
                    onClick={() =>
                      setPasswordChangeFlow((prev) => ({ ...prev, isOpen: false }))
                    }
                  >
                    {t('passwordDialog.close')}
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

