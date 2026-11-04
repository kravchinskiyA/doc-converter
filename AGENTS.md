# Главный навигатор и правила для ИИ-агентов (AGENTS.md)

Данный документ является точкой входа и навигатором по архитектурным стандартам и правилам проекта **doc-converter** (`files-converter`).

Все детальные правила вынесены в директорию `.agents/rules/`. Перед выполнением любой задачи агент обязан определить контекст работ и импортировать соответствующие правила в соответствии с приведенным ниже оглавлением.

---

## 1. Базовые глобальные инварианты

Каждый агент обязан непреложно соблюдать следующие правила вне зависимости от типа задачи:

1. **Регион и юрисдикция:** Обработка файлов, базы данных, очереди, объектное хранилище (S3) и секреты находятся **строго в регионе ЕС**.
2. **Конфиденциальность документов:** Файлы пользователей **категорически запрещено** передавать внешним сервисам (Stripe, SES, сторонним AI/OCR API). Вся обработка выполняется исключительно на собственных мощностях.
3. **Строгая типизация:** Запрещен тип `any`. Валидация входных данных — только через Zod-схемы.
4. **Актуальная документация через MCP:** Всегда использовать MCP `context7` для сверки API сторонних библиотек.
5. **Фиксация результатов:** Завершение любой задачи сопровождается обязательным обновлением журнала в `docs/progress.md` (а при изменении схемы БД или структуры — в `docs/db-schema.md` и `docs/project-structure.md`).

---

## 2. Оглавление правил и условия их использования

| Файл правила | Тематика | Когда и для каких задач импортировать | Ключевая проектная документация |
| :--- | :--- | :--- | :--- |
| **[.agents/rules/project-overview.md](.agents/rules/project-overview.md)** | Обзор продукта, границы этапов, юрисдикция и приватность | - Вводные задачи, планирование новой функциональности.<br>- Вопросы границ Этапа 1 (SaaS) и Этапа 2 (Telegram-бот).<br>- Любые решения по архитектуре хранения и обработки файлов. | [docs/technical-specification-final.md](docs/technical-specification-final.md)<br>[docs/architecture.md](docs/architecture.md) |
| **[.agents/rules/architecture-monorepo.md](.agents/rules/architecture-monorepo.md)** | Структура монорепозитория, единый Origin, связи пакетов | - Создание или перенос модулей/пакетов в `apps/*` и `packages/*`.<br>- Настройка сетевой маршрутизации, проксирования `/api/*`, взаимодействия SSR Next.js и NestJS.<br>- Добавление общих DTO и контрактов в `packages/contracts`. | [docs/architecture.md](docs/architecture.md)<br>[docs/technology-stack.md](docs/technology-stack.md) |
| **[.agents/rules/frontend-fsd.md](.agents/rules/frontend-fsd.md)** | Архитектура Frontend, Feature-Sliced Design (FSD), UI | - Любые задачи в `apps/web/`.<br>- Создание страниц App Router (`app/[locale]/...`), виджетов, форм.<br>- Работа с Tailwind CSS, shadcn/ui, `next-intl` (i18n), React Hook Form и валидацией Zod. | [docs/frontend-tools.md](docs/frontend-tools.md)<br>[docs/design.md](docs/design.md) |
| **[.agents/rules/nextjs.md](.agents/rules/nextjs.md)** | Стандарты Next.js (App Router, React 19+) | - Разработка страниц, компонентов и лейаутов в `apps/web/`.<br>- Оптимизация RSC (`'use client'` как можно ниже), Suspense, потоки данных.<br>- Применение `next/image`, `next/font`, Core Web Vitals, перехват ошибок (`error.tsx`). | [docs/frontend-tools.md](docs/frontend-tools.md)<br>[docs/technology-stack.md](docs/technology-stack.md) |
| **[.agents/rules/design-system.md](.agents/rules/design-system.md)** | Дизайн-система и UI стандарты (Augen Pro) | - Стилизация компонентов, верстка страниц, палитра цветов и отступы.<br>- Монохромный светлый фон, акцент Signal Blue (`#0071e3`), начертание 350, радиусы 54px/9999px.<br>- Принцип zero-shadows (полный отказ от теней). | [docs/design.md](docs/design.md) |
| **[.agents/rules/backend-api.md](.agents/rules/backend-api.md)** | Серверная логика NestJS, REST API, потоки, биллинг | - Любые задачи в `apps/api/`.<br>- Реализация HTTP-контроллеров, потоковой загрузки/отдачи файлов, генерации ZIP.<br>- Интеграция Stripe (карты, подписки, вебхуки с `raw body`) и Amazon SESv2.<br>- Обработка ошибок, выдача `202 Accepted` и статусов задач. | [docs/email-delivery-design.md](docs/email-delivery-design.md)<br>[docs/technical-specification-final.md](docs/technical-specification-final.md) |
| **[.agents/rules/queues-workers.md](.agents/rules/queues-workers.md)** | Очереди BullMQ, Redis, воркеры и Transactional Outbox | - Любые задачи в `apps/worker/` и `apps/maintenance/`.<br>- Логика постановки задач в очередь, обработка жизненного цикла задач.<br>- Реализация лимитов параллельности (Global Concurrency 5) и квот тарифов.<br>- Обработка сбоев воркеров (запрет автоповторов, освобождение квот). | [docs/queue-design.md](docs/queue-design.md)<br>[docs/architecture.md](docs/architecture.md) |
| **[.agents/rules/converters-ocr.md](.agents/rules/converters-ocr.md)** | Движки конвертации, PaddleOCR, антивирус ClamAV | - Разработка или модификация конвейера конвертации в `packages/infrastructure/src/converters/`.<br>- Настройка антивирусного сканирования ClamAV (обязательно ДО обработки).<br>- Логика Sharp (картинки), pdf-lib (A4, поля 10 мм), PDFium (превью), LibreOffice (DOCX → PDF), PaddleOCR (PDF → DOCX). | [docs/conversion-validation-plan.md](docs/conversion-validation-plan.md)<br>[docs/technology-stack.md](docs/technology-stack.md) |
| **[.agents/rules/security-auth.md](.agents/rules/security-auth.md)** | Аутентификация Better Auth, шифрование, KMS, сессии | - Задачи авторизации, регистрации, сброса паролей, сессий в `apps/api/src/modules/auth/`.<br>- Работа с ролями администратора, TOTP, одноразовыми почтовыми кодами.<br>- Шифрование API-ключей (AES-256-GCM + KMS), шифрование S3 (SSE-KMS), хранение паролей (scrypt).<br>- Настройка сроков сессий (пользователи: 7/30 дней; персонал: 15 мин/8 часов). | [docs/security-design.md](docs/security-design.md)<br>[docs/auth-design.md](docs/auth-design.md) |
| **[.agents/rules/coding-standards.md](.agents/rules/coding-standards.md)** | Стандарты TypeScript, типизация, Zod, чистота кода | - **Обязательно при написании любого кода** во всем репозитории.<br>- Запрет `any`, правила оформления DTO, безопасность логов (запрет PII).<br>- Требования к юнит- и интеграционным тестам с мокированием. | [docs/technology-stack.md](docs/technology-stack.md) |
| **[.agents/rules/task-completion.md](.agents/rules/task-completion.md)** | Протокол завершения задач и фиксация памяти | - **Обязательно перед отправкой финального ответа пользователю** по любой задаче реализации.<br>- Обновление `docs/progress.md`, `docs/db-schema.md`, `docs/project-structure.md`. | [docs/progress.md](docs/progress.md) |

