'use client';

import * as React from 'react';
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
  return (
    <div
      className={cn(
        'rounded-[36px] md:rounded-[44px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-10 overflow-hidden',
        className
      )}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="signal-chip">Матрица параметров</Badge>
            <Badge variant="neutral">ТЗ §3.3–§3.8</Badge>
          </div>
          <h3 className="text-[24px] md:text-[30px] font-book tracking-tight text-off-black">
            Сводная таблица лимитов и возможностей
          </h3>
          <p className="text-[14px] text-steel-gray font-book mt-1">
            Детальное техническое сравнение тарифов, квот, вычислительных мощностей и безопасности.
          </p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 md:-mx-10 px-6 md:px-10">
        <table className="w-full min-w-[760px] text-left border-collapse">
          <thead>
            <tr className="border-b border-black/[0.08]">
              <th className="py-4 pr-4 font-regular text-[14px] text-steel-gray uppercase tracking-wider w-[36%]">
                Параметр
              </th>
              <th className="py-4 px-3 font-regular text-[15px] text-off-black text-center w-[16%]">
                Базовый
              </th>
              <th className="py-4 px-3 font-regular text-[15px] text-signal-blue text-center w-[16%] bg-signal-blue/[0.03] rounded-t-2xl">
                <span className="inline-flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-signal-blue" />
                  Pro
                </span>
              </th>
              <th className="py-4 px-3 font-regular text-[15px] text-off-black text-center w-[16%]">
                Максимальный
              </th>
              <th className="py-4 pl-3 font-regular text-[15px] text-steel-gray text-center w-[16%]">
                Enterprise
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
                    className="py-3 px-3 font-regular text-[13px] text-off-black uppercase tracking-wider"
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
                    <td className="py-3.5 pr-4 text-[13.5px] font-book text-off-black">
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

                    <td className="py-3.5 px-3 text-[13px] font-book text-steel-gray text-center">
                      {row.basic}
                    </td>

                    <td className="py-3.5 px-3 text-[13px] font-regular text-off-black text-center bg-signal-blue/[0.03]">
                      {row.pro}
                    </td>

                    <td className="py-3.5 px-3 text-[13px] font-book text-off-black text-center">
                      {row.max}
                    </td>

                    <td className="py-3.5 pl-3 text-[13px] font-book text-steel-gray text-center">
                      {row.enterprise}
                    </td>
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 pt-4 border-t border-black/[0.06] flex flex-wrap items-center justify-between gap-3 text-[12px] text-steel-gray font-book">
        <span>* Лимит страниц не ограничивается продуктово, но действует лимит времени 10 минут и ОЗУ 2 ГБ.</span>
        <span>Все тарифы работают по стандарту GDPR с шифрованием SSE-KMS в ЕС.</span>
      </div>
    </div>
  );
}

