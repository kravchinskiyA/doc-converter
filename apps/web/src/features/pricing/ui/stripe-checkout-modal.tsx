'use client';

import * as React from 'react';
import {
  CreditCard,
  Lock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Loader2,
  Info,
} from 'lucide-react';
import { cn } from '@/shared/lib/utils';
import { Dialog, DialogContent } from '@/shared/ui/dialog';
import { Button } from '@/shared/ui/button';
import { Badge } from '@/shared/ui/badge';
import { Input } from '@/shared/ui/input';
import { Link } from '@/shared/i18n';
import type { PricingBillingPeriod, SimulatedAuthStatus } from '../model/types';
import { TARIFF_PRICES_EUR } from '@doc-converter/contracts';

interface StripeCheckoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetPlan: 'pro' | 'max' | null;
  billingPeriod: PricingBillingPeriod;
  onSuccess?: () => void;
}

export function StripeCheckoutModal({
  open,
  onOpenChange,
  targetPlan,
  billingPeriod,
  onSuccess,
}: StripeCheckoutModalProps) {
  // Для тестирования и демонстрации переключатель статуса пользователя
  const [authStatus, setAuthStatus] = React.useState<SimulatedAuthStatus>('verified');
  const userEmail = 'user@example.com';

  // Состояние формы карты
  const [cardNumber, setCardNumber] = React.useState('');
  const [cardExpiry, setCardExpiry] = React.useState('');
  const [cardCvc, setCardCvc] = React.useState('');
  const [cardName, setCardName] = React.useState('ALEXANDER PETRENKO');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [transactionId, setTransactionId] = React.useState('');

  const handleClose = () => {
    setIsProcessing(false);
    setIsSuccess(false);
    setTransactionId('');
    onOpenChange(false);
  };

  if (!targetPlan) return null;

  const isAnnual = billingPeriod === 'annual';
  const planName = targetPlan === 'pro' ? 'Pro' : 'Максимальный';
  const priceData = TARIFF_PRICES_EUR[targetPlan];
  const totalAmount = isAnnual ? priceData.annual : priceData.monthly;
  const savings = isAnnual ? priceData.annualSavings : 0;

  // Форматирование номера карты
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
  };

  // Форматирование срока действия
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Автозаполнение тестовой картой Stripe
  const handleFillTestCard = () => {
    setCardNumber('4242 4242 4242 4242');
    setCardExpiry('12/28');
    setCardCvc('123');
    setCardName('ALEXANDER PETRENKO');
  };

  // Симуляция оплаты через Stripe
  const handlePay = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Эмуляция защищенного запроса к Stripe API
    await new Promise((resolve) => setTimeout(resolve, 1400));

    setIsProcessing(false);
    setIsSuccess(true);
    setTransactionId(`pi_3M${Math.random().toString(36).substring(2, 10).toUpperCase()}_secret`);
    onSuccess?.();
  };

  return (
    <Dialog open={open} onOpenChange={(val) => { if (!val) handleClose(); else onOpenChange(true); }}>
      <DialogContent
        onClose={handleClose}
        className="max-w-[560px] p-6 md:p-8 rounded-[36px]"
      >
        {/* Заголовок модального окна */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-black/[0.06] mb-5">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-signal-blue/10 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-signal-blue" />
            </div>
            <div>
              <h3 className="text-[17px] font-regular tracking-tight text-off-black">
                Оплата через Stripe
              </h3>
              <p className="text-[14px] text-steel-gray font-book">
                Безопасный 256-битный платежный шлюз
              </p>
            </div>
          </div>

          <Badge variant="signal-chip" className="text-[14px] py-0.5">
            Stripe Checkout
          </Badge>
        </div>

        {/* Тестовый переключатель статуса авторизации (для валидации ТЗ §11.1) */}
        <div className="mb-5 p-3 rounded-2xl bg-[#f2f2f4]/70 border border-black/5 text-[14px]">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-regular text-steel-gray">Режим симуляции статуса:</span>
            <span className="text-[14px] text-steel-gray">ТЗ §11.1 проверка email</span>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setAuthStatus('verified')}
              className={cn(
                'px-2.5 py-1 rounded-pill text-[14px] font-regular transition-colors',
                authStatus === 'verified'
                  ? 'bg-signal-blue text-pure-white'
                  : 'bg-pure-white text-steel-gray hover:text-off-black'
              )}
            >
              Подтвержденный email
            </button>
            <button
              type="button"
              onClick={() => setAuthStatus('unverified')}
              className={cn(
                'px-2.5 py-1 rounded-pill text-[14px] font-regular transition-colors',
                authStatus === 'unverified'
                  ? 'bg-amber-500 text-pure-white'
                  : 'bg-pure-white text-steel-gray hover:text-off-black'
              )}
            >
              Неподтвержденный
            </button>
            <button
              type="button"
              onClick={() => setAuthStatus('guest')}
              className={cn(
                'px-2.5 py-1 rounded-pill text-[14px] font-regular transition-colors',
                authStatus === 'guest'
                  ? 'bg-off-black text-pure-white'
                  : 'bg-pure-white text-steel-gray hover:text-off-black'
              )}
            >
              Гость
            </button>
          </div>
        </div>

        {/* Сценарий А: Гость (неавторизован) */}
        {authStatus === 'guest' && (
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.05] p-4 text-off-black">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[14px] font-regular text-amber-900">
                    Требуется авторизация
                  </h4>
                  <p className="text-[14px] text-amber-800/90 font-book leading-relaxed">
                    По правилам сервиса (ТЗ §11.1) оформление платной подписки привязывается к постоянному
                    аккаунту. Войдите или создайте аккаунт, чтобы перейти к оплате тарифа {planName}.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link href="/auth/login" className="flex-1">
                <Button variant="floating-cta" className="w-full">
                  Войти в аккаунт
                </Button>
              </Link>
              <Link href="/auth/register" className="flex-1">
                <Button
                  variant="floating-cta"
                  className="w-full bg-signal-blue text-pure-white hover:bg-signal-blue/90"
                >
                  Зарегистрироваться
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Сценарий Б: Неподтвержденный email */}
        {authStatus === 'unverified' && (
          <div className="space-y-4 py-2">
            <div className="rounded-2xl border border-red-500/30 bg-red-500/[0.05] p-4 text-off-black">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-[14px] font-regular text-red-900">
                    Оплата доступна только для подтвержденных email
                  </h4>
                  <p className="text-[14px] text-red-800/90 font-book leading-relaxed">
                    Адрес <strong className="font-regular">{userEmail}</strong> еще не подтвержден.
                    Согласно разделу ТЗ §11.1, в целях безопасности покупка тарифа разрешена только после
                    ввода 6-значного проверочного кода из почты.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Link href="/auth/verify-email" className="flex-1">
                <Button
                  variant="floating-cta"
                  className="w-full bg-signal-blue text-pure-white hover:bg-signal-blue/90"
                >
                  Подтвердить email
                </Button>
              </Link>
              <Button
                variant="secondary"
                onClick={() => setAuthStatus('verified')}
                className="text-[14px]"
              >
                Я уже подтвердил
              </Button>
            </div>
          </div>
        )}

        {/* Сценарий В: Подтвержденный email (Шлюз оплаты) */}
        {authStatus === 'verified' && !isSuccess && (
          <form onSubmit={handlePay} className="space-y-5">
            {/* Карточка заказа */}
            <div className="rounded-2xl border border-black/10 bg-[#fdfdfd] p-4">
              <div className="flex items-center justify-between text-[14px] mb-2">
                <span className="font-regular text-off-black">
                  Тариф {planName} ({isAnnual ? '12 месяцев' : '1 месяц'})
                </span>
                <span className="font-regular text-[16px] text-off-black">
                  €{totalAmount}
                </span>
              </div>

              {isAnnual && (
                <div className="flex items-center justify-between text-[14px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-pill mb-2">
                  <span>Скидка 15% при оплате за год</span>
                  <span>-€{savings}</span>
                </div>
              )}

              <div className="flex items-center justify-between text-[14px] text-steel-gray pt-2 border-t border-black/[0.05]">
                <span>Применимые налоги (НДС)</span>
                <span>Включены в стоимость</span>
              </div>
              <div className="flex items-center justify-between text-[14px] text-steel-gray mt-1">
                <span>Продавец</span>
                <span>ФОП, Украина (ТЗ §3.2)</span>
              </div>
            </div>

            {/* Поля карты Stripe */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-[14px] font-regular text-off-black flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-signal-blue" />
                  Данные карты
                </label>
                <button
                  type="button"
                  onClick={handleFillTestCard}
                  className="text-[14px] text-signal-blue hover:underline font-book"
                >
                  Заполнить тестовой картой Stripe
                </button>
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="4242 4242 4242 4242"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  required
                  className="h-11 font-mono text-[14px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Input
                  type="text"
                  placeholder="ММ/ГГ"
                  value={cardExpiry}
                  onChange={handleExpiryChange}
                  required
                  className="h-11 font-mono text-[14px]"
                />
                <Input
                  type="text"
                  placeholder="CVC / CVC2"
                  maxLength={4}
                  value={cardCvc}
                  onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                  required
                  className="h-11 font-mono text-[14px]"
                />
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Имя на карте (латиницей)"
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value.toUpperCase())}
                  required
                  className="h-11 text-[14px]"
                />
              </div>
            </div>

            {/* Подсказка об автопродлении */}
            <div className="flex items-start gap-2 text-[14px] text-steel-gray font-book bg-[#f2f2f4]/60 p-3 rounded-2xl">
              <Info className="w-4 h-4 text-steel-gray shrink-0 mt-0.5" />
              <span>
                Автопродление выключено по умолчанию (ТЗ §11.1). Вы сможете включить его в любое время
                в Личном кабинете. При досрочной отмене возврат рассчитывается за неиспользованные дни.
              </span>
            </div>

            {/* Кнопка отправки */}
            <Button
              type="submit"
              disabled={isProcessing}
              variant="floating-cta"
              className="w-full h-12 bg-signal-blue text-pure-white hover:bg-signal-blue/90 text-[14px] font-regular flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-pure-white" />
                  <span>Обработка платежа в Stripe…</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-pure-white" />
                  <span>Оплатить €{totalAmount}</span>
                </>
              )}
            </Button>

            {/* Нижние индикаторы безопасности */}
            <div className="flex items-center justify-center gap-4 text-[14px] text-steel-gray font-book pt-1">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                PCI-DSS Level 1
              </span>
              <span>•</span>
              <span>256-bit SSL</span>
              <span>•</span>
              <span>Данные строго в ЕС</span>
            </div>
          </form>
        )}

        {/* Экран успеха оплаты */}
        {isSuccess && (
          <div className="text-center py-4 space-y-4">
            <div className="mx-auto w-14 h-14 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div>
              <h4 className="text-[20px] font-regular tracking-tight text-off-black">
                Подписка успешно активирована!
              </h4>
              <p className="text-[14px] text-steel-gray font-book mt-1">
                Тариф <strong className="font-regular text-off-black">{planName}</strong> активирован
                на вашем аккаунте. Квитанция об оплате отправлена на {userEmail}.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#f2f2f4]/70 border border-black/5 text-[14px] text-steel-gray font-mono text-left">
              <div>ID транзакции: {transactionId}</div>
              <div>Сумма: €{totalAmount} (налоги включены)</div>
              <div>Статус: Succeeded • Stripe</div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <Link href="/account" className="w-full">
                <Button variant="floating-cta" className="w-full text-[14px]">
                  Личный кабинет
                </Button>
              </Link>
              <Link href="/convert/pdf-to-docx" className="w-full">
                <Button
                  variant="floating-cta"
                  className="w-full bg-signal-blue text-pure-white hover:bg-signal-blue/90 text-[14px] flex items-center justify-center gap-1.5"
                >
                  <span>Начать конвертацию</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
