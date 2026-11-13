'use client';

import * as React from 'react';
import { useFormatter, useTranslations } from 'next-intl';
import {
  Calendar,
  HelpCircle,
  Receipt,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import type { PlanTier } from '@doc-converter/contracts';
import type { useAccountState } from '../model/use-account-state';

type SubscriptionSectionProps = ReturnType<typeof useAccountState>;

export function SubscriptionSection({
  subscription,
  transactions,
  handleToggleAutoRenew,
  cancelSubscriptionFlow,
  setCancelSubscriptionFlow,
  handleCancelSubscriptionSubmit,
  changePlanFlow,
  setChangePlanFlow,
  handleChangePlanSubmit,
}: SubscriptionSectionProps) {
  const t = useTranslations('account.subscription');
  const format = useFormatter();
  const [selectedNewPlan, setSelectedNewPlan] = React.useState<PlanTier>('max');

  const formatDate = (isoString: string): string => {
    try {
      return format.dateTime(new Date(isoString), {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return isoString;
    }
  };

  const planTitles: Record<PlanTier, string> = {
    basic: t('plans.basic'),
    pro: t('plans.pro'),
    max: t('plans.max'),
    enterprise: t('plans.enterprise'),
  };

  return (
    <div className="space-y-6">
      {/* Карточка текущей подписки */}
      <Card className="rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-10">
        <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-black/5">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <Badge variant={subscription.status === 'active' ? 'success' : 'neutral'}>
                {subscription.status === 'active' ? t('statusActive') : t('statusBasic')}
              </Badge>
            </div>
            <CardTitle className="text-[22px] md:text-[26px]">
              {t('title', { plan: planTitles[subscription.plan] })}
            </CardTitle>
            <CardDescription className="text-steel-gray text-[14px]">
              {t('description')}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {subscription.plan !== 'basic' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCancelSubscriptionFlow({
                    isOpen: true,
                    calculatedRefundEur: 2.5,
                    daysRemaining: 15,
                    isSubmitting: false,
                  })
                }
                className="border-red-500/30 text-red-600 hover:bg-red-500/5 text-[14px]"
              >
                {t('cancelBtn')}
              </Button>
            )}

            <Button
              size="sm"
              onClick={() => {
                setSelectedNewPlan(subscription.plan === 'pro' ? 'max' : 'pro');
                setChangePlanFlow({
                  isOpen: true,
                  targetPlan: subscription.plan === 'pro' ? 'max' : 'pro',
                  billingPeriod: subscription.billingPeriod,
                  isUpgrade: subscription.plan === 'pro',
                  differenceEur: 2.5,
                  isSubmitting: false,
                });
              }}
              className="gap-1.5 text-[14px]"
            >
              {t('changePlanBtn')}
            </Button>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-[24px] border-[0.5px] border-black/5 bg-[#fdfdfd] p-4 space-y-1">
              <span className="text-[14px] text-steel-gray block">{t('planCostLabel')}</span>
              <div className="text-[20px] font-book text-off-black">
                {subscription.priceEur.toFixed(2)} €
                <span className="text-[14px] text-steel-gray font-regular ml-1">
                  / {subscription.billingPeriod === 'monthly' ? t('perMonth') : t('perYear')}
                </span>
              </div>
            </div>

            <div className="rounded-[24px] border-[0.5px] border-black/5 bg-[#fdfdfd] p-4 space-y-1">
              <span className="text-[14px] text-steel-gray block">{t('paidUntilLabel')}</span>
              <div className="text-[17px] font-book text-off-black flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-signal-blue" />
                {formatDate(subscription.currentPeriodEnd)}
              </div>
              <span className="text-[14px] text-steel-gray block">{t('utcNote')}</span>
            </div>

            {/* Тумблер автопродления (ТЗ §11.1) */}
            <div className="rounded-[24px] border-[0.5px] border-black/5 bg-[#fdfdfd] p-4 flex items-center justify-between gap-3">
              <div>
                <span className="text-[14px] text-steel-gray block">{t('autoRenewLabel')}</span>
                <span className="text-[15px] font-book text-off-black">
                  {subscription.autoRenew ? t('autoRenewOn') : t('autoRenewOff')}
                </span>
                <span className="text-[14px] text-steel-gray block">
                  {subscription.autoRenew
                    ? t('autoRenewOnHint')
                    : t('autoRenewOffHint')}
                </span>
              </div>

              <button
                type="button"
                onClick={handleToggleAutoRenew}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  subscription.autoRenew ? 'bg-signal-blue' : 'bg-black/20'
                }`}
                title={t('autoRenewToggleTitle')}
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-pure-white shadow-none transition duration-200 ease-in-out ${
                    subscription.autoRenew ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Информационный блок о возвратах */}
          <div className="rounded-[24px] border-[0.5px] border-black/5 bg-off-white/40 p-4 flex items-start gap-3 text-[14px] text-steel-gray leading-relaxed">
            <HelpCircle className="h-4 w-4 text-signal-blue shrink-0 mt-0.5" />
            <div>
              <span className="font-medium text-off-black block mb-0.5">
                {t('refundInfoTitle')}
              </span>
              {t('refundInfoDesc')}
            </div>
          </div>

          {/* История платежей и возвратов */}
          <div className="space-y-3 pt-2">
            <h4 className="text-[16px] font-book text-off-black flex items-center gap-2">
              <Receipt className="h-4 w-4 text-steel-gray" />
              {t('historyTitle')}
            </h4>

            <div className="rounded-[24px] border-[0.5px] border-black/10 overflow-hidden bg-[#fdfdfd]">
              <table className="w-full text-left border-collapse text-[14px]">
                <thead>
                  <tr className="border-b border-black/5 bg-black/[0.02] text-steel-gray text-[14px]">
                    <th className="py-3 px-4">{t('columns.date')}</th>
                    <th className="py-3 px-3">{t('columns.description')}</th>
                    <th className="py-3 px-3">{t('columns.status')}</th>
                    <th className="py-3 px-4 text-right">{t('columns.amount')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/5">
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-black/[0.015]">
                      <td className="py-3 px-4 text-steel-gray font-mono text-[14px]">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3 px-3 font-book text-off-black">{tx.description}</td>
                      <td className="py-3 px-3">
                        <Badge
                          variant={tx.type === 'refund' ? 'signal-chip' : 'success'}
                          className="text-[14px] py-0.5"
                        >
                          {tx.type === 'refund' ? t('statusRefund') : t('statusPaid')}
                        </Badge>
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono text-[14px] ${
                          tx.amountEur < 0 ? 'text-signal-blue font-medium' : 'text-off-black'
                        }`}
                      >
                        {tx.amountEur > 0 ? `+${tx.amountEur.toFixed(2)}` : tx.amountEur.toFixed(2)} €
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Диалог смены тарифа (ТЗ §11.3) */}
      <Dialog
        open={changePlanFlow.isOpen}
        onOpenChange={(open) => setChangePlanFlow((prev) => ({ ...prev, isOpen: open }))}
      >
        <DialogContent
          onClose={() => setChangePlanFlow((prev) => ({ ...prev, isOpen: false }))}
          className="max-w-[500px]"
        >
          <div className="space-y-4">
            <Badge variant="signal-chip">{t('changeDialog.badge')}</Badge>
            <h3 className="text-[20px] font-book text-off-black">{t('changeDialog.title')}</h3>

            <p className="text-[14px] text-steel-gray leading-relaxed">
              {t.rich('changeDialog.description', {
                date: formatDate(subscription.currentPeriodEnd),
                bold: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>

            <div className="space-y-2 pt-2">
              <label className="text-[14px] font-regular text-off-black block">
                {t('changeDialog.selectLabel')}
              </label>

              <div
                onClick={() => setSelectedNewPlan('pro')}
                className={`p-4 rounded-[20px] border-[0.5px] cursor-pointer transition-all ${
                  selectedNewPlan === 'pro'
                    ? 'border-signal-blue bg-signal-blue/[0.04]'
                    : 'border-black/10 bg-[#fdfdfd] hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-book text-[15px] text-off-black">{t('changeDialog.proTitle')}</span>
                  <span className="font-mono text-[14px]">{t('changeDialog.proPrice')}</span>
                </div>
                <span className="text-[14px] text-steel-gray">
                  {t('changeDialog.proDesc')}
                </span>
              </div>

              <div
                onClick={() => setSelectedNewPlan('max')}
                className={`p-4 rounded-[20px] border-[0.5px] cursor-pointer transition-all ${
                  selectedNewPlan === 'max'
                    ? 'border-signal-blue bg-signal-blue/[0.04]'
                    : 'border-black/10 bg-[#fdfdfd] hover:bg-black/[0.02]'
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-book text-[15px] text-off-black">{t('changeDialog.maxTitle')}</span>
                  <span className="font-mono text-[14px]">{t('changeDialog.maxPrice')}</span>
                </div>
                <span className="text-[14px] text-steel-gray">
                  {t('changeDialog.maxDesc')}
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-[18px] bg-black/[0.03] text-[14px] text-off-black flex justify-between items-center">
              <span>{t('changeDialog.estimatedLabel')}</span>
              <strong className="font-mono text-[14px] text-signal-blue">
                {selectedNewPlan === 'max' ? t('changeDialog.estimatedUpgrade') : t('changeDialog.estimatedDowngrade')}
              </strong>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChangePlanFlow((prev) => ({ ...prev, isOpen: false }))}
              >
                {t('changeDialog.cancel')}
              </Button>
              <Button size="sm" onClick={() => handleChangePlanSubmit(selectedNewPlan)}>
                {t('changeDialog.confirm')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог немедленной отмены подписки (ТЗ §11.2) */}
      <Dialog
        open={cancelSubscriptionFlow.isOpen}
        onOpenChange={(open) =>
          setCancelSubscriptionFlow((prev) => ({ ...prev, isOpen: open }))
        }
      >
        <DialogContent
          onClose={() => setCancelSubscriptionFlow((prev) => ({ ...prev, isOpen: false }))}
          className="max-w-[480px]"
        >
          <div className="space-y-4">
            <Badge variant="error">{t('cancelDialog.badge')}</Badge>
            <h3 className="text-[20px] font-book text-off-black">{t('cancelDialog.title')}</h3>

            <p className="text-[14px] text-steel-gray leading-relaxed">
              {t.rich('cancelDialog.description', {
                days: cancelSubscriptionFlow.daysRemaining,
                bold: (chunks) => <strong>{chunks}</strong>,
              })}
            </p>

            <div className="p-4 rounded-[20px] border-[0.5px] border-emerald-500/30 bg-emerald-500/[0.04] space-y-1">
              <span className="text-[14px] text-emerald-800 font-medium block">
                {t('cancelDialog.refundBoxTitle')}
              </span>
              <div className="text-[22px] font-mono text-emerald-700">
                {cancelSubscriptionFlow.calculatedRefundEur.toFixed(2)} €
              </div>
              <span className="text-[14px] text-emerald-800/80 block">
                {t('cancelDialog.refundBoxNote')}
              </span>
            </div>

            <p className="text-[14px] text-steel-gray">
              {t('cancelDialog.autoRenewHint', { date: formatDate(subscription.currentPeriodEnd) })}
            </p>

            <div className="flex justify-end gap-2 pt-2 border-t border-black/5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() =>
                  setCancelSubscriptionFlow((prev) => ({ ...prev, isOpen: false }))
                }
              >
                {t('cancelDialog.keepBtn')}
              </Button>
              <Button
                size="sm"
                className="bg-red-600 hover:bg-red-700 text-white border-0"
                onClick={handleCancelSubscriptionSubmit}
              >
                {t('cancelDialog.confirmBtn', {
                  amount: cancelSubscriptionFlow.calculatedRefundEur.toFixed(2),
                })}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

