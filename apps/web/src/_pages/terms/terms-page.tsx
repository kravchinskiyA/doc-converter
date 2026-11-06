'use client';

import * as React from 'react';
import {
  FileCheck2,
  Shield,
  CreditCard,
  Scale,
  RefreshCcw,
  Trash2,
  AlertTriangle,
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-[#f2f2f4] text-off-black">
      <div className="mx-auto max-w-[960px] px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-24 space-y-10">
        {/* Заголовок страницы */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="signal-chip">Юридическая информация</Badge>
            <Badge variant="neutral">Редакция от 01.11.2026</Badge>
            <Badge variant="muted">Публичная оферта</Badge>
          </div>

          <h1 className="text-[32px] sm:text-[42px] font-book tracking-tight text-off-black leading-[1.15]">
            Условия использования сервиса (Terms of Service)
          </h1>

          <p className="text-[15px] sm:text-[16px] text-steel-gray font-book leading-relaxed">
            Пожалуйста, внимательно ознакомьтесь с условиями предоставления услуг онлайн-конвертера doc-converter.
            Использование веб-сайта, API и связанных сервисов означает полное согласие с данными правилами.
          </p>
        </div>

        {/* Секция 1: Стороны соглашения и поставщик услуг */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <Scale className="w-5 h-5 text-signal-blue" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              1. Стороны и оператор сервиса
            </h2>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            1.1. Оператором и поставщиком услуг онлайн-сервиса doc-converter является физическое лицо-предприниматель
            (ФОП), зарегистрированное в соответствии с законодательством Украины (ТЗ §3.2, §11.15).
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            1.2. Пользователем сервиса признается любое физическое или юридическое лицо, осуществляющее доступ к сайту,
            использующее гостевой режим или зарегистрировавшее учетную запись.
          </p>
        </div>

        {/* Секция 2: Тарифы, оплата и валюта */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-signal-blue" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              2. Тарифные планы, цены и налоги (ТЗ §3.2, §11.1)
            </h2>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            2.1. Официальная расчетная валюта сервиса — <strong>EUR (€)</strong>. Оплата платных тарифов производится
            с помощью банковских карт через сертифицированный платежный шлюз Stripe.
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            2.2. Указанные на сайте тарифы (Базовый — €0; Pro — €5/мес или €51/год; Максимальный — €10/мес или €102/год)
            являются <strong>конечной стоимостью услуг, включая все применимые налоги</strong>. Никаких обязательных
            дополнительных сборов сверх указанной суммы не взимается.
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            2.3. Покупка подписки доступна исключительно пользователям с <strong>подтвержденным адресом электронной почты</strong> (ТЗ §11.1).
          </p>
        </div>

        {/* Секция 3: Подписка, автопродление и возврат средств */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <RefreshCcw className="w-5 h-5 text-emerald-600" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              3. Автопродление и гарантированный возврат (ТЗ §11.2, §11.3)
            </h2>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            3.1. <strong>Автопродление подписки выключено по умолчанию</strong> (ТЗ §11.1). Пользователь может самостоятельно
            включить или выключить автоматическое продление в Личном кабинете в любое время.
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            3.2. Пользователь вправе досрочно отменить платную подписку. В этом случае сервис автоматически производит
            расчет и <strong>возврат денежных средств за фактически неиспользованные календарные дни</strong> оплаченного периода
            на исходную банковскую карту через Stripe (ТЗ §11.2).
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            3.3. Сервис не устанавливает искусственных минимальных порогов возврата — возврат рассчитывается с точностью
            до €0,01.
          </p>
        </div>

        {/* Секция 4: Правила допустимого использования */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              4. Правила допустимого использования и безопасность (ТЗ §3.4, §3.6)
            </h2>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            4.1. Категорически запрещается загружать файлы, содержащие вредоносный код, эксплойты или вирусы.
            Все входящие файлы подвергаются обязательному антивирусному сканированию через ClamAV до допуска к обработке.
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            4.2. Для защиты инфраструктуры действуют технические пределы:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-[13.5px] text-steel-gray font-book pl-2">
            <li>Изображения: не более 40 мегапикселей и не более 12 000 px по стороне (защита от bomb-атак).</li>
            <li>Распаковка DOCX: не более 500 МБ распакованных данных и не более 10 000 внутренних файлов.</li>
            <li>Лимит оперативной памяти: до 2 ГБ на исходный файл.</li>
            <li>Максимальное время обработки: 10 минут на исходный файл (включая OCR).</li>
          </ul>
        </div>

        {/* Секция 5: Интеллектуальная собственность */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <FileCheck2 className="w-5 h-5 text-signal-blue" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              5. Интеллектуальная собственность и права на файлы
            </h2>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            5.1. Пользователь сохраняет <strong>100% авторских и имущественных прав</strong> на все загруженные исходные документы
            и полученные результаты конвертации. Сервис не претендует на какие-либо права на файлы пользователей.
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            5.2. Содержимое файлов <strong>никогда не используется</strong> для обучения алгоритмов машинного обучения,
            не передается третьим лицам и обрабатывается исключительно в рамках выполнения заявки на конвертацию.
          </p>
        </div>

        {/* Секция 6: Сроки хранения и удаление файлов */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <Trash2 className="w-5 h-5 text-off-black" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              6. Сроки хранения и удаление результатов (ТЗ §10.1, §10.4)
            </h2>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            6.1. Для подтвержденных аккаунтов результаты конвертации хранятся в защищенном хранилище S3 ровно{' '}
            <strong>6 календарных месяцев</strong> от момента готовности, после чего безвозвратно удаляются автоматическим планировщиком.
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            6.2. Для гостевых пользователей и неподтвержденных аккаунтов срок доступности составляет ровно{' '}
            <strong>12 часов</strong>.
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            6.3. Пользователь вправе удалить любые файлы или полностью очистить хранилище досрочно в Личном кабинете.
          </p>
        </div>

        {/* Секция 7: Контактная информация */}
        <div className="rounded-[32px] md:rounded-[40px] bg-off-black text-pure-white p-8 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-signal-blue" />
            <h3 className="text-[18px] font-regular tracking-tight">
              Вопросы по условиям сервиса
            </h3>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            По всем юридическим и финансовым вопросам обращайтесь в службу поддержки:
            <br />
            Электронная почта: <a href="mailto:support@doc-converter.com" className="text-pure-white underline hover:text-signal-blue">support@doc-converter.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
