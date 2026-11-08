'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { ShieldCheck, History, CheckCircle2, XCircle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/shared/ui/card';
import { Badge } from '@/shared/ui/badge';
import type { AdminAuditItem } from '../model/types';

interface AdminAuditSectionProps {
  auditLogs: AdminAuditItem[];
}

export function AdminAuditSection({ auditLogs }: AdminAuditSectionProps) {
  const t = useTranslations('admin.audit');

  return (
    <div className="space-y-6">
      <Card className="rounded-[40px] border border-black/10 bg-pure-white p-6 md:p-8">
        <CardHeader className="space-y-3 pb-6 border-b border-black/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="text-[20px] md:text-[24px] flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-signal-blue" />
                {t('title')}
              </CardTitle>
              <CardDescription className="text-steel-gray text-[14px]">
                {t('description')}
              </CardDescription>
            </div>
            <Badge variant="neutral" className="gap-1.5 text-steel-gray">
              <History className="w-3.5 h-3.5" />
              {t('retentionNotice')}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-black/10 text-steel-gray font-regular">
                  <th className="pb-3 pr-4 font-normal">{t('colTime')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colActor')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colAction')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colTarget')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colReason')}</th>
                  <th className="pb-3 px-4 font-normal">{t('colIp')}</th>
                  <th className="pb-3 pl-4 font-normal text-right">{t('colResult')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/5 font-book text-off-black">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-black/[0.02] transition-colors">
                    {/* Time */}
                    <td className="py-4 pr-4 whitespace-nowrap text-steel-gray font-mono text-[11px]">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>

                    {/* Actor + Role */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="font-medium text-off-black">{log.actorEmail}</div>
                      <Badge
                        variant={log.actorRole === 'admin' ? 'signal-chip' : 'neutral'}
                        className="text-[10px] py-0 px-1.5 mt-0.5"
                      >
                        {log.actorRole}
                      </Badge>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-4 whitespace-nowrap font-mono text-[12px] font-medium text-signal-blue">
                      {log.action}
                    </td>

                    {/* Target */}
                    <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-steel-gray">
                      {log.target}
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-4 max-w-sm">
                      <span className="text-off-black text-[12px] line-clamp-2" title={log.reason}>
                        {log.reason}
                      </span>
                    </td>

                    {/* IP */}
                    <td className="py-4 px-4 whitespace-nowrap font-mono text-[11px] text-steel-gray">
                      {log.ip}
                    </td>

                    {/* Result */}
                    <td className="py-4 pl-4 text-right whitespace-nowrap">
                      {log.result === 'success' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-600 font-medium text-[12px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          OK
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-600 font-medium text-[12px]">
                          <XCircle className="w-3.5 h-3.5" />
                          ERR
                        </span>
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
