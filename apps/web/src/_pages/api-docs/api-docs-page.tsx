'use client';

import * as React from 'react';
import {
  Code2,
  Key,
  Clock,
  ShieldCheck,
  Check,
  Copy,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { Badge } from '@/shared/ui/badge';
import { Button } from '@/shared/ui/button';
import { Link } from '@/shared/i18n';
import { cn } from '@/shared/lib/utils';

type LanguageTab = 'curl' | 'javascript' | 'python';

export function ApiDocsPage() {
  const [activeLang, setActiveLang] = React.useState<LanguageTab>('curl');
  const [copiedCodeId, setCopiedCodeId] = React.useState<string | null>(null);

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  const codeSnippets: Record<LanguageTab, { title: string; code: string }> = {
    curl: {
      title: 'cURL',
      code: `# 1. Отправка файла на конвертацию (PDF -> DOCX)
curl -X POST https://doc-converter.com/api/v1/jobs \\
  -H "X-API-Key: dc_live_xxxxxxxxxxxxxxxxxxxxxxxx" \\
  -F "direction=pdf-to-docx" \\
  -F "files=@/path/to/document.pdf"

# Ответ сервера: 202 Accepted
# {
#   "jobId": "job_98a7bc12e4f0",
#   "status": "queued",
#   "files": [{ "id": "file_01", "name": "document.pdf", "status": "queued" }],
#   "pollIntervalSeconds": 5
# }

# 2. Опрос статуса задания (не чаще раза в 5 сек)
curl -X GET https://doc-converter.com/api/v1/jobs/job_98a7bc12e4f0 \\
  -H "X-API-Key: dc_live_xxxxxxxxxxxxxxxxxxxxxxxx"

# 3. Скачивание готового ZIP-архива
curl -X GET https://doc-converter.com/api/v1/jobs/job_98a7bc12e4f0/zip \\
  -H "X-API-Key: dc_live_xxxxxxxxxxxxxxxxxxxxxxxx" \\
  --output result.zip`,
    },
    javascript: {
      title: 'JavaScript / Node.js',
      code: `import fs from 'node:fs';

const API_KEY = 'dc_live_xxxxxxxxxxxxxxxxxxxxxxxx';
const BASE_URL = 'https://doc-converter.com/api/v1';

// 1. Создание задания конвертации
const formData = new FormData();
formData.append('direction', 'pdf-to-docx');
const fileBlob = new Blob([fs.readFileSync('document.pdf')], { type: 'application/pdf' });
formData.append('files', fileBlob, 'document.pdf');

const createRes = await fetch(\`\${BASE_URL}/jobs\`, {
  method: 'POST',
  headers: { 'X-API-Key': API_KEY },
  body: formData,
});

if (createRes.status === 202) {
  const { jobId } = await createRes.json();
  console.log('Задание поставлено в очередь:', jobId);

  // 2. Опрос состояния каждые 5 секунд (ТЗ §3.8)
  const pollStatus = async () => {
    const statusRes = await fetch(\`\${BASE_URL}/jobs/\${jobId}\`, {
      headers: { 'X-API-Key': API_KEY },
    });
    const job = await statusRes.json();
    
    if (job.status === 'completed') {
      console.log('Конвертация завершена! Скачиваем ZIP…');
      const zipRes = await fetch(\`\${BASE_URL}/jobs/\${jobId}/zip\`, {
        headers: { 'X-API-Key': API_KEY },
      });
      const buffer = await zipRes.arrayBuffer();
      fs.writeFileSync('result.zip', Buffer.from(buffer));
    } else {
      setTimeout(pollStatus, 5000);
    }
  };

  pollStatus();
}`,
    },
    python: {
      title: 'Python (requests)',
      code: `import time
import requests

API_KEY = "dc_live_xxxxxxxxxxxxxxxxxxxxxxxx"
BASE_URL = "https://doc-converter.com/api/v1"
HEADERS = {"X-API-Key": API_KEY}

# 1. Отправка файла на конвертацию
with open("document.pdf", "rb") as f:
    files = {"files": ("document.pdf", f, "application/pdf")}
    data = {"direction": "pdf-to-docx"}
    res = requests.post(f"{BASE_URL}/jobs", headers=HEADERS, data=data, files=files)

if res.status_code == 202:
    job = res.json()
    job_id = job["jobId"]
    print(f"Задание принято: {job_id}")

    # 2. Опрос состояния задания
    while True:
        status_res = requests.get(f"{BASE_URL}/jobs/{job_id}", headers=HEADERS)
        job_info = status_res.json()
        
        if job_info["status"] == "completed":
            print("Готово! Скачиваем результат...")
            zip_res = requests.get(f"{BASE_URL}/jobs/{job_id}/zip", headers=HEADERS)
            with open("result.zip", "wb") as out:
                out.write(zip_res.content)
            break
        elif job_info["status"] == "failed":
            print("Ошибка обработки:", job_info.get("error"))
            break
            
        time.sleep(5)  # Интервал проверки не чаще 5 сек (ТЗ §3.8)`,
    },
  };

  return (
    <div className="min-h-screen bg-[#f2f2f4] text-off-black">
      <div className="px-4 sm:px-6 lg:px-8 pb-24 space-y-12">
        {/* Заголовок страницы */}
        <div className="space-y-4 max-w-3xl">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="signal-chip">REST API v1</Badge>
            <Badge variant="neutral">OpenAPI 3.1</Badge>
            <Badge variant="muted">ЕС Юрисдикция</Badge>
          </div>

          <h1 className="text-[32px] sm:text-[42px] font-book tracking-tight text-off-black leading-[1.15]">
            Документация программного REST API
          </h1>

          <p className="text-[15px] sm:text-[16px] text-steel-gray font-book leading-relaxed">
            Полнофункциональный программный интерфейс для интеграции конвертации документов и изображений
            в ваши скрипты, бэкенды и Telegram-боты. Асинхронная обработка через очередь BullMQ.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link href="/account">
              <Button variant="floating-cta" className="h-10 text-[13px] flex items-center gap-1.5">
                <Key className="w-4 h-4 text-signal-blue" />
                <span>Получить API-ключ в кабинете</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-60" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="secondary" className="h-10 text-[13px]">
                Лимиты тарифов API
              </Button>
            </Link>
          </div>
        </div>

        {/* Информационные плашки: Авторизация и Лимиты */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-[32px] border-[0.5px] border-black/10 bg-pure-white p-6 space-y-2">
            <div className="flex items-center gap-2 text-off-black font-regular text-[15px]">
              <Key className="w-4 h-4 text-signal-blue" />
              <span>Авторизация (ТЗ §7)</span>
            </div>
            <p className="text-[13px] text-steel-gray font-book leading-relaxed">
              Заголовок <code className="text-signal-blue font-mono text-[12px] bg-signal-blue/5 px-1.5 py-0.5 rounded">X-API-Key</code>.
              Ключ генерируется вручную в кабинете. Передача в URL строго запрещена.
            </p>
          </div>

          <div className="rounded-[32px] border-[0.5px] border-black/10 bg-pure-white p-6 space-y-2">
            <div className="flex items-center gap-2 text-off-black font-regular text-[15px]">
              <Clock className="w-4 h-4 text-emerald-600" />
              <span>Частота запросов (ТЗ §3.8)</span>
            </div>
            <p className="text-[13px] text-steel-gray font-book leading-relaxed">
              Создание — 10/мин, проверка статуса — 120/мин суммарно (не чаще раза в 5 секунд на задание),
              скачивание результатов — 10/мин.
            </p>
          </div>

          <div className="rounded-[32px] border-[0.5px] border-black/10 bg-pure-white p-6 space-y-2">
            <div className="flex items-center gap-2 text-off-black font-regular text-[15px]">
              <ShieldCheck className="w-4 h-4 text-off-black" />
              <span>Статус 202 Accepted (ТЗ §9.1)</span>
            </div>
            <p className="text-[13px] text-steel-gray font-book leading-relaxed">
              Все конвертации асинхронны. Запрос возвращает <code className="font-mono text-[12px]">202 Accepted</code> и ID задания.
              Результаты сохраняются в кабинете на 6 месяцев.
            </p>
          </div>
        </div>

        {/* Блок с примерами кода */}
        <div className="rounded-[36px] md:rounded-[44px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-black/[0.06]">
            <div>
              <h3 className="text-[20px] font-regular tracking-tight text-off-black flex items-center gap-2">
                <Code2 className="w-5 h-5 text-signal-blue" />
                Быстрый старт: отправка и скачивание
              </h3>
              <p className="text-[13px] text-steel-gray font-book mt-0.5">
                Выберите ваш стек технологий для просмотра готового примера интеграции.
              </p>
            </div>

            {/* Табы выбора языка */}
            <div className="inline-flex rounded-nav border-[0.5px] border-black/10 bg-[#f2f2f4] p-1">
              {(['curl', 'javascript', 'python'] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setActiveLang(lang)}
                  className={cn(
                    'px-4 py-1.5 rounded-pill text-[13px] font-regular tracking-tight transition-all',
                    activeLang === lang
                      ? 'bg-pure-white text-off-black shadow-none'
                      : 'text-steel-gray hover:text-off-black'
                  )}
                >
                  {codeSnippets[lang].title}
                </button>
              ))}
            </div>
          </div>

          {/* Окно кода */}
          <div className="relative rounded-[24px] bg-[#0f1012] p-5 text-pure-white font-mono text-[13px] leading-relaxed overflow-x-auto">
            <button
              type="button"
              onClick={() => copyToClipboard('quickstart', codeSnippets[activeLang].code)}
              className="absolute top-4 right-4 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Скопировать код"
            >
              {copiedCodeId === 'quickstart' ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
            <pre className="pr-12">{codeSnippets[activeLang].code}</pre>
          </div>
        </div>

        {/* Спецификация эндпоинтов */}
        <div className="space-y-6">
          <div>
            <h2 className="text-[24px] md:text-[28px] font-book tracking-tight text-off-black">
              Эндпоинты API
            </h2>
            <p className="text-[14px] text-steel-gray font-book mt-1">
              Базовый URL всех запросов: <code className="font-mono text-off-black bg-black/5 px-2 py-0.5 rounded">https://doc-converter.com/api/v1</code>
            </p>
          </div>

          {/* 1. POST /jobs */}
          <div className="rounded-[32px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[13px] font-regular px-2.5 py-1 rounded-pill bg-emerald-500/10 text-emerald-700 border-[0.5px] border-emerald-500/20">
                  POST
                </span>
                <code className="font-mono text-[15px] font-regular text-off-black">/jobs</code>
              </div>
              <Badge variant="signal-chip" className="text-[11px]">
                Возвращает 202 Accepted
              </Badge>
            </div>

            <p className="text-[14px] text-steel-gray font-book">
              Создание новой задачи конвертации пакета файлов. Тело запроса передается как <code className="font-mono text-[12px]">multipart/form-data</code>.
            </p>

            <div className="space-y-3 pt-2">
              <h4 className="text-[13px] font-regular text-off-black uppercase tracking-wider">
                Параметры формы (multipart/form-data):
              </h4>
              <ul className="space-y-2 text-[13px] text-off-black font-book divide-y divide-black/[0.04]">
                <li className="pt-2 flex flex-col sm:flex-row sm:items-baseline gap-2">
                  <code className="font-mono text-signal-blue font-regular w-36 shrink-0">direction</code>
                  <span className="text-steel-gray">Обязательное. Одно из: <code className="font-mono text-off-black">pdf-to-docx</code>, <code className="font-mono text-off-black">docx-to-pdf</code>, <code className="font-mono text-off-black">images-to-pdf</code>, <code className="font-mono text-off-black">pdf-to-images</code>.</span>
                </li>
                <li className="pt-2 flex flex-col sm:flex-row sm:items-baseline gap-2">
                  <code className="font-mono text-signal-blue font-regular w-36 shrink-0">files</code>
                  <span className="text-steel-gray">Обязательное. 1 файл для базового тарифа, до 5 файлов для платных тарифов Pro и Максимальный (ТЗ §3.3).</span>
                </li>
                <li className="pt-2 flex flex-col sm:flex-row sm:items-baseline gap-2">
                  <code className="font-mono text-signal-blue font-regular w-36 shrink-0">mergeToPdf</code>
                  <span className="text-steel-gray">Опционально (boolean). Применяется для <code className="font-mono text-off-black">images-to-pdf</code> (объединение в единый A4 PDF с полями 10 мм).</span>
                </li>
                <li className="pt-2 flex flex-col sm:flex-row sm:items-baseline gap-2">
                  <code className="font-mono text-signal-blue font-regular w-36 shrink-0">dpi / quality</code>
                  <span className="text-steel-gray">Опционально. Для растрирования PDF: <code className="font-mono text-off-black">dpi</code> (72, 150, 300), <code className="font-mono text-off-black">quality</code> (1–100, по умолчанию 85).</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 2. GET /jobs/:jobId */}
          <div className="rounded-[32px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[13px] font-regular px-2.5 py-1 rounded-pill bg-signal-blue/10 text-signal-blue border-[0.5px] border-signal-blue/20">
                  GET
                </span>
                <code className="font-mono text-[15px] font-regular text-off-black">/jobs/:jobId</code>
              </div>
              <Badge variant="neutral" className="text-[11px]">
                Опрос не чаще 1 раз в 5 сек
              </Badge>
            </div>

            <p className="text-[14px] text-steel-gray font-book">
              Получение текущего статуса задания и списка готовых файлов с ссылками на скачивание.
            </p>

            <div className="rounded-2xl bg-[#0f1012] p-4 text-pure-white font-mono text-[12px] overflow-x-auto">
              <pre>{`{
  "jobId": "job_98a7bc12e4f0",
  "status": "completed", // "queued" | "processing" | "completed" | "failed"
  "createdAt": "2026-11-06T15:00:00.000Z",
  "files": [
    {
      "id": "file_res_01",
      "originalName": "invoice.pdf",
      "resultName": "invoice.docx",
      "status": "completed",
      "sizeBytes": 1420500,
      "downloadUrl": "/api/v1/jobs/job_98a7bc12e4f0/download/file_res_01"
    }
  ],
  "zipDownloadUrl": "/api/v1/jobs/job_98a7bc12e4f0/zip"
}`}</pre>
            </div>
          </div>

          {/* 3. GET /jobs/:jobId/zip */}
          <div className="rounded-[32px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[13px] font-regular px-2.5 py-1 rounded-pill bg-signal-blue/10 text-signal-blue border-[0.5px] border-signal-blue/20">
                  GET
                </span>
                <code className="font-mono text-[15px] font-regular text-off-black">/jobs/:jobId/zip</code>
              </div>
              <Badge variant="muted" className="text-[11px]">
                application/zip
              </Badge>
            </div>

            <p className="text-[14px] text-steel-gray font-book">
              Потоковое скачивание единого ZIP-архива всех успешно сконвертированных файлов задания (ТЗ §10.2).
            </p>
          </div>

          {/* 4. GET /account/quota */}
          <div className="rounded-[32px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-black/[0.06]">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[13px] font-regular px-2.5 py-1 rounded-pill bg-signal-blue/10 text-signal-blue border-[0.5px] border-signal-blue/20">
                  GET
                </span>
                <code className="font-mono text-[15px] font-regular text-off-black">/account/quota</code>
              </div>
              <Badge variant="neutral" className="text-[11px]">
                Информация о лимитах
              </Badge>
            </div>

            <p className="text-[14px] text-steel-gray font-book">
              Получение текущих остатков квот (документы, изображения), таймеров восстановления и заполненности хранилища.
            </p>
          </div>
        </div>

        {/* Коды ответов и ошибок */}
        <div className="rounded-[36px] md:rounded-[44px] border-[0.5px] border-black/10 bg-pure-white p-6 md:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-signal-blue" />
            <h3 className="text-[20px] font-regular tracking-tight text-off-black">
              Коды состояний и обработка ошибок (ТЗ §9.4)
            </h3>
          </div>

          <p className="text-[14px] text-steel-gray font-book">
            Ошибки возвращаются в формате JSON со стандартными HTTP-статусами и кодом ошибки, исключая раскрытие PII и внутренних трассировок.
          </p>

          <div className="overflow-x-auto pt-2">
            <table className="w-full min-w-[600px] text-left border-collapse text-[13px]">
              <thead>
                <tr className="border-b border-black/[0.08] text-steel-gray font-regular">
                  <th className="py-2.5 pr-4 w-28">Статус</th>
                  <th className="py-2.5 px-4 w-48">Код ошибки</th>
                  <th className="py-2.5 pl-4">Описание</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.04] font-book">
                <tr>
                  <td className="py-2.5 pr-4 font-mono text-emerald-600">202 Accepted</td>
                  <td className="py-2.5 px-4 font-mono text-off-black">—</td>
                  <td className="py-2.5 pl-4 text-steel-gray">Задание принято к обработке и поставлено в очередь BullMQ.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-mono text-amber-600">401 Unauthorized</td>
                  <td className="py-2.5 px-4 font-mono text-off-black">INVALID_API_KEY</td>
                  <td className="py-2.5 pl-4 text-steel-gray">Заголовок X-API-Key отсутствует или ключ недействителен.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-mono text-red-600">403 Forbidden</td>
                  <td className="py-2.5 px-4 font-mono text-off-black">ACCESS_DENIED</td>
                  <td className="py-2.5 pl-4 text-steel-gray">Попытка обращения к заданию другого пользователя.</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-mono text-red-600">413 Payload Too Large</td>
                  <td className="py-2.5 px-4 font-mono text-off-black">FILE_SIZE_LIMIT_EXCEEDED</td>
                  <td className="py-2.5 pl-4 text-steel-gray">Превышен тарифный предел размера файла (ТЗ §3.3).</td>
                </tr>
                <tr>
                  <td className="py-2.5 pr-4 font-mono text-red-600">429 Too Many Requests</td>
                  <td className="py-2.5 px-4 font-mono text-off-black">RATE_LIMIT_EXCEEDED</td>
                  <td className="py-2.5 pl-4 text-steel-gray">Превышен лимит запросов в минуту или интервал проверки 5 сек.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
