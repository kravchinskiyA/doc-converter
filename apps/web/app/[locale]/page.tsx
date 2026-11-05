import { Badge } from '@/shared/ui';
import { ShieldCheck, Zap, Lock } from 'lucide-react';
import { QuickConverter } from '@/features/quick-converter';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-[90px] py-4">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center">
        <Badge variant="signal-chip" className="mb-6">
          Augen Pro • 100% EU Data Jurisdiction
        </Badge>
        <h1 className="text-[32px] md:text-[44px] font-book tracking-tight text-off-black max-w-[800px] leading-[1.15] mb-4">
          Приватная конвертация документов и изображений
        </h1>
        <p className="text-[16px] md:text-[18px] font-book tracking-tight text-steel-gray max-w-[620px] mb-10">
          Точный OCR печатного текста, экспорт DOCX в PDF и обработка изображений на собственных изолированных серверах в ЕС.
        </p>

        {/* Главная интерактивная карточка — Блок Drag-and-Drop «Документы» */}
        <QuickConverter locale={locale} />
      </section>

      {/* Преимущества — 3 колонки без теней */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-[24px] border-[0.5px] border-black/[0.06] bg-pure-white p-7 space-y-3">
          <div className="h-9 w-9 rounded-full bg-signal-blue/5 flex items-center justify-center text-signal-blue">
            <ShieldCheck className="h-5 w-5 stroke-[1.5]" />
          </div>
          <h3 className="text-[18px] font-book text-off-black tracking-tight">100% изоляция в ЕС</h3>
          <p className="text-[14px] font-book text-steel-gray leading-relaxed">
            Файлы никогда не передаются сторонним AI-сервисам. Вся обработка выполняется на собственных мощностях в дата-центрах ЕС.
          </p>
        </div>

        <div className="rounded-[24px] border-[0.5px] border-black/[0.06] bg-pure-white p-7 space-y-3">
          <div className="h-9 w-9 rounded-full bg-signal-blue/5 flex items-center justify-center text-signal-blue">
            <Zap className="h-5 w-5 stroke-[1.5]" />
          </div>
          <h3 className="text-[18px] font-book text-off-black tracking-tight">Точность OCR до 98%</h3>
          <p className="text-[14px] font-book text-steel-gray leading-relaxed">
            Модели PaddleOCR обеспечивают CER не более 2% на четких сканах, с сохранением структуры таблиц, списков и абзацев.
          </p>
        </div>

        <div className="rounded-[24px] border-[0.5px] border-black/[0.06] bg-pure-white p-7 space-y-3">
          <div className="h-9 w-9 rounded-full bg-signal-blue/5 flex items-center justify-center text-signal-blue">
            <Lock className="h-5 w-5 stroke-[1.5]" />
          </div>
          <h3 className="text-[18px] font-book text-off-black tracking-tight">Автоочистка через 12ч</h3>
          <p className="text-[14px] font-book text-steel-gray leading-relaxed">
            Файлы гостевых сессий гарантированно удаляются через 12 часов после готовности. Результаты шифруются ключами SSE-KMS.
          </p>
        </div>
      </section>
    </div>
  );
}
