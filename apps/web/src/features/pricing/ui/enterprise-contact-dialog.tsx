'use client';

import * as React from 'react';
import { Mail, Building2, CheckCircle2, Send, Loader2 } from 'lucide-react';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Input } from '@/shared/ui/input';
import { Badge } from '@/shared/ui/badge';

interface EnterpriseContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function EnterpriseContactDialog({
  open,
  onOpenChange,
}: EnterpriseContactDialogProps) {
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [volume, setVolume] = React.useState('5000');
  const [message, setMessage] = React.useState('');
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setName('');
    setEmail('');
    setCompany('');
    setMessage('');
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        if (!val) resetForm();
        onOpenChange(val);
      }}
    >
      <DialogContent
        onClose={() => onOpenChange(false)}
        className="max-w-[540px] p-6 md:p-8 rounded-[36px]"
      >
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-black/[0.06] mb-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-black/[0.05] flex items-center justify-center">
              <Building2 className="w-4 h-4 text-off-black" />
            </div>
            <div>
              <h3 className="text-[17px] font-regular tracking-tight text-off-black">
                Тариф Enterprise
              </h3>
              <p className="text-[14px] text-steel-gray font-book">
                Индивидуальные условия для компаний (ТЗ §11.14)
              </p>
            </div>
          </div>

          <Badge variant="neutral" className="text-[14px] py-0.5">
            Договорная цена
          </Badge>
        </div>

        {!isSubmitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-[14px] text-steel-gray font-book leading-relaxed">
              Оставьте заявку, и наш менеджер свяжется с вами для расчета индивидуального объема квот,
              выделения до 10 аккаунтов команды и подготовки договора.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[14px] font-regular text-steel-gray mb-1 block">
                  Ваше имя
                </label>
                <Input
                  required
                  placeholder="Иван Иванов"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-10 text-[14px]"
                />
              </div>

              <div>
                <label className="text-[14px] font-regular text-steel-gray mb-1 block">
                  Корпоративный email
                </label>
                <Input
                  required
                  type="email"
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-10 text-[14px]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="text-[14px] font-regular text-steel-gray mb-1 block">
                  Компания / Организация
                </label>
                <Input
                  required
                  placeholder="Acme Corp"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="h-10 text-[14px]"
                />
              </div>

              <div>
                <label className="text-[14px] font-regular text-steel-gray mb-1 block">
                  Ориентировочный объем (док/мес)
                </label>
                <Input
                  type="number"
                  placeholder="5000"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="h-10 text-[14px]"
                />
              </div>
            </div>

            <div>
              <label className="text-[14px] font-regular text-steel-gray mb-1 block">
                Дополнительные пожелания к интеграции
              </label>
              <textarea
                rows={3}
                placeholder="Особые требования к SLA, форматам или REST API…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full rounded-2xl border border-black/10 bg-pure-white p-3 text-[14px] font-book text-off-black placeholder:text-steel-gray/60 focus:outline-none focus:ring-1 focus:ring-signal-blue"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <Button
                type="submit"
                disabled={isSubmitting}
                variant="floating-cta"
                className="w-full h-11 bg-off-black text-pure-white hover:bg-off-black/90 text-[14px] flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-pure-white" />
                    <span>Отправка запроса…</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-pure-white" />
                    <span>Отправить заявку</span>
                  </>
                )}
              </Button>

              <a
                href={`mailto:support@doc-converter.com?subject=Enterprise%20Plan%20Inquiry%20from%20${encodeURIComponent(
                  company || 'Company'
                )}`}
                className="w-full sm:w-auto text-center"
              >
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full h-11 text-[14px] flex items-center justify-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-steel-gray" />
                  <span>Написать в email</span>
                </Button>
              </a>
            </div>
          </form>
        ) : (
          <div className="text-center py-6 space-y-3">
            <div className="mx-auto w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h4 className="text-[18px] font-regular tracking-tight text-off-black">
              Запрос успешно принят!
            </h4>
            <p className="text-[14px] text-steel-gray font-book max-w-sm mx-auto leading-relaxed">
              Спасибо за интерес к Enterprise. Наша команда свяжется с вами по адресу{' '}
              <strong className="text-off-black font-regular">{email}</strong> в течение 1 рабочего дня.
            </p>
            <div className="pt-3">
              <Button
                variant="floating-cta"
                onClick={() => onOpenChange(false)}
                className="px-6"
              >
                Закрыть
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

