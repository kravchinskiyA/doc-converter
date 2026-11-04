# Прогресс разработки doc-converter

## [2026-11-04] Создание плана реализации проекта (docs/implementation-plan.md)

### Суть задачи

На основе технического задания ([`docs/technical-specification-final.md`](file:///Applications/ServBay/www/files-converter/docs/technical-specification-final.md)), архитектурных стандартов ([`docs/architecture.md`](file:///Applications/ServBay/www/files-converter/docs/architecture.md)) и дизайна ([`docs/design.md`](file:///Applications/ServBay/www/files-converter/docs/design.md)) сформирован пошаговый план реализации в файле [`docs/implementation-plan.md`](file:///Applications/ServBay/www/files-converter/docs/implementation-plan.md).
План выстроен в строгой последовательности:
1. **Этап 1: Frontend** (дизайн-система Augen Pro, i18n, главная страница, направления конвертации, результаты, авторизация, личный кабинет, тарифы и закрытая админка);
2. **Этап 2: База данных и хранилище** (Prisma ORM модели пользователей, квот, подписок, транзакций и Outbox, миграции, S3 SSE-KMS в ЕС);
3. **Этап 3: Backend, очереди и конвертеры** (NestJS, Better Auth, Stripe, SES, ClamAV до обработки, BullMQ/Redis, движки Sharp/pdf-lib/PDFium/LibreOffice/PaddleOCR, публичный API).

### Измененные и созданные файлы

- [`docs/implementation-plan.md`](file:///Applications/ServBay/www/files-converter/docs/implementation-plan.md): Создан структурированный план реализации работ по этапам.
- [`docs/progress.md`](file:///Applications/ServBay/www/files-converter/docs/progress.md): Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-11-04] Документирование каталога страниц и их наполнения в docs/design.md

### Суть задачи

В документ спецификации дизайна [`docs/design.md`](file:///Applications/ServBay/www/files-converter/docs/design.md) добавлен исчерпывающий каталог всех страниц проекта согласно техническому заданию ([`docs/technical-specification-final.md`](file:///Applications/ServBay/www/files-converter/docs/technical-specification-final.md)) с детальным описанием функциональных блоков, состояний и элементов интерфейса в рамках дизайн-системы Augen Pro. Каталог включает:
- Главную страницу (`/` или `/[locale]`) с единым блоком загрузки «Документы» и преимуществами;
- Страницы направлений конвертации (`/[locale]/convert/[direction]`);
- Страницу ожидания и результатов (`/[locale]/results/[jobId]`);
- Набор экранов аутентификации и восстановления (`/[locale]/auth/*`);
- Личный кабинет с 8 ключевыми секциями (`/[locale]/account`);
- Тарифы и шлюз оплаты Stripe (`/[locale]/pricing`);
- Разделы закрытой административной панели с TOTP (`/[locale]/admin/*`);
- Документацию API и системные страницы (`/api-docs`, `/terms`, `/privacy`, 404, 500).

### Измененные и созданные файлы

- [`docs/design.md`](file:///Applications/ServBay/www/files-converter/docs/design.md): Добавлен Раздел 7 с полным реестром и описанием всех страниц.
- [`docs/progress.md`](file:///Applications/ServBay/www/files-converter/docs/progress.md): Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-11-02] Инициализация структуры монорепозитория и установка базовых npm-пакетов

### Суть задачи

Развернут базовый каркас монорепозитория (npm Workspaces) в точном соответствии с `docs/architecture.md` и правилами `.agents/rules/architecture-monorepo.md`:
- Созданы все приложения в `apps/`: `web` (Next.js 15, React 19, FSD-слои), `api` (NestJS 10, Express), `worker` (BullMQ-координаторы), `maintenance` (фоновые процессы).
- Созданы все общие пакеты в `packages/`: `core` (чистая предметная логика, порты), `infrastructure` (Prisma, S3, BullMQ, SES, KMS, Sharp, pdf-lib, Stripe), `contracts` (Zod DTO), `config` (валидация окружения).
- Созданы вспомогательные директории `prisma`, `deploy`, `tests`, `workers/ocr`.
- Сконфигурирован строгий TypeScript (`tsconfig.base.json` и локальные `tsconfig.json` для каждого пакета).
- Установлены базовые зависимости, успешное прохождение `npm run typecheck` по всем рабочим пространствам.
- Создана документация `docs/project-structure.md`.

### Измененные и созданные файлы

- `package.json`, `package-lock.json`: Корневой манифест монорепозитория и lockfile.
- `tsconfig.base.json`: Базовая конфигурация TypeScript со строгими проверками.
- `.gitignore`: Правила игнорирования артефактов сборки, node_modules и секретов.
- `apps/web/`: Манифест `package.json`, `tsconfig.json`, `next.config.ts`, базовая верстка App Router и FSD-директории.
- `apps/api/`: Манифест `package.json`, `tsconfig.json`, точка входа `src/main.ts` и модульные каталоги.
- `apps/worker/`: Манифест `package.json`, `tsconfig.json`, `src/main.ts`, папки процессоров и runner.
- `apps/maintenance/`: Манифест `package.json`, `tsconfig.json`, `src/main.ts`.
- `packages/contracts/`: Манифест `package.json`, `tsconfig.json`, контракт `AppStatusSchema`.
- `packages/config/`: Манифест `package.json`, `tsconfig.json`, валидация базовой конфигурации.
- `packages/core/`: Манифест `package.json`, `tsconfig.json`, порт `StoragePort` и доменные каталоги.
- `packages/infrastructure/`: Манифест `package.json`, `tsconfig.json`, каталоги драйверов и сервисов.
- `prisma/schema.prisma`: Базовый файл схемы БД.
- `deploy/.env.example`: Шаблон безопасных переменных окружения.
- `docs/project-structure.md`: Справочник архитектуры каталогов монорепозитория.
- `AGENTS.md`: Добавлен раздел 5 с инструкциями по запуску сервисов и монорепозитория.
- `docs/progress.md`: Фиксация завершения этапа.

### Новые переменные окружения (.env)

- Добавлен пример в `deploy/.env.example`: `NODE_ENV`, `PORT`, `DATABASE_URL`, `REDIS_HOST`, `REDIS_PORT`, `AWS_REGION`, `AWS_S3_BUCKET`.

---

## [2026-11-02] Внедрение воркспейс-скиллов prisma-patterns и postgres-patterns

### Суть задачи

В монорепозиторий добавлены два скилла по работе с базами данных: `prisma-patterns` (`.agents/skills/prisma-patterns/SKILL.md`) и `postgres-patterns` (`.agents/skills/postgres-patterns/SKILL.md`). Скиллы содержат практические рекомендации по проектированию моделей, безопасным миграциям (`migrate deploy` в проде), управлению транзакциями, курсорной пагинации, предотвращению N+1, составным/частичным индексам и настройке пулов соединений. Скиллы интегрированы в сценарий работы с базой данных (Сценарий Г) и в реестр `AGENTS.md`.

### Измененные и созданные файлы

- `.agents/skills/prisma-patterns/SKILL.md`: Создан файл скилла по Prisma ORM (модели, индексы, интерактивные транзакции, предостережения bulk-операций, ошибки `P2002`/`P2025`).
- `.agents/skills/postgres-patterns/SKILL.md`: Создан файл скилла по PostgreSQL (шпаргалка по типам индексов, порядок полей составных индексов, частичные индексы, курсорная пагинация, выявление медленных запросов).
- `AGENTS.md`: Добавлены скиллы в Сценарий Г («Изменение структуры данных или схем БД») и в Раздел 4 («Дополнительные специализированные скиллы»).
- `docs/progress.md`: Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-11-02] Внедрение воркспейс-скилла typescript-patterns

### Суть задачи

В монорепозиторий добавлен специализированный скилл `typescript-patterns` (`.agents/skills/typescript-patterns/SKILL.md`), содержащий стандарты строгой типизации TypeScript (строгие опции компилятора, категорический отказ от `any`, валидация на границах через Zod, дискриминированные объединения как стейт-машины, брендированные типы идентификаторов, `Result<T, E>` для ожидаемых бизнес-исходов, `cause` в ошибках, ограничение параллельности). Скилл интегрирован в `.agents/rules/coding-standards.md` и добавлен в реестр `AGENTS.md`.

### Измененные и созданные файлы

- `.agents/skills/typescript-patterns/SKILL.md`: Создан файл скилла со стандартами проектирования типов, обработки ошибок и асинхронных паттернов.
- `.agents/rules/coding-standards.md`: Добавлена ссылка на скилл для проектирования типов и архитектурных решений на TypeScript.
- `AGENTS.md`: Добавлен скилл в Раздел 4 («Дополнительные специализированные скиллы»).
- `docs/progress.md`: Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-11-02] Внедрение воркспейс-скилла cloud-infrastructure-security

### Суть задачи

Добавлен скилл `cloud-infrastructure-security` (`.agents/skills/cloud-infrastructure-security/SKILL.md`), регламентирующий стандарты и чеклисты безопасности облачной инфраструктуры (изоляция в регионе ЕС, приватный VPC для PostgreSQL, 100% приватность и SSE-KMS для S3, OIDC-аутентификация в CI/CD без статичных ключей, Cloudflare WAF, CloudWatch без PII, автоматизированные бэкапы). Скилл интегрирован в реестр `AGENTS.md` и перелинкован со скиллом `security-review`.

### Измененные и созданные файлы

- `.agents/skills/cloud-infrastructure-security/SKILL.md`: Создан файл скилла с инструкциями по облачной безопасности и чеклистами деплоя.
- `.agents/skills/security-review/references/cloud-infrastructure-security.md`: Создан справочник со ссылкой на скилл облачной безопасности.
- `.agents/skills/security-review/SKILL.md`: Добавлена перекрестная ссылка на скилл облачной инфраструктуры.
- `AGENTS.md`: Добавлен скилл в Раздел 4 («Дополнительные специализированные скиллы»).
- `docs/progress.md`: Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-11-02] Внедрение воркспейс-скилла security-review

### Суть задачи

В монорепозиторий добавлен специализированный скилл `security-review` (`.agents/skills/security-review/SKILL.md`), содержащий комплексные чеклисты и практические паттерны безопасности (управление секретами без PII, валидация через Zod, предотвращение SQLi/XSS/CSRF, параметры cookies `HttpOnly`/`Secure`/`SameSite`, rate limiting, безопасность зависимостей). Скилл интегрирован в `.agents/rules/security-auth.md`, добавлен в сценарии работы и в раздел скиллов навигатора `AGENTS.md`.

### Измененные и созданные файлы

- `.agents/skills/security-review/SKILL.md`: Создан файл скилла с инструкциями и чеклистами предрелизного аудита безопасности.
- `.agents/rules/security-auth.md`: Добавлена ссылка на чеклист скилла для задач создания API, работы с инпутами и платежами.
- `AGENTS.md`: Добавлен Раздел 4 («Дополнительные специализированные скиллы») и обновлен Сценарий Б (Backend / API).
- `docs/progress.md`: Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-11-02] Интеграция стандартов Next.js и дизайн-системы Augen Pro в правила агентов

### Суть задачи

Внедрены новые правила разработки фронтенда: стандарт Next.js App Router (с адаптацией под Feature-Sliced Design) и дизайн-система Augen Pro (минималистичный легкий дизайн, строгая типографика, отсутствие теней, фирменная палитра с акцентом Signal Blue). Правила зафиксированы в `.agents/rules/`, актуализирована документация `docs/design.md`, а также обновлен главный навигатор `AGENTS.md`.

### Измененные и созданные файлы

- `.agents/rules/nextjs.md`: Создано правило с лучшими практиками Next.js (RSC по умолчанию, локализация `'use client'`, нативный streaming и Suspense, `next/image`, `next/font`, обработка ошибок, согласование с FSD).
- `.agents/rules/design-system.md`: Создано правило дизайна по спецификации Augen Pro (палитра `#0f1012`, `#fdfdfd`, `#0071e3`, начертание 350, радиусы 54px и 9999px, zero-shadows).
- `docs/design.md`: Актуализирована проектная спецификация дизайна с утверждением стиля Augen Pro.
- `AGENTS.md`: Новые правила добавлены в таблицу (Раздел 2) и включены в Сценарий А (Разработка интерфейса Frontend / UI).
- `docs/progress.md`: Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-10-30] Модуляризация правил AGENTS.md и создание каталога .agents/rules

### Суть задачи

Разделен монолитный файл `AGENTS.md` на специализированные тематические правила в директории `.agents/rules/`. В файле `AGENTS.md` сформировано оглавление с матрицей условий использования правил под конкретные сценарии и типы задач разработки.

### Измененные и созданные файлы

- `.agents/rules/project-overview.md`: Обзор продукта, границы этапов, юрисдикция ЕС, строгая приватность.
- `.agents/rules/architecture-monorepo.md`: Архитектура монорепозитория, единый HTTPS Origin, правила связей `apps/` и `packages/`.
- `.agents/rules/frontend-fsd.md`: Стандарты фронтенда, иерархия слоев FSD (`apps/web/src/`), правила импортов, формы и i18n.
- `.agents/rules/backend-api.md`: Стандарты NestJS, потоковая передача файлов, Stripe, SES, форматы ответов API.
- `.agents/rules/queues-workers.md`: BullMQ, Redis, Transactional Outbox, лимиты параллельности, запрет автоматических повторов.
- `.agents/rules/converters-ocr.md`: Антивирусная проверка ClamAV до обработки, параметры Sharp, pdf-lib (A4, поля 10 мм), PDFium, LibreOffice, PaddleOCR.
- `.agents/rules/security-auth.md`: Better Auth, Prisma-сессии, шифрование ключей (AES-256-GCM + KMS), сроки жизни сессий.
- `.agents/rules/coding-standards.md`: Стандарты TypeScript, запрет `any`, валидация Zod, безопасность логов, MCP context7.
- `.agents/rules/task-completion.md`: Регламент завершения задач и поддержания памяти проекта.
- `AGENTS.md`: Переработан в центральный навигатор с глобальными инвариантами, оглавлением правил с условиями их подключения и матрицей типовых сценариев.
- `docs/progress.md`: Зафиксирован прогресс модуляризации правил.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-10-30] Инициализация и формирование AGENTS.md

### Суть задачи

Сформирован полноценный свод инструкций и правил для ИИ-агентов (`AGENTS.md`) на базе утвержденной проектной документации (ТЗ 1.37, архитектура 2.1, технологический стек 1.0, дизайн безопасности, очередей и авторизации).

### Измененные файлы

- `AGENTS.md`: Разработан структурированный регламент для ИИ-агентов, включающий обзор системы, правила монорепозитория, технологический стек, правила очередей (Outbox, лимиты параллельности), безопасность, правила FSD-архитектуры и регламент фиксации прогресса.
- `docs/progress.md`: Инициализирован журнал прогресса проекта.

### Новые переменные окружения (.env)

- Не добавлялись.
