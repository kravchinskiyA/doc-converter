# Прогресс разработки doc-converter

## [2026-11-06] Реализация Личного кабинета пользователя (Пункт 1.7)

### Суть задачи

Выполнен пункт 1.7 плана реализации ([`docs/implementation-plan.md`](file:///Applications/ServBay/www/files-converter/docs/implementation-plan.md) §1.7) — разработан полнофункциональный Личный кабинет пользователя (`/[locale]/account/`) в строгом соответствии с ТЗ ([`docs/technical-specification-final.md`](file:///Applications/ServBay/www/files-converter/docs/technical-specification-final.md) §§5.4, 6.2, 6.3, 6.4, 6.5, 7, 10.1, 10.3, 11.1–11.3, 12.17), архитектурой Feature-Sliced Design (FSD), стандартами дизайна Augen Pro (zero-shadows, начертание 350, радиусы 54px/40px/28px/full, акцент Signal Blue) и полной поддержкой трёх языков (`uk`, `ru`, `en`):

1. **Контракты и схемы Zod (`packages/contracts/src/account.ts`, `index.ts`):**
   - Описаны строгие схемы валидации: `userProfileSchema`, `updateProfileSchema` (ФИО до 50 символов), `initEmailChangeSchema`, `verifyOldEmailStepSchema`, `completeEmailChangeSchema` (двухэтапная смена с чекбоксом завершения сессий), `changePasswordSchema` (scrypt, 8–128 символов), `apiKeyInfoSchema`, `rotateApiKeySchema`, `storageQuotaSchema` (квоты по тарифам 5/15/50 ГБ), `savedFileSchema` (срок 6 месяцев по ТЗ §10.1), `supportAccessRequestSchema` / `confirmSupportAccessSchema` / `revokeSupportAccessSchema` (ТЗ §12.17), `generateRecoveryCodesSchema` (ТЗ §6.5), `subscriptionDetailsSchema`, `changeSubscriptionPlanSchema`, `cancelSubscriptionSchema` (с расчетом возврата на карту по ТЗ §11.2), `deleteAccountSchema` (ТЗ §6.4).
2. **Слайс пользовательских сценариев (`apps/web/src/features/account/`):**
   - `model/types.ts`: типы навигационных вкладок, шагов flow-состояний смены email, пароля, ротации ключа, резервных кодов и отмены подписки.
   - `model/use-account-state.ts`: хук управления состоянием личного кабинета с поддержкой:
     * Профиля: сохранение ФИО, двухэтапная смена email с общим таймером 20 минут и чекбоксом отзыва сессий (ТЗ §6.2), смена пароля с подтверждением кодом и отзывом API-ключа (ТЗ §6.3);
     * Хранилища: расчет занятого места (байт/МБ/ГБ), предупреждение при ≥75%, блокировка новых конвертаций при 100%, полная очистка хранилища (ТЗ §10.3);
     * Сохраненных файлов: таблица результатов (сайт и API), поиск по имени, фильтрация по источнику, индивидуальное скачивание ZIP (ТЗ §10.2), пакетное скачивание архива выбранных файлов, удаление отдельных и выбранных файлов с мгновенным перерасчетом квоты;
     * API-ключа: создание по запросу пользователя (по умолчанию до первого выпуска ключ отсутствует по ТЗ §7), скрытый просмотр (`••••••••`), копирование, перевыпуск с подтверждением email-кодом, запрет выпуска/замены при активных конвертациях;
     * Подписки и оплаты: текущий статус (Stripe), переключатель автопродления (выключен по умолчанию по ТЗ §11.1), модальное окно смены тарифа (Pro ↔ Максимальный с доплатой/возвратом за оставшиеся дни периода по ТЗ §11.3), модальное окно немедленной отмены подписки с расчетом возврата на карту Stripe (ТЗ §11.2), история платежей и возвратов;
     * Резервных кодов: выпуск/замена набора из 10 непредсказуемых кодов (ТЗ §6.5) с подтверждением кодом на email, модальное окно однократного показа, копирование всех кодов и скачивание текстового файла `.txt`;
     * Служебного доступа: журнал запросов инженеров техподдержки к сбойным файлам с подтверждением 6-значным кодом на 24 часа и кнопкой досрочного отзыва (ТЗ §12.17);
     * Удаления аккаунта: Danger Zone с предупреждением об удалении файлов и отсутствии возврата за оставшийся оплаченный срок подписки (ТЗ §6.4), подтверждение через 6-значный email-код.
   - `ui/account-nav-tabs.tsx`: горизонтальные вкладки навигации Augen Pro с бейджами предупреждений квоты и входящих запросов.
   - `ui/profile-section.tsx`: карточка профиля, диалоги двухэтапной смены email и пароля.
   - `ui/storage-section.tsx`: шкала дискового пространства с порогом 75%, индикацией 100% блокировки и диалогом очистки.
   - `ui/saved-files-table.tsx`: таблица результатов с мультиселектом, поиском и ZIP-скачиванием.
   - `ui/api-key-section.tsx`: интерфейс API-ключа со скрытием, копированием и cURL-примером.
   - `ui/subscription-section.tsx`: карточка тарифа, автопродление, диалоги апгрейда/даунгрейда и отмены с возвратом.
   - `ui/security-codes-section.tsx`: карточка 10 резервных кодов с модалкой однократного показа и экспортом в файл.
   - `ui/staff-access-section.tsx`: контроль доступа техподдержки к документам с подтверждением и отзывом.
   - `ui/danger-zone-section.tsx`: зона необратимого удаления аккаунта.
   - `index.ts`: Public API слайса `features/account`.
3. **Слайс композиции страниц (`apps/web/src/_pages/account/`):**
   - `account-page.tsx`: страница личного кабинета со sticky-меню Augen Pro и адаптивным лейаутом.
   - `index.ts`: Public API слайса.
   - Экспорт в `apps/web/src/_pages/index.ts`.
4. **Маршрутизация Next.js App Router (`apps/web/app/[locale]/account/`):**
   - `page.tsx`: серверный компонент с динамическими метаданными `generateMetadata`, `setRequestLocale` и рендерингом `AccountPage`.
5. **Интернационализация и UI:**
   - Добавлен раздел `"account"` во все языковые словари (`uk.json`, `ru.json`, `en.json`).
   - В выпадающем меню `Navbar` статус маршрута `account` обновлен на `ready`.
6. **Верификация качества:**
   - Проверка типов TypeScript `npm run typecheck` пройдена без ошибок по всем воркспейсам монорепозитория.
   - Продакшен-сборка `npm run build -w @doc-converter/web` успешно сгенерировала все 51 страницу приложения.

### Измененные и созданные файлы

- `packages/contracts/src/account.ts`: Zod-схемы профиля, хранилища, файлов, подписок, API-ключей, резервных кодов и служебного доступа.
- `packages/contracts/src/index.ts`: Экспорт контрактов аккаунта.
- `apps/web/src/features/account/model/types.ts`: Типы данных и состояний слайса `features/account`.
- `apps/web/src/features/account/model/use-account-state.ts`: Хук жизненного цикла личного кабинета со всей бизнес-логикой ТЗ.
- `apps/web/src/features/account/ui/account-nav-tabs.tsx`: Навигационные вкладки разделов кабинета в стиле Augen Pro.
- `apps/web/src/features/account/ui/profile-section.tsx`: Секция профиля, двухэтапная смена email и смена пароля.
- `apps/web/src/features/account/ui/storage-section.tsx`: Секция хранилища с прогресс-баром, порогом 75% и очисткой.
- `apps/web/src/features/account/ui/saved-files-table.tsx`: Таблица результатов (web/API) с мультивыбором и ZIP-скачиванием.
- `apps/web/src/features/account/ui/api-key-section.tsx`: Секция API-ключа со скрытием, копированием и ротацией по email-коду.
- `apps/web/src/features/account/ui/subscription-section.tsx`: Секция подписки, автопродление, смена тарифа и отмена с возвратом на карту.
- `apps/web/src/features/account/ui/security-codes-section.tsx`: Секция 10 резервных кодов восстановления (однократный показ, скачивание .txt).
- `apps/web/src/features/account/ui/staff-access-section.tsx`: Секция служебного доступа техподдержки к файлам по ТЗ §12.17.
- `apps/web/src/features/account/ui/danger-zone-section.tsx`: Зона удаления аккаунта с подтверждением по email.
- `apps/web/src/features/account/index.ts`: Public API слайса `features/account`.
- `apps/web/src/_pages/account/account-page.tsx`: Композиция страницы Личного кабинета.
- `apps/web/src/_pages/account/index.ts`: Public API слайса `_pages/account`.
- `apps/web/src/_pages/index.ts`: Реэкспорт `AccountPage`.
- `apps/web/app/[locale]/account/page.tsx`: Маршрут Next.js App Router с локализацией и метаданными.
- `apps/web/src/shared/i18n/messages/uk.json`: Переводы раздела `"account"` на украинский.
- `apps/web/src/shared/i18n/messages/ru.json`: Переводы раздела `"account"` на русский.
- `apps/web/src/shared/i18n/messages/en.json`: Переводы раздела `"account"` на английский.
- `apps/web/src/shared/ui/navbar.tsx`: Обновление статуса ссылки кабинета на `ready`.
- `docs/implementation-plan.md`: Отметка о выполнении пункта 1.7.
- `docs/project-structure.md`: Актуализация архитектурной структуры слайсов и контрактов.

## [2026-11-05] Реализация страницы ожидания и результатов конвертации (Пункт 1.5)

### Суть задачи

Выполнен пункт 1.5 плана реализации ([`docs/implementation-plan.md`](file:///Applications/ServBay/www/files-converter/docs/implementation-plan.md) §1.5) — разработана страница ожидания и скачивания результатов конвертации (`/[locale]/results/[jobId]/`) в соответствии со спецификацией ТЗ ([`docs/technical-specification-final.md`](file:///Applications/ServBay/www/files-converter/docs/technical-specification-final.md) §§5.2, 9.1, 10.1, 10.2), правилами архитектуры Feature-Sliced Design (FSD), стандартами дизайна Augen Pro (zero-shadows, начертание 350, радиусы 54px/28px/24px/9999px, акцент Signal Blue) и полной мультиязычностью (`uk`, `ru`, `en`):

1. **Контракты и схемы результатов конвертации (`packages/contracts/src/conversion.ts`):**
   - Добавлены строгие схемы Zod: `JobStatusSchema` (`queued`, `processing`, `completed`, `partial`, `failed`), `FileConversionStatusSchema`, `OutputFileResultSchema`, `JobResultSchema`.
2. **Слайс пользовательских сценариев (`apps/web/src/features/job-results/`):**
   - `model/types.ts`: типы для представления задачи, файлов, обратного отсчета `CountdownState` и состояния генерации ZIP.
   - `model/use-job-results.ts`: хук жизненного цикла задания с динамическим вычислением оставшегося срока доступности файлов (12 часов для гостя, ТЗ §10.1), симуляцией перехода из очереди/обработки в готовое состояние, скачиванием отдельных файлов и единого ZIP-архива.
   - `ui/job-countdown-timer.tsx`: интерактивный блок обратного отсчета доступности файлов (ч:мин:сек), бейджи европейской юрисдикции хранения данных (ЕС, GDPR), предупреждение об автоматическом удалении через 12 часов и призыв зарегистрироваться/войти для бессрочного сохранения до 6 месяцев в Личном кабинете.
   - `ui/job-status-card.tsx`: карточка статуса задачи в стиле Augen Pro (скругление 54px, hairline-рамка 0.5px, zero-shadows) с бейджами состояний, кнопкой копирования Job ID, сводными метриками (всего/готово/ошибок) и анимированным прогресс-баром при обработке.
   - `ui/job-files-list.tsx`: список исходных и сконвертированных файлов с индикацией формата, форматированным размером (`useFormatFileSize`), кнопками индивидуального скачивания и выводом понятных причин отказов без раскрытия PII (`passwordProtected`, `unpackLimitExceeded`, `corruptedFile`, `ocrFailed`, `timeout`).
   - `ui/job-results-view.tsx`: объединяющая карточка с кнопкой скачивания единого архива («Скачать все в едином ZIP»), кнопкой перехода к новой конвертации и ссылкой в кабинет.
   - `index.ts`: Public API слайса.
3. **Слайс композиции страниц (`apps/web/src/_pages/results/`):**
   - `ResultsPage`: композиция страницы с бейджами безопасности `EU Region (GDPR)` и `ClamAV Clean`, центрированной сеткой и адаптивным контейнером.
   - `index.ts`: Public API слайса страниц.
4. **Маршрутизация Next.js App Router (`apps/web/app/[locale]/results/[jobId]/`):**
   - `page.tsx`: серверный компонент с валидацией `jobId`, динамической генерацией заголовка вкладки `generateMetadata` и вызовом `setRequestLocale`.
5. **Интернационализация и UI:**
   - Добавлен раздел переводов `"results"` во все словари (`uk.json`, `ru.json`, `en.json`).
   - В навигационном меню `Navbar` статус маршрута `results` обновлен с `planned` на `ready`.
6. **Верификация качества:**
   - Полная проверка типов `npm run typecheck` пройдена без ошибок по всем пакетам монорепозитория.
   - Полная сборка `npm run build -w @doc-converter/web` завершилась успешно.

### Измененные и созданные файлы

- `packages/contracts/src/conversion.ts`: добавлены Zod-схемы `JobStatusSchema`, `FileConversionStatusSchema`, `OutputFileResultSchema`, `JobResultSchema`.
- `apps/web/src/features/job-results/model/types.ts`: типы для представления результатов конвертации.
- `apps/web/src/features/job-results/model/use-job-results.ts`: хук управления состоянием задания, таймером и скачиванием.
- `apps/web/src/features/job-results/ui/job-countdown-timer.tsx`: компонент обратного отсчета 12 часов с баннером сохранения в аккаунт.
- `apps/web/src/features/job-results/ui/job-status-card.tsx`: карточка общего статуса задачи и метрик файлов.
- `apps/web/src/features/job-results/ui/job-files-list.tsx`: интерактивный список файлов с кнопками скачивания и причинами ошибок.
- `apps/web/src/features/job-results/ui/job-results-view.tsx`: объединяющий контейнер результатов с кнопкой единого ZIP.
- `apps/web/src/features/job-results/index.ts`: Public API слайса `features/job-results`.
- `apps/web/src/_pages/results/results-page.tsx`: страница результатов конвертации.
- `apps/web/src/_pages/results/index.ts`: Public API слайса `_pages/results`.
- `apps/web/src/_pages/index.ts`: реэкспорт `ResultsPage`.
- `apps/web/app/[locale]/results/[jobId]/page.tsx`: маршрут Next.js App Router с динамическими метаданными.
- `apps/web/src/shared/i18n/messages/uk.json`: переводы раздела `"results"` на украинский язык.
- `apps/web/src/shared/i18n/messages/ru.json`: переводы раздела `"results"` на русский язык.
- `apps/web/src/shared/i18n/messages/en.json`: переводы раздела `"results"` на английский язык.
- `apps/web/src/shared/ui/navbar.tsx`: обновление статуса ссылки результатов в dev-меню.
- `docs/implementation-plan.md`: отметка о выполнении пункта 1.5 плана.


### Суть задачи

Выполнен пункт 1.4 плана реализации ([`docs/implementation-plan.md`](file:///Applications/ServBay/www/files-converter/docs/implementation-plan.md) §1.4) — разработаны все специализированные страницы и формы направлений конвертации в соответствии со спецификацией ТЗ ([`docs/technical-specification-final.md`](file:///Applications/ServBay/www/files-converter/docs/technical-specification-final.md) §§2, 3.4–3.6), стандартами архитектуры FSD, дизайном Augen Pro (zero-shadows, начертание 350, радиусы 54px/26px/9999px, акцент Signal Blue) и полной поддержкой мультиязычности (`uk`, `ru`, `en`):

1. **Контракты и схемы параметров конвертации (`packages/contracts/src/conversion.ts`, `index.ts`):**
   - Описаны строгие схемы Zod: `ConversionDirectionSchema`, `OcrLanguageSchema` (`uk`, `ru`, `en`, `fr`, `de`, `pl`), `PdfRasterDpiSchema` (72, 150, 300 DPI), `ImageQualitySchema` (1–100, default 85), `ImageOutputFormatSchema` (`jpg`, `webp`), `PdfToDocxOptionsSchema`, `DocxToPdfOptionsSchema`, `ImagesToPdfOptionsSchema`, `PdfToImagesOptionsSchema`.
2. **Слайс интерактивных сценариев (`apps/web/src/features/conversion-directions/`):**
   - `DirectionNav`: адаптивное pill-меню быстрого переключения между направлениями конвертации.
   - `PageThumbnailGrid`: интерактивная сетка миниатюр страниц PDF с мультивыбором чекбоксами, кнопками «Выбрать все» / «Снять выбор», визуализацией карточек формата A4 и счетчиком выбранных страниц.
   - `PdfToDocxForm`: форма загрузки PDF, интерактивный выбор страниц для OCR, мультиселектор 6 языков распознавания текста (ТЗ §2.3), гарантии сохранения структуры (абзацы, заголовки, списки, таблицы по ТЗ §2.4, CER ≤ 2%).
   - `DocxToPdfForm`: форма загрузки DOCX, инспектор проверки распаковки (до 500 МБ и 10 000 файлов по ТЗ §3.6), инфо о headless-движке LibreOffice в ЕС.
   - `ImagesToPdfForm`: загрузка JPG, PNG, статического WebP, Drag-and-drop перетаскивание и кнопки перемещения порядка страниц, тумблер «Объединить в один PDF» (по умолчанию выключен по ТЗ §2.1) со спецификацией A4, полей 10 мм, белого фона и авто-ориентации.
   - `PdfToImagesForm`: форма конвертации PDF в JPG / WebP, селектор разрешения (72 / 150 / 300 DPI), ползунок качества сжатия (1–100, default 85) с едиными параметрами операции и выбором страниц.
3. **Слайс композиции страниц (`apps/web/src/_pages/convert/`):**
   - `ConvertPage`: композиция выбранного направления, информационные карточки юрисдикции ЕС, ClamAV-сканирования и 12-часового TTL.
4. **Маршрутизация Next.js App Router (`apps/web/app/[locale]/convert/`):**
   - `app/[locale]/convert/page.tsx`: редирект на `/convert/pdf-to-docx`.
   - `app/[locale]/convert/[direction]/page.tsx`: статическая генерация `generateStaticParams` для всех комбинаций локалей и направлений (48 страниц), динамические метаданные `generateMetadata` и строгая валидация маршрутов.
5. **Интернационализация и навигация:**
   - Добавлен раздел `"convert"` в словари `uk.json`, `ru.json`, `en.json`.
   - В выпадающем dev-меню `Navbar` для всех направлений конвертации статус обновлен на `ready`.
6. **Верификация качества:**
   - Полная проверка типов `npm run typecheck` пройдена без ошибок по всему монорепозиторию.
   - Линтинг `npm run lint` пройден без предупреждений.
   - Продакшен-сборка `npm run build -w @doc-converter/web` завершилась успешно со всеми 48 SSG-страницами.

### Измененные и созданные файлы

- `packages/contracts/src/conversion.ts`: Zod-схемы и типы параметров направлений конвертации.
- `packages/contracts/src/index.ts`: Экспорт схем конвертации.
- `apps/web/src/features/conversion-directions/model/types.ts`: Модели данных, конфигурации лимитов и направлений.
- `apps/web/src/features/conversion-directions/ui/direction-nav.tsx`: Навигационный переключатель направлений.
- `apps/web/src/features/conversion-directions/ui/page-thumbnail-grid.tsx`: Интерактивная сетка миниатюр страниц PDF.
- `apps/web/src/features/conversion-directions/ui/pdf-to-docx-form.tsx`: Форма PDF → DOCX с OCR и выбором страниц/языков.
- `apps/web/src/features/conversion-directions/ui/docx-to-pdf-form.tsx`: Форма DOCX → PDF с инспектором лимита распаковки.
- `apps/web/src/features/conversion-directions/ui/images-to-pdf-form.tsx`: Форма Images → PDF с сортировкой и тумблером объединения.
- `apps/web/src/features/conversion-directions/ui/pdf-to-images-form.tsx`: Форма PDF → Images с селектором DPI/качества.
- `apps/web/src/features/conversion-directions/index.ts`: Публичный API слайса features.
- `apps/web/src/_pages/convert/convert-page.tsx`: Композиция страницы конвертации.
- `apps/web/src/_pages/convert/index.ts`: Экспорт страницы конвертации.
- `apps/web/src/_pages/index.ts`: Реэкспорт страниц конвертации.
- `apps/web/app/[locale]/convert/page.tsx`: Редирект корневого маршрута `/convert`.
- `apps/web/app/[locale]/convert/[direction]/page.tsx`: Локализованный динамический маршрут с SSG и метаданными.
- `apps/web/src/shared/i18n/messages/uk.json`: Переводы раздела `"convert"` на украинский.
- `apps/web/src/shared/i18n/messages/ru.json`: Переводы раздела `"convert"` на русский.
- `apps/web/src/shared/i18n/messages/en.json`: Переводы раздела `"convert"` на английский.
- `apps/web/src/shared/ui/navbar.tsx`: Обновление статусов пунктов конвертеров на `ready`.
- `docs/implementation-plan.md`: Отметка о выполнении пункта 1.4.

## [2026-11-05] Добавление метаданных правил Antigravity (.agents/rules)

### Суть задачи

В соответствии со спецификацией Antigravity Rules ([https://antigravity.google/docs/rules/](https://antigravity.google/docs/rules/)) все файлы правил в `.agents/rules/*.md` дополнены блоками YAML frontmatter (`trigger`, `globs`, `description`). Это обеспечивает корректную автоматическую активацию правил при обращении к соответствующим файлам и поддиректориям (`glob`), постоянный контроль кодовых стандартов (`always_on`) и динамическую загрузку архитектурных регламентов (`model_decision`).

### Измененные файлы

- `.agents/rules/architecture-monorepo.md`: добавлен frontmatter (`trigger: model_decision`).
- `.agents/rules/backend-api.md`: добавлен frontmatter (`trigger: glob`, `globs: "apps/api/**, packages/contracts/**"`).
- `.agents/rules/coding-standards.md`: добавлен frontmatter (`trigger: always_on`).
- `.agents/rules/converters-ocr.md`: добавлен frontmatter (`trigger: glob`, `globs: "packages/infrastructure/src/converters/**, apps/worker/**"`).
- `.agents/rules/design-system.md`: добавлен frontmatter (`trigger: glob`, `globs: "apps/web/**"`).
- `.agents/rules/frontend-fsd.md`: добавлен frontmatter (`trigger: glob`, `globs: "apps/web/**"`).
- `.agents/rules/git-flow.md`: добавлен frontmatter (`trigger: model_decision`).
- `.agents/rules/nextjs.md`: добавлен frontmatter (`trigger: glob`, `globs: "apps/web/**"`).
- `.agents/rules/project-overview.md`: добавлен frontmatter (`trigger: model_decision`).
- `.agents/rules/queues-workers.md`: добавлен frontmatter (`trigger: glob`, `globs: "apps/worker/**, apps/maintenance/**"`).
- `.agents/rules/security-auth.md`: добавлен frontmatter (`trigger: glob`, `globs: "apps/api/**, packages/infrastructure/prisma/**"`).
- `.agents/rules/task-completion.md`: добавлен frontmatter (`trigger: always_on`).

## [2026-11-05] Реализация экранов аутентификации и восстановления (Пункт 1.6)

### Суть задачи

Выполнен пункт 1.6 плана реализации ([`docs/implementation-plan.md`](file:///Applications/ServBay/www/files-converter/docs/implementation-plan.md) §1.6) — разработаны все экраны и интерактивные формы аутентификации, подтверждения и восстановления аккаунта в соответствии со спецификацией ([`docs/technical-specification-final.md`](file:///Applications/ServBay/www/files-converter/docs/technical-specification-final.md) §§6.1, 6.3, 6.5), стандартами архитектуры FSD, дизайном Augen Pro (zero-shadows, начертание 350/400, радиусы 32px/44px, акцент Signal Blue) и строгой типизацией Zod:

1. **Контракты и схемы валидации (`packages/contracts/src/auth.ts`, `index.ts`):**
   - Реализованы строгие Zod-схемы для всех сценариев аутентификации:
     - `passwordSchema`: пароль от 8 до 128 символов включительно, поддержка пробелов, кириллицы и спецсимволов;
     - `emailSchema`: валидация и нормализация email (`trim`, `toLowerCase`);
     - `emailCodeSchema`: 6-значный цифровой OTP-код (`/^\d{6}$/`);
     - `recoveryCodeSchema`: одноразовый буквенно-цифровой резервный код (8–32 символа);
     - `loginSchema`, `registerSchema`, `verifyEmailSchema`, `forgotPasswordSchema`, `resetPasswordSchema`, `accountRecoverySchema`.
2. **Слайс пользовательских сценариев (`apps/web/src/features/auth/`):**
   - `AuthCard` (`ui/auth-card.tsx`): унифицированная контентная карточка в стиле Augen Pro (`max-w-[500px]`, `rounded-[32px] md:rounded-[44px]`, hairline-рамка 0.5px, zero-shadows);
   - `LoginForm` (`ui/login-form.tsx`): форма входа с переключением видимости пароля, чекбоксом сессии на 30 дней (`rememberMe`), ссылками на сброс пароля, резервный код и регистрацию;
   - `RegisterForm` (`ui/register-form.tsx`): форма регистрации с валидацией пароля (8–128), подтверждением пароля, чекбоксом обязательного принятия условий и политики, автоматическим переходом на подтверждение email;
   - `VerifyEmailForm` (`ui/verify-email-form.tsx`): интерактивный экран подтверждения с таймером действия кода (10 минут / 600 с), защитой от перебора (счетчик 5 попыток), кулдауном повторной отправки (60 с) с кнопкой запроса нового кода и возможностью смены email;
   - `ForgotPasswordForm` (`ui/forgot-password-form.tsx`): экран запроса сброса пароля с безопасным уведомлением OWASP (без раскрытия факта существования аккаунта) и переходом к установке нового пароля;
   - `ResetPasswordForm` (`ui/reset-password-form.tsx`): установка нового пароля по 6-значному коду с обязательным предупреждением безопасности по ТЗ §6.3 (завершение всех сессий на всех устройствах и отзыв действующего API-ключа);
   - `RecoveryCodeForm` (`ui/recovery-code-form.tsx`): процедура восстановления при утере почты по ТЗ §6.5 (ввод резервного кода, указание нового свободного email с отправкой кода подтверждения, задание нового пароля, предупреждение об аннулировании старых кодов, сессий, ключа и Telegram-бота, лимит 5 попыток за 15 минут);
   - `index.ts`: Public API слайса `features/auth`.
3. **Слайс композиции страниц (`apps/web/src/_pages/auth/`):**
   - `LoginPage`, `RegisterPage`, `VerifyEmailPage`, `ForgotPasswordPage`, `ResetPasswordPage`, `RecoveryCodePage` с безопасными обертками `React.Suspense` для клиентских поисковых параметров;
   - `index.ts`: Public API слайса `_pages/auth`.
4. **Маршрутизация Next.js App Router (`apps/web/app/[locale]/auth/`):**
   - Локализованные роуты для трех языков (`uk`, `ru`, `en`) с генерацией метаданных `generateMetadata` и статической генерацией `generateStaticParams`:
     - `app/[locale]/auth/page.tsx` (редирект на `/auth/login`);
     - `app/[locale]/auth/login/page.tsx`;
     - `app/[locale]/auth/register/page.tsx`;
     - `app/[locale]/auth/verify-email/page.tsx`;
     - `app/[locale]/auth/forgot-password/page.tsx`;
     - `app/[locale]/auth/reset-password/page.tsx`;
     - `app/[locale]/auth/recovery-code/page.tsx`.
5. **Интернационализация и навигация:**
   - Добавлен полный раздел переводов `"auth"` (login, register, verifyEmail, forgotPassword, resetPassword, recoveryCode) в словари `uk.json`, `ru.json`, `en.json`;
   - В выпадающее меню страниц `PAGE_GROUPS` компонента `Navbar` добавлены ссылки на экраны авторизации со статусом `ready`.

### Измененные и созданные файлы

- `packages/contracts/src/auth.ts`: Zod-схемы и типы данных для всех сценариев авторизации и восстановления.
- `packages/contracts/src/index.ts`: Экспорт контрактов авторизации.
- `apps/web/src/features/auth/model/types.ts`: Типы состояния форм и контрактов.
- `apps/web/src/features/auth/ui/auth-card.tsx`: Базовая карточка Augen Pro для форм авторизации.
- `apps/web/src/features/auth/ui/login-form.tsx`: Форма входа в аккаунт с валидацией Zod.
- `apps/web/src/features/auth/ui/register-form.tsx`: Форма регистрации с проверкой пароля и условий.
- `apps/web/src/features/auth/ui/verify-email-form.tsx`: Экран подтверждения email (таймер 10 мин, 5 попыток, кулдаун 60 с).
- `apps/web/src/features/auth/ui/forgot-password-form.tsx`: Форма запроса сброса пароля (OWASP).
- `apps/web/src/features/auth/ui/reset-password-form.tsx`: Форма установки нового пароля с уведомлением об отзыве сессий и API-ключей.
- `apps/web/src/features/auth/ui/recovery-code-form.tsx`: Форма восстановления по резервному коду (ТЗ §6.5).
- `apps/web/src/features/auth/index.ts`: Public API слайса `features/auth`.
- `apps/web/src/_pages/auth/login-page.tsx`: Страница входа.
- `apps/web/src/_pages/auth/register-page.tsx`: Страница регистрации.
- `apps/web/src/_pages/auth/verify-email-page.tsx`: Страница ввода 6-значного OTP кода.
- `apps/web/src/_pages/auth/forgot-password-page.tsx`: Страница запроса сброса пароля.
- `apps/web/src/_pages/auth/reset-password-page.tsx`: Страница смены пароля.
- `apps/web/src/_pages/auth/recovery-code-page.tsx`: Страница восстановления по резервному коду.
- `apps/web/src/_pages/auth/index.ts`, `apps/web/src/_pages/index.ts`: Public API слоя `_pages`.
- `apps/web/app/[locale]/auth/page.tsx`: Редирект на экран входа.
- `apps/web/app/[locale]/auth/login/page.tsx`: Роут Next.js App Router для входа.
- `apps/web/app/[locale]/auth/register/page.tsx`: Роут Next.js App Router для регистрации.
- `apps/web/app/[locale]/auth/verify-email/page.tsx`: Роут Next.js App Router для верификации email.
- `apps/web/app/[locale]/auth/forgot-password/page.tsx`: Роут Next.js App Router для запроса сброса пароля.
- `apps/web/app/[locale]/auth/reset-password/page.tsx`: Роут Next.js App Router для сброса пароля.
- `apps/web/app/[locale]/auth/recovery-code/page.tsx`: Роут Next.js App Router для резервного кода.
- `apps/web/src/shared/ui/checkbox.tsx`: Поддержка `React.ReactNode` в свойстве `label`.
- `apps/web/src/shared/ui/navbar.tsx`: Актуализация dev-меню со статусом `ready` для экранов авторизации.
- `apps/web/src/shared/i18n/messages/uk.json`: Переводы раздела `auth` и dev-меню на украинском языке.
- `apps/web/src/shared/i18n/messages/ru.json`: Переводы раздела `auth` и dev-меню на русском языке.
- `apps/web/src/shared/i18n/messages/en.json`: Переводы раздела `auth` и dev-меню на английском языке.
- `apps/web/next.config.ts`: Настройка транспиляции и алиасов расширений для `@doc-converter/contracts`.
- `docs/implementation-plan.md`: Отметка о выполнении пункта 1.6.
- `docs/project-structure.md`: Фиксация новых файлов авторизации в структуре проекта.
- `docs/progress.md`: Журнал выполнения пункта 1.6.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-11-05] Интернационализация (i18n) на базе next-intl и словари переводов (Пункт 1.2)

### Суть задачи

Выполнен пункт 1.2 плана реализации ([`docs/implementation-plan.md`](file:///Applications/ServBay/www/files-converter/docs/implementation-plan.md) §1.2) — интегрирована система интернационализации `next-intl` в Next.js 15 App Router в соответствии со слоями Feature-Sliced Design:
- **Маршрутизация и навигация (`apps/web/src/shared/i18n/`, `apps/web/middleware.ts`, `apps/web/next.config.ts`):**
  - Сконфигурирован `defineRouting` (`locales: ['uk', 'ru', 'en']`, `defaultLocale: 'uk'`, `localePrefix: 'always'`);
  - Созданы локализованные обёртки навигации `createNavigation` (`Link`, `redirect`, `usePathname`, `useRouter`, `getPathname`);
  - Настроен `middleware.ts` для автоматического определения локали и редиректа без затрагивания `/api/*`, `/_next/*` и статики;
  - Подключен плагин `createNextIntlPlugin('./src/_app/i18n/request.ts')` в `next.config.ts`.
- **Серверная конфигурация и провайдер (`apps/web/src/_app/i18n/`):**
  - Реализован `getRequestConfig` (`request.ts`) с валидацией `requestLocale` и загрузкой словарей;
  - Создан серверный провайдер `IntlProvider` (`NextIntlClientProvider`) для клиентских компонентов;
  - В `apps/web/app/[locale]/layout.tsx` добавлены `generateStaticParams`, локализованный `generateMetadata`, проверка локали через `notFound()` и `setRequestLocale(locale)`.
- **Словари переводов и строгая типизация (`apps/web/src/shared/i18n/messages/`):**
  - Созданы полные словари `uk.json`, `ru.json`, `en.json` со строгой проверкой совпадения структуры через TypeScript (`Record<Locale, () => Promise<{ default: Messages }>>` и глобальный `IntlMessages` в `global.d.ts`);
  - Охвачены разделы: `metadata`, `common`, `navigation` (включая dev-меню страниц), `footer`, `home`, `quickConverter`, `forms`, `validation`, `errors` (стабильные машинные коды ошибок API без утечки серверных исключений), `system` (тосты, статусы заданий, 404/500).
- **Валидация Zod и хуки i18n (`zod-error-map.ts`, `hooks.ts`):**
  - Реализованы `createZodErrorMap`, `useZodErrorMap` и хелпер `i18nIssue` для локализации стандартных и кастомных ошибок Zod в формах React Hook Form;
  - Добавлены хуки `useErrorMessage` (безопасный перевод машинных кодов ошибок API с фолбэком на `UNKNOWN`) и `useFormatFileSize` (форматирование размеров файлов Б/КБ/МБ по текущей локали).
- **Перевод существующих компонентов и переключатель языка:**
  - Создан компонент `LocaleSwitcher` (`apps/web/src/shared/ui/locale-switcher.tsx`) для переключения языка (`uk`/`ru`/`en`) с сохранением текущего маршрута;
  - Полностью переведены на словари `next-intl` главная страница (`app/[locale]/page.tsx`), `Navbar`, `Footer` и интерактивный `QuickConverter`.

### Измененные и созданные файлы

- `apps/web/src/shared/i18n/routing.ts`: Конфигурация локалей (`uk`, `ru`, `en`) и префиксов маршрутов.
- `apps/web/src/shared/i18n/navigation.ts`: Локализованные обёртки навигации (`Link`, `useRouter`, `usePathname`, `redirect`).
- `apps/web/src/shared/i18n/messages/uk.json`: Эталонный словарь украинского языка.
- `apps/web/src/shared/i18n/messages/ru.json`: Словарь русского языка.
- `apps/web/src/shared/i18n/messages/en.json`: Словарь английского языка.
- `apps/web/src/shared/i18n/messages.ts`: Типизированный загрузчик словарей `loadMessages` и тип `Messages`.
- `apps/web/src/shared/i18n/zod-error-map.ts`: Карта ошибок Zod (`createZodErrorMap`, `useZodErrorMap`, `i18nIssue`).
- `apps/web/src/shared/i18n/hooks.ts`: Хуки `useErrorMessage` и `useFormatFileSize`.
- `apps/web/src/shared/i18n/index.ts`: Public API сегмента `shared/i18n`.
- `apps/web/src/_app/i18n/request.ts`: Серверная конфигурация `getRequestConfig`.
- `apps/web/src/_app/i18n/intl-provider.tsx`, `index.ts`: Серверная обёртка `NextIntlClientProvider`.
- `apps/web/middleware.ts`: Middleware маршрутизации локалей `next-intl`.
- `apps/web/next.config.ts`: Подключение `createNextIntlPlugin`.
- `apps/web/global.d.ts`: Декларация `IntlMessages` для автодополнения и проверки ключей переводов.
- `apps/web/src/shared/ui/locale-switcher.tsx`, `index.ts`: Компонент переключения языка интерфейса.
- `apps/web/src/shared/ui/navbar.tsx`: Перевод навигации и dev-меню, подключение `LocaleSwitcher` и локализованного `Link`.
- `apps/web/src/shared/ui/footer.tsx`: Перевод всех секций подвала через `next-intl`.
- `apps/web/app/[locale]/layout.tsx`: Интеграция `IntlProvider`, `generateMetadata`, `generateStaticParams`, `setRequestLocale`.
- `apps/web/app/[locale]/page.tsx`: Локализация Hero-секции и карточек преимуществ главной страницы.
- `apps/web/src/features/quick-converter/ui/quick-converter.tsx`: Локализация интерактивного конвертера документов и размеров файлов.
- `docs/implementation-plan.md`: Отмечен пункт 1.2 как выполненный.
- `docs/project-structure.md`: Отражены файлы i18n и middleware в структуре `apps/web`.
- `docs/progress.md`: Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-11-05] Реализация интерактивной главной страницы (Пункт 1.3) и меню навигации "Страницы"

### Суть задачи

Выполнен пункт 1.3 плана реализации ([`docs/implementation-plan.md`](file:///Applications/ServBay/www/files-converter/docs/implementation-plan.md) §1.3), а также добавлено выпадающее dev-меню быстрого перехода по страницам приложения:
- **Интерактивный конвертер документов (`apps/web/src/features/quick-converter/`):**
  - Поддержка Drag-and-Drop и диалога выбора файлов для форматов PDF и DOCX;
  - Валидация гостевых ограничений: максимум 5 файлов за операцию, лимит размера до 25 МБ на файл;
  - Интерактивный список выбранных файлов с отображением имени, размера, бейджей статуса валидации (`Готов к обработке`, `Превышает 25 МБ`, `Недопустимый формат`);
  - Элементы управления списком: изменение порядка файлов (перемещение вверх/вниз), удаление отдельного файла и полная очистка;
  - Автоматическое определение направления конвертации (PDF → DOCX с OCR или DOCX → PDF) с возможностью ручного переключения;
  - Индикатор гостевых попыток (3 попытки с сохранением в `localStorage`) и блокировка запуска с предложением регистрации при исчерпании;
  - Кнопка запуска с симуляцией конвейера безопасности (антивирусная проверка ClamAV в ЕС → очередь BullMQ) и безопасным переходом в результаты;
  - Сохранение 3 информационных колонок преимуществ (100% юрисдикция ЕС, CER ≤ 2%, автоудаление через 12ч) в строгом стиле Augen Pro (zero-shadows, 54px).
- **Выпадающее меню «Страницы» в плавающем навбаре (`apps/web/src/shared/ui/navbar.tsx`):**
  - Добавлена кнопка «Страницы» с индикатором раскрытия (`ChevronDown`);
  - Выпадающая панель с группировкой страниц: Главные, Конвертеры (1.4), Результаты (1.5), Авторизация (1.6), Кабинет и Служебные (1.7, 1.9);
  - Индикаторы статуса готовности (`Готово` для созданных страниц, номер пункта для запланированных);
  - Автоматическое закрытие по клику вне панели или нажатию клавиши `Escape`.
- Проверка типов `npm run typecheck`, линтинг `npm run lint` и продакшен-сборка `npm run build -w @doc-converter/web` пройдены без ошибок.

### Измененные и созданные файлы

- `apps/web/src/features/quick-converter/types.ts`: Определение типов файлов, направлений конвертации и констант гостевых лимитов.
- `apps/web/src/features/quick-converter/ui/quick-converter.tsx`: Интерактивный клиентский компонент быстрой конвертации с Drag-and-Drop, сортировкой, удалением и валидацией.
- `apps/web/src/features/quick-converter/index.ts`: Публичный экспорт модуля по стандартам FSD.
- `apps/web/app/[locale]/page.tsx`: Подключение `QuickConverter` в композицию главной страницы.
- `apps/web/src/shared/ui/navbar.tsx`: Интеграция выпадающего меню навигации «Страницы».
- `docs/implementation-plan.md`: Отметка пункта 1.3 как выполненного.
- `docs/progress.md`: Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-11-04] Настройка ESLint 9 Flat Config со строгими правилами TypeScript, FSD и границами монорепозитория

### Суть задачи

В монорепозиторий внедрен современный линтер **ESLint 9 (Flat Config)** со строгим набором правил для автоматического контроля архитектурных инвариантов проекта:
- **Базовый инвариант №3:** Категорический запрет типа `any` (`@typescript-eslint/no-explicit-any: error`), строгий импорт типов (`consistent-type-imports`) и контроль неиспользуемых переменных (`no-unused-vars`).
- **Границы монорепозитория (`eslint-plugin-boundaries`):**
  - Изоляция `packages/core` от сторонних фреймворков и БД (разрешен импорт только `packages/contracts`);
  - Запрет прямого импорта серверной инфраструктуры (`packages/infrastructure`), API и воркеров во фронтенде (`apps/web`);
  - Запрет взаимных импортов между серверными приложениями и кодом фронтенда.
- **Архитектура Feature-Sliced Design (FSD):**
  - Строгое соблюдение иерархии слоев сверху вниз: `_app` → `_pages` → `features` → `entities` → `shared`;
  - Запрет горизонтальных связей между соседними срезами в `features` и `entities`;
  - Контроль Public API срезов через `index.ts`.
- **Правила Next.js 15 и React 19:**
  - Интеграция `@next/eslint-plugin-next` и `eslint-plugin-react-hooks`.
- Скрипты `lint` и `lint:fix` настроены в корневом `package.json`, проверка `npm run lint` завершается успешно без ошибок.

### Измененные и созданные файлы

- `package.json`: Добавлены dev-зависимости `eslint`, `typescript-eslint`, `eslint-plugin-boundaries`, `@next/eslint-plugin-next`, `eslint-plugin-react-hooks`, `globals`, настроены скрипты `lint` и `lint:fix`.
- `eslint.config.mjs`: Создан главный файл конфигурации ESLint 9 со всеми правилами монорепозитория, FSD и React.
- `apps/web/app/[locale]/page.tsx`: Исправлено использование неиспользуемых импортов (добавлена кнопка вызова диалога выбора файлов).
- `docs/progress.md`: Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

## [2026-11-04] Реализация дизайн-системы Augen Pro и базовых UI-компонентов (Пункт 1.1)

### Суть задачи

Выполнен первый пункт плана разработки ([`docs/implementation-plan.md`](file:///Applications/ServBay/www/files-converter/docs/implementation-plan.md) §1.1) — развернута дизайн-система Augen Pro и базовый UI-кит приложения:
- Настроена конфигурация Tailwind CSS (`tailwind.config.ts`, `postcss.config.mjs`) с палитрой Augen Pro (`#0f1012`, `#f2f2f4`, `#fdfdfd`, акцентный `#0071e3`), начертанием 350, радиусами `54px`, `26px`, `10px`, `9999px` и глобальным запретом теней (`zero-shadows`).
- Создан глобальный файл стилей `apps/web/src/_app/styles/globals.css`.
- Разработаны базовые компоненты в `apps/web/src/shared/ui/`:
  - `Button` (варианты `floating-cta`, `ghost`, `link`, `outline`, `secondary`);
  - `Card` (контентные карточки со скруглением `54px`, padding 69px, hairline-рамкой 0.5px);
  - `Badge` (чипы `Pill Tag Chip` 9999px с цветом Signal Blue и нейтральными вариантами);
  - `Input` (инпуты с фокусом Signal Blue и валидацией ошибок);
  - `Checkbox` (минималистичный чекбокс с иконкой Check);
  - `Dialog` (модальные окна без размытия/теней);
  - `Navbar` (плавающее верхнее меню `Floating Pill Navbar` 10px);
  - `Footer` (полноэкранный темный подвал `Dark Band Footer` `#0f1012`).
- Обновлен глобальный App Router лейаут `apps/web/app/[locale]/layout.tsx` и демонстрационная стартовая страница.
- Успешно пройдены `npm run typecheck` и `npm run build -w @doc-converter/web`.

### Измененные и созданные файлы

- `apps/web/package.json`: Добавлена зависимость `class-variance-authority`.
- `apps/web/tailwind.config.ts`, `apps/web/postcss.config.mjs`: Конфигурация дизайн-токенов Tailwind.
- `apps/web/src/shared/lib/utils.ts`, `index.ts`: Утилита объединения классов `cn`.
- `apps/web/src/_app/styles/globals.css`: Глобальные стили, переменные палитры и строгий запрет `box-shadow`.
- `apps/web/src/shared/ui/`: Компоненты `Button`, `Card`, `Badge`, `Input`, `Checkbox`, `Dialog`, `Navbar`, `Footer` и barrel-экспорт `index.ts`.
- `apps/web/app/[locale]/layout.tsx`: Подключение глобальных стилей, Navbar и Footer.
- `apps/web/app/[locale]/page.tsx`: Демонстрация карточки 54px, чипов и компонентов на главной.
- `docs/implementation-plan.md`: Отмечен пункт 1.1 как выполненный.
- `docs/progress.md`: Зафиксирован прогресс выполнения задачи.

### Новые переменные окружения (.env)

- Не добавлялись.

---

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