---

## 3. Матрица сценариев: какие правила подключать к задаче

Перед началом работы определите категорию вашей задачи и импортируйте указанный набор правил:

### Сценарий А. Разработка интерфейса (Frontend / UI / Pages)
>
> **Затрагиваемые пути:** `apps/web/`, `packages/contracts/`

1. [.agents/rules/frontend-fsd.md](.agents/rules/frontend-fsd.md) — структура слоев FSD, правила импортов, shadcn/ui, i18n.
2. [.agents/rules/nextjs.md](.agents/rules/nextjs.md) — Server Components по умолчанию, `'use client'`, `next/image`, `next/font`, Streaming.
3. [.agents/rules/design-system.md](.agents/rules/design-system.md) — дизайн-код Augen Pro, палитра `#0f1012`/`#0071e3`, радиусы 54px/9999px, zero-shadows.
4. [.agents/rules/coding-standards.md](.agents/rules/coding-standards.md) — типизация, Zod, запрет `any`.
5. [.agents/rules/architecture-monorepo.md](.agents/rules/architecture-monorepo.md) — маршрутизация, взаимодействие с API и контракты.
6. [.agents/rules/task-completion.md](.agents/rules/task-completion.md) — фиксация прогресса по окончании.

### Сценарий Б. Разработка API, авторизации или биллинга (Backend / API)
>
> **Затрагиваемые пути:** `apps/api/`, `packages/core/`, `packages/infrastructure/`, `packages/contracts/`

1. [.agents/rules/backend-api.md](.agents/rules/backend-api.md) — NestJS, потоки файлов, Stripe, SES.
2. [.agents/rules/security-auth.md](.agents/rules/security-auth.md) — Better Auth, Prisma-сессии, шифрование ключей, политики сроков.
3. [.agents/skills/security-review/SKILL.md](.agents/skills/security-review/SKILL.md) — чеклист аудита безопасности (валидация инпутов, секреты, токены, CSRF, XSS, rate limiting).
4. [.agents/rules/architecture-monorepo.md](.agents/rules/architecture-monorepo.md) — границы слоев `core` и `infrastructure`.
5. [.agents/rules/coding-standards.md](.agents/rules/coding-standards.md) — строгие DTO, логирование без PII.
6. [.agents/rules/task-completion.md](.agents/rules/task-completion.md) — фиксация прогресса и схемы БД.

