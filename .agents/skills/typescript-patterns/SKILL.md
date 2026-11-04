---
name: typescript-patterns
description: >-
  TypeScript patterns for strict, type-safe, maintainable code in modern TypeScript and JavaScript applications.
  Covers strict compiler configuration, type design, narrowing, discriminated unions, generics, async and error handling,
  module boundaries, dependency hygiene, and type-level testing. Use when writing or reviewing TypeScript or JavaScript code.
metadata:
  origin: ECC
---

# TypeScript Development Patterns

Паттерны и лучшие практики TypeScript для создания надежных, строго типизированных и поддерживаемых приложений в монорепозитории.

## Когда активировать

- Написание нового кода на TypeScript (`.ts`, `.tsx`) в любых пакетах (`apps/*`, `packages/*`)
- Ревью кода и рефакторинг с целью устранения `any`, ужесточения типов и валидации
- Проектирование типов, дженериков, DTO и границ модулей
- Настройка или обновление конфигураций `tsconfig.json`
- Отладка каскадных ошибок типов на стыках слоев

---

## 1. Базовые принципы

### Строгий режим компилятора (`strict: true`)
Строгий режим обязателен во всех пакетах монорепозитория. 

```jsonc
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "noPropertyAccessFromIndexSignature": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "forceConsistentCasingInFileNames": true,
    "verbatimModuleSyntax": true
  }
}
```

Флаг `noUncheckedIndexedAccess` делает доступ по индексу к массивам и записям типом `T | undefined`, защищая от runtime-падений:

```typescript
const [first] = items;
if (first === undefined) {
  throw new Error("expected at least one item");
}
```

### `any` — это баг, а не инструмент
Использование `any` запрещено глобальным инвариантом проекта. Всегда используйте `unknown` с обязательным сужением через Zod или type guards:

```typescript
// ❌ ПЛОХО: any на публичной границе
export function parseConfig(raw: any): Config {
  return raw.config ?? {};
}

// ✅ ХОРОШО: unknown с валидацией через Zod
import { z } from 'zod';

const ConfigSchema = z.object({
  timeout: z.number().int().positive().default(30_000),
  retries: z.number().int().nonnegative().default(3),
});

export type Config = z.infer<typeof ConfigSchema>;

export function parseConfig(raw: unknown): Config {
  return ConfigSchema.parse(raw);
}
```

### Явная типизация публичных API, вывод для локальных переменных
Экспортируемые функции, методы сервисов и контроллеров всегда должны иметь явные типы параметров и возвращаемых значений. Локальные переменные внутри функций полагаются на вывод типов TypeScript.

```typescript
// ✅ ХОРОШО
export function formatUser(user: User): string {
  const fullName = `${user.firstName} ${user.lastName}`; // тип выводится автоматически
  return fullName;
}
```

---

## 2. Проектирование типов (Type Design)

### Интерфейсы vs Type Aliases
- `interface` — для расширяемых объектных структур и контрактов сервисов/репозиториев.
- `type` — для объединений (unions), пересечений (intersections), кортежей, маппингов и Zod `z.infer`.
- Предпочитать строковые литеральные объединения (`'admin' | 'user'`) вместо числовых `enum`.

### Дискриминированные объединения (Discriminated Unions) как стейт-машины
Все состояния сущностей, задач конвертации и транзакций должны моделироваться через дискриминированные объединения с литеральным полем `kind` / `status` и исчерпывающей проверкой (`assertNever`):

```typescript
type ConversionTask =
  | { status: 'pending'; taskId: string; createdAt: Date }
  | { status: 'processing'; taskId: string; startedAt: Date; progress: number }
  | { status: 'completed'; taskId: string; downloadUrl: string; completedAt: Date }
  | { status: 'failed'; taskId: string; error: string; failedAt: Date };

function getStatusMessage(task: ConversionTask): string {
  switch (task.status) {
    case 'pending':
      return 'В очереди';
    case 'processing':
      return `Обработка (${task.progress}%)`;
    case 'completed':
      return 'Готово к скачиванию';
    case 'failed':
      return `Ошибка: ${task.error}`;
    default:
      return assertNever(task);
  }
}

function assertNever(value: never): never {
  throw new Error(`Необработанный вариант: ${JSON.stringify(value)}`);
}
```

### Брендированные типы (Branded Types) для идентификаторов
Для предотвращения случайной подмены строковых ID (например, `UserId` вместо `FileId`) использовать брендирование:

```typescript
declare const brand: unique symbol;
export type UserId = string & { readonly [brand]: 'UserId' };
export type FileId = string & { readonly [brand]: 'FileId' };
```

### Дженерики для сохранения типов вызывающего кода
Вместо приведения типов (`as MyType`) или `unknown` прокидывайте тип вызывающего кода:

```typescript
// ✅ ХОРОШО: Дженерик с ограничением
export function getCached<T extends object>(key: string, parse: (raw: string) => T): T | undefined {
  const raw = cache.get(key);
  if (raw === undefined) return undefined;
  return parse(raw);
}
```

### Объект параметров вместо позиционных аргументов
Если функция принимает более 2 аргументов, объединять их в типизированный объект параметров:

```typescript
interface ConvertFileOptions {
  readonly targetFormat: TargetFormat;
  readonly ocrEnabled?: boolean;
  readonly signal?: AbortSignal;
}

export async function convertFile(fileId: FileId, options: ConvertFileOptions): Promise<ConversionResult> {
  // ...
}
```

---

## 3. Сужение типов и безопасность во время выполнения

### Валидация на границе (Boundary Validation)
Недоверенные данные (HTTP-запросы, вебхуки Stripe, очереди BullMQ) валидируются строго на входе с помощью схем Zod из `packages/contracts`. Внутри доменного слоя данные считаются проверенными.

### Предикаты типов (Type Predicates) и Assertion Functions
```typescript
function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function assertValidId(id: string): asserts id is string {
  if (!/^[a-zA-Z0-9_-]+$/.test(id)) {
    throw new TypeError(`Invalid ID format: ${id}`);
  }
}
```

### Иммутабельность через `readonly`
Массивы и объекты в сигнатурах функций, которые не должны мутироваться, помечаются `readonly`:

```typescript
export function calculateTotalSize(files: readonly UploadedFile[]): number {
  return files.reduce((sum, file) => sum + file.sizeBytes, 0);
}
```

---

## 4. Обработка ошибок

### Result Types для ожидаемых бизнес-исходов
Для ожидаемых отказов (ошибки валидации, лимит тарифа, неподдерживаемый формат) использовать `Result<T, E>` вместо `throw`:

```typescript
export type Result<T, E> = 
  | { readonly ok: true; readonly value: T } 
  | { readonly ok: false; readonly error: E };

export function parseFormat(input: string): Result<SupportedFormat, 'UNSUPPORTED_FORMAT'> {
  if (isSupportedFormat(input)) {
    return { ok: true, value: input };
  }
  return { ok: false, error: 'UNSUPPORTED_FORMAT' };
}
```

Исключения (`throw`) резервируются только для непредвиденных системных сбоев (потеря соединения с базой, отказ диска, авария процесса).

### Сохранение контекста ошибки (`cause`)
При перехвате и оборачивании ошибки всегда передавать оригинальную причину через `cause`:

```typescript
try {
  await s3Client.send(command);
} catch (error) {
  throw new StorageOperationError(`Failed to upload file to S3`, { cause: error });
}
```

---

## 5. Асинхронные паттерны

### `Promise.allSettled` для независимых параллельных задач
```typescript
const results = await Promise.allSettled(fileIds.map(id => processFile(id)));
```

### Ограничение параллельности (Bounded Concurrency)
Запрещено запускать неограниченное число параллельных промисов на большие массивы данных. Использовать ограничение параллельности (например, лимиты BullMQ или чанки).

### Передача `AbortSignal` и таймауты
Все долгие операции, HTTP-запросы и конвертации должны принимать `AbortSignal` для поддержки отмены и таймаутов.

---

## 6. Границы модулей и импорты

1. **Строгие направления зависимостей:** `contracts` -> `core` -> `infrastructure` -> `apps` (никаких обратных импортов).
2. **Публичный интерфейс (Public API):** Доступ к модулям и слайсам FSD разрешен только через входной `index.ts`.
3. **Запрет циклических импортов:** Если два модуля зависят друг от друга, общий интерфейс/тип выносится в shared/contracts слой.
4. **Запрет гигантских barrel-файлов (`index.ts`), реэкспортирующих всё подряд:** импортировать конкретные сущности.

---

## 7. Проверка типов и тестирование

- `pnpm --filter <app/pkg> typecheck` — проверка типов компилятором `tsc --noEmit`.
- Использование `satisfies` для валидации литеральных объектов без расширения их типов:

```typescript
export const FORMAT_MIME_TYPES = {
  pdf: 'application/pdf',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  png: 'image/png',
} as const satisfies Record<string, string>;
```

---

## Антипаттерны (Anti-Patterns)

- ❌ `any` в сигнатурах функций, DTO или компонентах.
- ❌ Небезопасные приведения через `as MyType` без предшествующей проверки валидатором.
- ❌ Подавление ошибок пустыми блоками `catch {}`.
- ❌ Использование устаревших числовых `enum`.
- ❌ Мутация входных параметров функций.

