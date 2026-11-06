'use client';

import * as React from 'react';
import {
  ShieldCheck,
  Server,
  Lock,
  UserCheck,
  EyeOff,
  FileKey,
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f2f2f4] text-off-black">
      <div className="mx-auto max-w-[960px] px-4 sm:px-6 lg:px-8 pt-28 md:pt-36 pb-24 space-y-10">
        {/* Заголовок страницы */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="signal-chip">GDPR Compliance</Badge>
            <Badge variant="neutral">Регламент (ЕС) 2016/679</Badge>
            <Badge variant="muted">ISO/IEC 27001</Badge>
          </div>

          <h1 className="text-[32px] sm:text-[42px] font-book tracking-tight text-off-black leading-[1.15]">
            Политика конфиденциальности (GDPR)
          </h1>

          <p className="text-[15px] sm:text-[16px] text-steel-gray font-book leading-relaxed">
            Защита персональных данных и документов пользователей — наш фундаментальный приоритет.
            Данный документ описывает принципы обработки, юрисдикцию серверов, протоколы шифрования
            и ваши права как субъекта персональных данных в соответствии с регламентом GDPR.
          </p>
        </div>

        {/* 1. Инвариант локализации и юрисдикция серверов */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-signal-blue" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              1. Обработка данных строго в Европейском Союзе (ЕС)
            </h2>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            1.1. Вся инфраструктура doc-converter расположена <strong>исключительно в пределах региона ЕС</strong> (Франкфурт, Германия и Париж, Франция).
            Это включает серверы приложений NestJS/Next.js, базы данных PostgreSQL, очереди BullMQ (Redis),
            объектное хранилище S3, узлы конвертации и антивирус ClamAV.
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            1.2. Трансграничная передача пользовательских документов за пределы Европейской экономической зоны (ЕЭЗ)
            категорически исключена.
          </p>
        </div>

        {/* 2. Полный отказ от сторонних AI и OCR API */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <EyeOff className="w-5 h-5 text-emerald-600" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              2. Принцип нулевой передачи третьим лицам (No Third-Party APIs)
            </h2>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            2.1. Мы <strong>ни при каких обстоятельствах не передаем файлы пользователей</strong> внешним сервисам,
            провайдерам нейросетей или сторонним OCR API (таким как OpenAI ChatGPT, Google Cloud Vision или AWS Textract).
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            2.2. Весь цикл обработки, оптического распознавания текста (PaddleOCR) и конвертации (LibreOffice, Sharp, PDFium)
            производится на собственных изолированных серверах компании в закрытом сетевом контуре.
          </p>
        </div>

        {/* 3. Шифрование и безопасность данных */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-signal-blue" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              3. Стандарты шифрования и криптографической защиты
            </h2>
          </div>
          <ul className="space-y-2.5 text-[14px] text-steel-gray font-book">
            <li className="flex items-start gap-2">
              <span className="font-regular text-off-black shrink-0">• S3 SSE-KMS:</span>
              <span>Все сохраняемые документы шифруются надежным алгоритмом AES-256 с выделенным ключом AWS KMS в регионе ЕС.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-regular text-off-black shrink-0">• TLS 1.3:</span>
              <span>Все соединения между браузером, API и внутренними сервисами защищены современным протоколом TLS 1.3.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-regular text-off-black shrink-0">• scrypt & AES-256-GCM:</span>
              <span>Пароли и резервные коды восстановления хэшируются с использованием scrypt. Пользовательские API-ключи защищены симметричным шифрованием AES-256-GCM с ротацией.</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="font-regular text-off-black shrink-0">• Защита логов:</span>
              <span>В системные журналы категорически запрещено заносить персональные данные (PII), пароли, содержимое файлов или токены.</span>
            </li>
          </ul>
        </div>

        {/* 4. Контролируемый служебный доступ техподдержки */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <FileKey className="w-5 h-5 text-off-black" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              4. Политика служебного доступа сотрудников (ТЗ §12.17)
            </h2>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            4.1. Инженеры и сотрудники технической поддержки сервиса <strong>не имеют прямого доступа</strong> к содержимому
            сохраненных документов пользователей.
          </p>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            4.2. В случае диагностирования ошибок конвертации просмотр конкретного файла возможен <strong>только при явном согласии
            пользователя</strong> путем подтверждения 6-значным проверочным кодом, отправленным на email. Разрешение выдается
            строго на 24 часа и может быть в любой момент отозвано пользователем в Личном кабинете.
          </p>
        </div>

        {/* 5. Права субъекта данных по GDPR */}
        <div className="rounded-[32px] md:rounded-[40px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2.5">
            <UserCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="text-[20px] font-regular tracking-tight text-off-black">
              5. Права субъекта данных (GDPR ст. 15–22)
            </h2>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            Вы обладаете следующими неотъемлемыми правами в отношении ваших персональных данных:
          </p>
          <ul className="list-disc list-inside space-y-2 text-[13.5px] text-steel-gray font-book pl-2">
            <li><strong>Право на доступ (ст. 15):</strong> просмотр всех хранящихся данных и истории файлов в Личном кабинете.</li>
            <li><strong>Право на переносимость данных (ст. 20):</strong> скачивание всех результатов в едином ZIP-архиве.</li>
            <li><strong>Право на исправление (ст. 16):</strong> изменение имени, пароля и двухэтапная смена email.</li>
            <li><strong>Право на удаление («Право на забвение», ст. 17):</strong> полное и мгновенное удаление профиля и всех файлов через раздел «Удаление аккаунта» с подтверждением через email-код (ТЗ §6.4).</li>
          </ul>
        </div>

        {/* 6. Удаление аккаунта и контакты */}
        <div className="rounded-[32px] md:rounded-[40px] bg-off-black text-pure-white p-8 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-signal-blue" />
            <h3 className="text-[18px] font-regular tracking-tight">
              Связь с сотрудником по защите данных (DPO)
            </h3>
          </div>
          <p className="text-[14px] text-steel-gray font-book leading-relaxed">
            Если у вас возникли вопросы касательно соблюдения регламента GDPR или реализации ваших прав,
            вы можете напрямую связаться с ответственным лицом по защите персональных данных:
            <br />
            Email для запросов по приватности: <a href="mailto:privacy@doc-converter.com" className="text-pure-white underline hover:text-signal-blue">privacy@doc-converter.com</a>
          </p>
        </div>
      </div>
    </div>
  );
}