### Сценарий В. Обработка файлов, очереди и конвертация (Worker / Pipeline)
>
> **Затрагиваемые пути:** `apps/worker/`, `apps/maintenance/`, `packages/infrastructure/src/converters/`

1. [.agents/rules/queues-workers.md](.agents/rules/queues-workers.md) — BullMQ, Transactional Outbox, лимиты параллельности, отказ от retries.
2. [.agents/rules/converters-ocr.md](.agents/rules/converters-ocr.md) — ClamAV до обработки, спецификации A4 (10 мм), PDFium, Sharp, LibreOffice, OCR.
3. [.agents/rules/project-overview.md](.agents/rules/project-overview.md) — изоляция файлов в ЕС, TTL, запрет внешних API.
4. [.agents/rules/task-completion.md](.agents/rules/task-completion.md) — фиксация прогресса по окончании.

### Сценарий Г. Изменение структуры данных или схем БД
>
> **Затрагиваемые пути:** `packages/infrastructure/prisma/`, `packages/contracts/`

1. [.agents/rules/backend-api.md](.agents/rules/backend-api.md) и [.agents/rules/security-auth.md](.agents/rules/security-auth.md).
2. [.agents/skills/prisma-patterns/SKILL.md](.agents/skills/prisma-patterns/SKILL.md) — паттерны Prisma ORM (модели, миграции, транзакции, избежание ловушек bulk-операций).
3. [.agents/skills/postgres-patterns/SKILL.md](.agents/skills/postgres-patterns/SKILL.md) — оптимизация PostgreSQL (составные/частичные индексы, типы данных, курсоры).
4. [.agents/rules/task-completion.md](.agents/rules/task-completion.md) — **обязательная актуализация `docs/db-schema.md`**.

---

## 4. Дополнительные специализированные скиллы (Skills)

| Скилл | Назначение | Когда активировать | Расположение |
| :--- | :--- | :--- | :--- |
| **security-review** | Комплексный чеклист безопасности и валидации | Авторизация, новые эндпоинты API, работа с секретами, загрузка файлов, платежи Stripe, предрелизный аудит. | [.agents/skills/security-review/SKILL.md](.agents/skills/security-review/SKILL.md) |
| **cloud-infrastructure-security** | Безопасность облака, IAM, CI/CD, сети и хранилищ | Деплой в облако (AWS/Vercel/Railway), настройка политик IAM, Secrets Manager, S3/RDS, пайплайнов GitHub Actions, Cloudflare WAF. | [.agents/skills/cloud-infrastructure-security/SKILL.md](.agents/skills/cloud-infrastructure-security/SKILL.md) |
| **typescript-patterns** | Строгая типизация, дизайн типов, дискриминированные объединения | Написание/рефакторинг TypeScript кода, проектирование DTO и интерфейсов, обработка Result/Error, устранение `any`. | [.agents/skills/typescript-patterns/SKILL.md](.agents/skills/typescript-patterns/SKILL.md) |
| **prisma-patterns** | Проектирование схем Prisma, транзакции, оптимизация запросов | Создание/модификация моделей в `schema.prisma`, миграции, обработка ошибок Prisma, пагинация курсором. | [.agents/skills/prisma-patterns/SKILL.md](.agents/skills/prisma-patterns/SKILL.md) |
| **postgres-patterns** | Индексы, оптимизация запросов и структура PostgreSQL | Проектирование индексов (составные, частичные), оптимизация `EXPLAIN ANALYZE`, выбор типов данных. | [.agents/skills/postgres-patterns/SKILL.md](.agents/skills/postgres-patterns/SKILL.md) |

---

## 5. Запуск и разработка проекта (npm Workspaces)

### 5.1. Команды запуска в режиме разработки

Из корня репозитория доступны алиасы для запуска каждого сервиса:

- **Веб-интерфейс Next.js (порт 3000):**
  ```bash
  npm run dev:web
  # либо напрямую через workspace:
  npm run dev -w @doc-converter/web
  ```

- **Сервер API NestJS (порт 3001):**
  ```bash
  npm run dev:api
  # либо:
  npm run dev -w @doc-converter/api
  ```

- **Воркер задач BullMQ / конвертации:**
  ```bash
  npm run dev:worker
  # либо:
  npm run dev -w @doc-converter/worker
  ```

- **Фоновые процессы обслуживания (Maintenance / Outbox):**
  ```bash
  npm run dev:maintenance
  # либо:
  npm run dev -w @doc-converter/maintenance
  ```

### 5.2. Сборка и проверка типов во всем монорепозитории

- **Проверка типов TypeScript:**
  ```bash
  npm run typecheck
  ```

- **Сборка всех пакетов:**
  ```bash
  npm run build
  ```

### 5.3. Окружение и зависимости сервисов

1. **База данных PostgreSQL:** необходима для `apps/api` (схема и миграции в `prisma/schema.prisma`).
2. **Redis:** необходим для очередей задач BullMQ в `apps/worker` и `apps/api`.
3. **Файл переменных окружения `.env`:** создается в корне или в сервисах на основе шаблона [deploy/.env.example](deploy/.env.example).


