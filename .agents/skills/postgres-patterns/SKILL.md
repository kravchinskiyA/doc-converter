---
name: postgres-patterns
description: >-
  PostgreSQL database patterns for query optimization, schema design, indexing, and performance tuning.
  Use when designing PostgreSQL schemas, indexes, analyzing slow queries, or configuring connection pools.
metadata:
  origin: ECC
---

# PostgreSQL Patterns

Справочник и лучшие практики PostgreSQL для проектирования схем, оптимизации запросов и индексации в монорепозитории.

## Когда активировать

- Создание или модификация моделей БД и миграций (`packages/infrastructure/prisma/`)
- Добавление индексов (B-tree, составные, частичные, GIN)
- Оптимизация медленных запросов (`EXPLAIN ANALYZE`)
- Настройка пулов соединений и таймаутов

---

## 1. Шпаргалка по индексам

| Шаблон запроса | Тип индекса | Пример SQL / Prisma |
|---|---|---|
| `WHERE col = value` | B-tree (по умолчанию) | `@@index([status])` |
| `WHERE col > value` | B-tree | `@@index([createdAt])` |
| `WHERE a = x AND b > y` | Составной (Composite) | `@@index([status, createdAt])` |
| `WHERE jsonb @> '{}'` | GIN | `CREATE INDEX idx ON t USING gin (metadata)` |
| `WHERE tsv @@ query` | GIN (полнотекстовый) | `CREATE INDEX idx ON t USING gin (tsv)` |
| Временные ряды / партиции | BRIN | `CREATE INDEX idx ON t USING brin (createdAt)` |

---

## 2. Типы данных: рекомендации

| Сценарий | Рекомендуемый тип | Избегать | Причина |
|---|---|---|---|
| Идентификаторы | `text` (CUID/UUIDv7) или `bigint` | случайный `uuid` (v4) на high-write таблицах | UUIDv4 фрагментирует страницы B-tree |
| Строки | `text` | `varchar(255)` без ограничений | В PostgreSQL `text` и `varchar` работают одинаково, лишние лимиты мешают миграциям |
| Даты и время | `timestamptz` | `timestamp` | `timestamp` без таймзоны приводит к рассинхронизации серверов |
| Деньги и баланс | `numeric(10,2)` / `integer` (в центах) | `float` / `real` | Числа с плавающей точкой дают погрешность округления |
| Булевы флаги | `boolean` | `varchar`, `int` | Память и читаемость |

---

## 3. Частые шаблоны оптимизации

### Порядок полей в составном индексе (Composite Index)
**Правило:** сначала колонки для точного совпадения (`=`), затем колонки для диапазонов (`>`, `<`, `BETWEEN`):
```sql
-- Эффективно для: WHERE status = 'pending' AND created_at > '2026-01-01'
CREATE INDEX idx_tasks_status_created ON "ConversionTask" (status, "createdAt");
```

### Частичный индекс (Partial Index)
Индексирует только активные строки, экономит память и диск:
```sql
-- Индексируем email только для неудаленных пользователей
CREATE UNIQUE INDEX idx_users_active_email ON "User" (email) WHERE "deletedAt" IS NULL;
```

### Курсорная пагинация (Keyset / Cursor Pagination)
Сложность $O(1)$ в отличие от $O(n)$ у `OFFSET`:
```sql
SELECT * FROM "ConversionTask" 
WHERE id > $last_id 
ORDER BY id 
LIMIT 20;
```

---

## 4. Диагностика узких мест

### Поиск внешних ключей без индексов
Отсутствие индексов на FK вызывает `table scan` при каскадном удалении или join:
```sql
SELECT conrelid::regclass, a.attname
FROM pg_constraint c
JOIN pg_attribute a ON a.attrelid = c.conrelid AND a.attnum = ANY(c.conkey)
WHERE c.contype = 'f'
  AND NOT EXISTS (
    SELECT 1 FROM pg_index i
    WHERE i.indrelid = c.conrelid AND a.attnum = ANY(i.indkey)
  );
```

### Анализ плана выполнения
```sql
EXPLAIN (ANALYZE, BUFFERS) 
SELECT * FROM "ConversionTask" WHERE "userId" = 'usr_123' ORDER BY "createdAt" DESC LIMIT 10;
```
Обращать внимание на:
- `Seq Scan` на больших таблицах (требуется индекс).
- Разницу между `Rows Planned` и `Rows Actual` (устаревшая статистика `ANALYZE`).

---

## 5. Конфигурация пула и таймаутов

```sql
-- Защита от зависших транзакций
ALTER SYSTEM SET idle_in_transaction_session_timeout = '30s';
ALTER SYSTEM SET statement_timeout = '30s';
```

