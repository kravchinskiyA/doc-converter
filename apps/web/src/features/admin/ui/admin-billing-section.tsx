'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { CreditCard, RotateCw } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import type { AdminPaymentItem, PaymentStatus } from '../model/types';
import type { StaffRole } from '@doc-converter/contracts';

interface AdminBillingSectionProps {
  payments: AdminPaymentItem[];
  staffRole: StaffRole;
  onRetryRefund: (paymentId: string) => void;
}

export function AdminBillingSection({
  payments,
  staffRole,
  onRetryRefund,
}: AdminBillingSectionProps) {
  const t = useTranslations('admin.billing');
  const isAdmin = staffRole === 'admin';

  const [retryingId, setRetryingId] = React.useState<string | null>(null);

  const handleRetry = async (id: string) => {
    setRetryingId(id);
    await new Promise((resolve) => setTimeout(resolve, 600));
    onRetryRefund(id);
    setRetryingId(null);
  };

  const getStatusBadge = (status: PaymentStatus) => {
    switch (status) {
      case 'succeeded':
        return (
          <Badge variant="signal-chip" className="bg-emerald-500/10 text-emerald-700 border-none">
            Оплачено
          </Badge>
        );
      case 'refunded':
        return (
          <Badge variant="neutral">
            Возвращено
          </Badge>
        );
      case 'refund_failed':
        return (
          <Badge variant="muted" className="bg-red-500/10 text-red-600 border-none">
            Ошибка возврата
          </Badge>
        );
    }
  };

  return (
    <div className="space-y-6">
      <Card className="rounded-[40px] border border-black/10 bg-pure-white p-6 md:p-8">
        <CardHeader className="space-y-3 pb-6 border-b border-black/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-[20px] md:text-[24px] flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-signal-blue" />
                {t('title')}
              </CardTitle>
              <CardDescription className="text-steel-gray text-[14px]">
                {t('description')}
              </CardDescription>
            </div>
            {!isAdmin && (
              <Badge variant="muted" className="text-amber-700 bg-amber-500/10 border-amber-500/20">
                {t('supportNotice')}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[14px]">
              <thead>
                <tr className="border-b border-black/10 text-steel-gray font-regular">
                  <th className="pb-3 pr-4 font-normal">{t('colTx')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colCustomer')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colPlan')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colAmount')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colStatus')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colDate')}</th>
                  <th className="pb-3 pl-4 font-normal text-right">{t('colAction')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 font-book text-off-black">
                {payments.map((p) => (
                  <tr key={p.id} className="hover:bg-black/[0.02] transition-colors">
                    {/* Transaction ID */}
                    <td className="py-4 pr-4">
                      <div className="font-mono font-medium text-off-black">{p.id}</div>
                      {p.refundFailureReason && (
                        <p className="text-[14px] text-red-600 max-w-xs truncate" title={p.refundFailureReason}>
                          {p.refundFailureReason}
                        </p>
                      )}
                    </td>

                    {/* Customer ID */}
                    <td className="py-4 px-4 font-mono text-steel-gray">
                      {p.userId}
                    </td>

                    {/* Plan */}
                    <td className="py-4 px-4">
                      <span className="font-regular">{p.plan}</span>
                      <span className="text-[14px] text-steel-gray block">
                        {p.interval === 'month' ? 'Ежемесячно' : 'Ежегодно (-15%)'}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-4 px-4 font-regular whitespace-nowrap">
                      {p.amount.toFixed(2)} €
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(p.status)}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-steel-gray">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>

                    {/* Action: Retry refund without changing amount */}
                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                      {p.status === 'refund_failed' ? (
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={!isAdmin || retryingId === p.id}
                          onClick={() => handleRetry(p.id)}
                          className="rounded-full h-8 text-[14px] gap-1.5 border-red-500/30 text-red-600 hover:bg-red-500/10"
                          title="Повторить неуспешную операцию возврата без изменения суммы по разделу 11.10 ТЗ"
                        >
                          <RotateCw className={`w-3 h-3 ${retryingId === p.id ? 'animate-spin' : ''}`} />
                          {retryingId === p.id ? t('retrying') : t('retryRefund')}
                        </Button>
                      ) : (
                        <span className="text-steel-gray text-[14px]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
