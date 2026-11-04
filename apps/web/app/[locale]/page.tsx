import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Badge } from '@/shared/ui';
import { ArrowRight, FileUp, ShieldCheck, Zap, Lock } from 'lucide-react';

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <div className="space-y-[90px] py-4">
      {/* Hero Section с карточкой 54px */}
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

        {/* Главная карточка 54px — Блок "Документы" */}
        <Card className="w-full max-w-[860px] text-left">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>Конвертер документов</CardTitle>
                <CardDescription>
                  Перетащите PDF или DOCX файл сюда либо выберите вручную
                </CardDescription>
              </div>
              <Badge variant="neutral">Гость: 3 попытки</Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Drag and Drop область */}
            <div className="border border-dashed border-black/15 hover:border-signal-blue/50 rounded-[24px] p-8 md:p-14 text-center transition-colors flex flex-col items-center justify-center cursor-pointer bg-black/[0.01]">
              <div className="h-12 w-12 rounded-full bg-signal-blue/5 flex items-center justify-center text-signal-blue mb-4">
                <FileUp className="h-6 w-6 stroke-[1.5]" />
              </div>
              <p className="text-[15px] font-book text-off-black mb-1">
                Перетащите файлы сюда или нажмите для выбора
              </p>
              <p className="text-[13px] font-book text-ash-gray">
                Поддерживаются PDF и DOCX до 25 МБ
              </p>
            </div>

            {/* Кнопка ручного выбора файлов */}
            <div className="mt-6 flex justify-end">
              <Button variant="floating-cta">
                Выбрать файлы
                <ArrowRight className="h-3.5 w-3.5 text-signal-blue" />
              </Button>
            </div>

            {/* Быстрые чипы направлений */}
            <div className="mt-8 flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-book text-steel-gray mr-2">Популярные направления:</span>
              <a href={`/${locale}/convert/pdf-to-docx`}>
                <Badge variant="signal-chip" className="hover:bg-signal-blue/5 cursor-pointer">
                  PDF → DOCX (OCR)
                </Badge>
              </a>
              <a href={`/${locale}/convert/docx-to-pdf`}>
                <Badge variant="neutral" className="hover:border-black/20 cursor-pointer">
                  DOCX → PDF
                </Badge>
              </a>
              <a href={`/${locale}/convert/images-to-pdf`}>
                <Badge variant="neutral" className="hover:border-black/20 cursor-pointer">
                  Изображения → PDF
                </Badge>
              </a>
            </div>
          </CardContent>
        </Card>
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
