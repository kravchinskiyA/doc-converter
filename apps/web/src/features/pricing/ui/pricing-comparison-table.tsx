'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import type { LimitCategoryGroup } from '../model/types';

interface PricingComparisonTableProps {
  groups: LimitCategoryGroup[];
  className?: string;
}

export function PricingComparisonTable({
  groups,
  className,
}: PricingComparisonTableProps) {
  const t = useTranslations('pricing.table');

  return (
    <div
      className={cn(
        'rounded-[36px] md:rounded-[44px] border border-black/10 bg-pure-white p-6 md:p-10 overflow-hidden',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          {/* <div className="flex items-center gap-2 mb-2"> */}
          {/* <Badge variant="signal-chip">{t('badgeMatrix')}</Badge> */}
          {/* <Badge variant="neutral">{t('badgeSpec')}</Badge> */}
          {/* </div> */}
          <h3 className="text-[24px] md:text-[30px] font-book tracking-tight text-off-black">
            {t('title')}
          </h3>
          <p className="text-[16px] text-steel-gray font-book mt-1">
            {t('subtitle')}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
        <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="border-b border-black/[0.08]">
              <th className="py-4 pr-4 font-regular text-[14px] text-steel-gray uppercase tracking-wider w-[36%]">
                {t('colParameter')}
              </th>
              <th className="py-4 px-3 font-regular text-[16px] text-off-black text-center w-[16%]">
                {t('colBasic')}
              </th>
              <th className="py-4 px-3 font-regular text-[16px] text-signal-blue text-center w-[16%] bg-signal-blue/[0.03] rounded-t-2xl">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-signal-blue" />
                  {t('colPro')}
                </span>
              </th>
              <th className="py-4 px-3 font-regular text-[16px] text-off-black text-center w-[16%]">
                {t('colMax')}
              </th>
              <th className="py-4 pl-3 font-regular text-[16px] text-steel-gray text-center w-[16%]">
                {t('colEnterprise')}
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-black/[0.04]">
            {groups.map((group, groupIdx) => (
              <React.Fragment key={groupIdx}>
                {/* Заголовок группы параметров */}
                <tr className="bg-[#f2f2f4]/60">
                  <td
                    colSpan={5}
                    className="py-3 px-3 font-regular text-[14px] text-off-black uppercase tracking-wider"
                  >
                    {group.groupTitle}
                  </td>
                </tr>

                {/* Строки параметров внутри группы */}
                {group.rows.map((row, rowIdx) => (
                  <tr
                    key={rowIdx}
                    className="hover:bg-black/[0.015] transition-colors"
                  >
                    <td className="py-3.5 pr-4 text-[16px] font-book text-off-black">
                      <div className="flex items-center gap-1.5">
                        <span>{row.parameter}</span>
                        {row.tooltip && (
                          <span
                            title={row.tooltip}
                            className="cursor-help text-steel-gray hover:text-off-black transition-colors"
                          >
                            <HelpCircle className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 px-3 text-[14px] font-book text-steel-gray text-center">
                      {row.basic}
                    </td>

                    <td className="py-3.5 px-3 text-[14px] font-regular text-off-black text-center bg-signal-blue/[0.03]">
                      {row.pro}
                    </td>

                    <td className="py-3.5 px-3 text-[14px] font-book text-off-black text-center">
                      {row.max}
                    </td>

                    <td className="py-3.5 pl-3 text-[14px] font-book text-steel-gray text-center">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-black/[0.06] flex flex-wrap items-center justify-end gap-3 text-[14px] text-steel-gray font-book">
        <span>Все тарифы работают по стандарту GDPR с шифрованием SSE-KMS в ЕС.</span>
      </div>
    </div>
  );
}

