'use client';

import * as React from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Badge } from '@/shared/ui/badge';
import type { FaqItem } from '../model/types';

interface PricingFaqProps {
  items: FaqItem[];
  className?: string;
}

export function PricingFaq({ items, className }: PricingFaqProps) {
  const [openIds, setOpenIds] = React.useState<Record<string, boolean>>({
    'vat-and-seller': true,
    'quota-cycle': true,
  });

  const toggle = (id: string) => {
    setOpenIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div
      className={cn(
        'rounded-[36px] md:rounded-[44px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-10',
        className
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="signal-chip">Вопросы и ответы</Badge>
        <Badge variant="neutral">Прозрачные условия</Badge>
      </div>

      <h3 className="text-[24px] md:text-[30px] font-book tracking-tight text-off-black mb-2">
        Часто задаваемые вопросы
      </h3>
      <p className="text-[14px] text-steel-gray font-book mb-8">
        Всё, что вам нужно знать об оплате, правилах восстановления лимитов, налогах и условиях отмены.
      </p>

      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = Boolean(openIds[item.id]);

          return (
            <div
              key={item.id}
              className="rounded-2xl border-[0.5px] border-black/[0.08] bg-[#fdfdfd] overflow-hidden transition-colors"
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                aria-expanded={isOpen}
                className="w-full flex items-center justify-between gap-4 p-4 md:p-5 text-left text-off-black hover:bg-black/[0.015] transition-colors"
              >
                <span className="text-[15px] md:text-[16px] font-regular tracking-tight flex items-center gap-2.5">
                  <HelpCircle className="w-4 h-4 text-signal-blue shrink-0" />
                  {item.question}
                </span>
                <ChevronDown
                  className={cn(
                    'w-4 h-4 text-steel-gray shrink-0 transition-transform duration-200',
                    isOpen && 'rotate-180 text-signal-blue'
                  )}
                />
              </button>

              {isOpen && (
                <div className="px-4 md:px-5 pb-5 pt-1 text-[13.5px] text-steel-gray font-book leading-relaxed border-t border-black/[0.04]">
                  {item.answer}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

