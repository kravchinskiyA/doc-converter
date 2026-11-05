# Структура проекта doc-converter

**Версия:** 1.0  
**Дата:** 2 ноября 2026 г.  
**Тип:** npm Workspaces Monorepo

## 1. Обзор архитектуры директорий

```text
files-converter/
├── apps/
│   ├── web/                              # Next.js 15 (React 19, App Router, FSD) — UI сайта, кабинета и админки
│   │   ├── app/                          # Точки маршрутизации Next.js App Router
│   │   │   └── [locale]/                 # Локализованные роуты (uk, ru, en)
│   │   │       ├── convert/              # Страницы направлений конвертации
│   │   │       ├── results/[jobId]/      # Страница ожидания и скачивания результатов
│   │   │       ├── auth/                 # Вход, регистрация, восстановление
│   │   │       ├── account/              # Личный кабинет, квоты, история
│   │   │       ├── pricing/              # Страница тарифов и подписок
│   │   │       └── admin/                # Закрытая панель управления (Этап 1)
│   │   ├── middleware.ts                 # Middleware локализации next-intl (uk по умолчанию, ru, en)
│   │   ├── global.d.ts                   # Типизация IntlMessages для next-intl
│   │   ├── src/                          # Feature-Sliced Design (FSD)
│   │   │   ├── _app/                     # Провайдеры, стили, инициализация UI
│   │   │   │   └── i18n/                 # Серверная интеграция next-intl (request.ts, IntlProvider)
│   │   │   ├── _pages/                   # UI страниц и их композиция
│   │   │   ├── features/                 # Переиспользуемые сценарии действий
│   │   │   ├── entities/                 # Бизнес-сущности интерфейса
│   │   │   └── shared/                   # Общий UI (shadcn/ui), API-клиент, утилиты
│   │   │       ├── ui/
│   │   │       ├── api/
│   │   │       ├── i18n/                 # routing, navigation, messages (uk/ru/en), zod-error-map, hooks
│   │   │       └── lib/
│   │   └── public/                       # Публичная статика
│   ├── api/                              # NestJS 10 + Express — API, авторизация, биллинг, шлюз
│   │   └── src/
│   │       ├── main.ts                   # Инициализация HTTP и middleware
│   │       ├── modules/
│   │       │   ├── auth/                 # Better Auth + адаптер Prisma
│   │       │   ├── accounts/             # Пользователи, профили
│   │       │   ├── conversions/          # Прием и ведение заданий
│   │       │   ├── files/                # Потоковый шлюз загрузки/отдачи
│   │       │   ├── billing/              # Stripe подписки и платежи
│   │       │   ├── staff/                # Роли сотрудников, TOTP
│   │       │   └── operations/           # Healthcheck и статус сервиса
│   │       └── common/                   # Guards, interceptors, filters
│   ├── worker/                           # TypeScript / BullMQ — координатор задач конвертации
│   │   └── src/
│   │       ├── main.ts
│   │       ├── processors/               # BullMQ-обработчики заданий
│   │       └── runner/                   # Изоляция и управление процессами
│   └── maintenance/                      # Фоновые процессы (Outbox, очистка TTL, сверка)
│       └── src/
│           └── main.ts
├── packages/
│   ├── core/                             # Чистая предметная логика и порты интерфейсов
│   │   └── src/
│   │       ├── identity/                 # Логика аккаунтов, ключей
│   │       ├── conversions/              # Допуск, жизненный цикл задач
│   │       ├── quotas/                   # Расчет квот и лимитов
│   │       ├── storage/                  # Правила хранения и очистки
│   │       ├── billing/                  # Расчет тарифов
│   │       ├── staff/                    # Служебные права
│   │       └── ports/                    # Интерфейсы внешних сервисов (Storage, Mail и др.)
│   ├── infrastructure/                   # Реализации портов и драйверы
│   │   └── src/
│   │       ├── database/                 # Prisma Client и репозитории
│   │       ├── queue/                    # BullMQ / Redis
│   │       ├── storage/                  # Amazon S3 SDK v3 (SSE-KMS в ЕС)
│   │       ├── auth/                     # Better Auth интеграция
│   │       ├── security/                 # KMS, Secrets Manager, ClamAV
│   │       ├── converters/               # Sharp, pdf-lib, PDFium, LibreOffice, OCR
│   │       ├── archive/                  # Archiver (ZIP)
│   │       ├── email/                    # SESv2 SDK v3
│   │       └── payments/                 # Stripe SDK
│   ├── contracts/                        # DTO, схемы Zod, общие контракты API
│   │   └── src/
│   │       └── index.ts
│   └── config/                           # Валидация переменных окружения через Zod
│       └── src/
│           └── index.ts
├── workers/
│   └── ocr/                              # Локальный Python-адаптер (при необходимости)
├── prisma/
│   ├── schema.prisma                     # Схема базы данных
│   └── migrations/                       # Каталог миграций
├── deploy/
│   ├── docker/                           # Dockerfile образы
│   ├── proxy/                            # Конфигурация Nginx / Caddy единого Origin
│   └── .env.example                      # Шаблон переменных окружения
├── tests/
│   ├── integration/                      # Интеграционные тесты
│   ├── e2e/                              # End-to-end тесты
│   └── fixtures/                         # Контрольные файлы и сканы
├── package.json                          # Корневой манифест workspaces
├── tsconfig.base.json                    # Базовые строгие правила TypeScript
└── .gitignore                            # Исключения Git
```

