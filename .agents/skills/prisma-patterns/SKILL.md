---
name: prisma-patterns
description: >-
  Prisma ORM patterns for TypeScript backends — schema design, query optimization, transactions,
  pagination, and critical traps like updateMany returning count not records, $transaction timeouts,
  migrate dev resetting the DB, @updatedAt skipped on bulk writes, and connection pool exhaustion.
  Use when writing a Prisma schema or query, or debugging transactions, migrations, or database queries.
metadata:
  origin: ECC
---

# Prisma Patterns

Production patterns and non-obvious traps for Prisma ORM in TypeScript backends.

> **Check your version before applying patterns.** The Prisma API surface has evolved across major releases:
>
> ```bash
> npx prisma --version
> ```
>
> Notable API differences across versions:
> - `relationJoins` can load relations via JOIN rather than separate queries, but may cause row explosion on large 1:N relations or deep `include` — benchmark both approaches
> - `omit` field modifier and `prisma.$extends` Client Extensions API were added
> - **Newer installs**: the package may be named `prisma` instead of `@prisma/client`; `PrismaClient` may require a driver adapter (e.g. `@prisma/adapter-pg`); `datasource.url` may live in `prisma.config.ts` instead of `schema.prisma`
> - CLI commands (`migrate dev`, `migrate deploy`, `generate`) are unchanged across versions

## When to Activate

- Designing or modifying Prisma schema models and relations (`packages/infrastructure/prisma/schema.prisma`)
- Writing queries, transactions, or pagination logic
- Using `updateMany`, `deleteMany`, or any bulk operation
- Running or planning database migrations
- Configuring connection pools in services and workers
- Implementing soft delete or multi-tenant row filtering

## Core Concepts

### ID Strategy

| Strategy | Use When | Avoid When |
|---|---|---|
| `@default(cuid())` | Default choice — URL-safe, sortable, no collisions | Sequential IDs needed for external systems |
| `@default(uuid())` | Interoperability with non-Prisma systems required | High-write tables (random UUIDs fragment B-tree indexes) |
| `@default(autoincrement())` | Internal join tables, audit logs | Public-facing IDs (exposes record count) |

### Schema Defaults

```prisma
model User {
  id        String    @id @default(cuid())
  email     String    @unique  // @unique already creates an index — no @@index needed
  name      String?
  role      Role      @default(USER)
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  deletedAt DateTime?

  @@index([createdAt])
  @@index([deletedAt, createdAt]) // composite for soft-delete + sort queries
}
```

- Add `@@index` on every foreign key and column used in `WHERE` or `ORDER BY`.
- Declare `deletedAt DateTime?` upfront when soft delete is a foreseeable requirement.
- `updatedAt @updatedAt` is set automatically by Prisma on `update` and `upsert` only (skipped on `updateMany`).

### `include` vs `select`

| | `include` | `select` |
|---|---|---|
| Returns | All scalar fields + specified relations | Only specified fields |
| Use when | You need most fields plus a relation | Hot paths, large tables, avoiding over-fetch |
| Performance | May over-fetch on wide tables | Minimal payload, faster on large datasets |

```ts
// include — all columns + relation
const user = await prisma.user.findUnique({
  where: { id },
  include: { conversions: { select: { id: true, status: true } } },
});

// select — explicit allowlist
const user = await prisma.user.findUnique({
  where: { id },
  select: { id: true, email: true, role: true },
});
```

Never return raw Prisma entities from API responses — map to response DTOs to control exposed fields.

### Transaction Form Selection

| Situation | Use |
|---|---|
| Independent operations, no inter-dependency | Array form |
| Later step depends on earlier result | Interactive form |
| External calls (email, S3, Stripe HTTP) | Outside transaction entirely |

```ts
// Array form — batched in one round trip
const [user, task] = await prisma.$transaction([
  prisma.user.update({ where: { id }, data: { balance: { decrement: 1 } } }),
  prisma.conversionTask.create({ data: { userId: id, status: 'PENDING' } }),
]);

// Interactive form — use tx client only, never the outer prisma client
const task = await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUniqueOrThrow({ where: { id } });
  if (user.balance < 1) throw new Error('Insufficient balance');
  await tx.user.update({ where: { id }, data: { balance: { decrement: 1 } } });
  return tx.conversionTask.create({ data: { userId: user.id, status: 'PENDING' } });
});
```

### PrismaClient Singleton

Each `PrismaClient` instance opens its own connection pool. Instantiate once.

```ts
import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
```

The `globalThis` pattern prevents duplicate instances during hot reload.

### N+1 Problem

Loading relations inside a loop issues one query per row.

```ts
// BAD: N+1 — one extra query per item
const users = await prisma.user.findMany();
for (const user of users) {
  const tasks = await prisma.conversionTask.findMany({ where: { userId: user.id } });
}

// GOOD: single query
const users = await prisma.user.findMany({ include: { conversions: true } });
```

---

## Code Examples

### Cursor Pagination (preferred for feeds and large datasets)

```ts
async function getTasks(cursor?: string, limit = 20) {
  const items = await prisma.conversionTask.findMany({
    orderBy: [
      { createdAt: 'desc' },
      { id: 'desc' }, // secondary sort prevents unstable pagination on duplicate timestamps
    ],
    take: limit + 1,
    ...(cursor && { cursor: { id: cursor }, skip: 1 }),
  });

  const hasNextPage = items.length > limit;
  if (hasNextPage) items.pop();

  return { items, nextCursor: hasNextPage ? items[items.length - 1].id : null };
}
```

Fetch `limit + 1` and pop — canonical way to detect `hasNextPage` without an extra count query.

### Error Handling

```ts
import { Prisma } from '@prisma/client';

try {
  await prisma.user.create({ data: { email } });
} catch (e) {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === 'P2002') throw new ConflictException('Email already exists');
    if (e.code === 'P2025') throw new NotFoundException('Record not found');
    if (e.code === 'P2003') throw new BadRequestException('Referenced record does not exist');
  }
  throw e;
}
```

Common codes: `P2002` unique violation · `P2025` not found · `P2003` foreign key violation.

---

## Anti-Patterns

### `updateMany` returns a count, not records
```ts
// BAD: result is { count: 2 } — users[0] is undefined
const users = await prisma.user.updateMany({ where: { role: 'GUEST' }, data: { role: 'USER' } });

// GOOD: capture IDs first, then update
const targets = await prisma.user.findMany({
  where: { role: 'GUEST' },
  select: { id: true },
});
const ids = targets.map((u) => u.id);
await prisma.user.updateMany({ where: { id: { in: ids } }, data: { role: 'USER' } });
```

### `$transaction` interactive form times out after 5 seconds
Never place external network calls (email, SES, S3 uploads, Stripe) inside a database transaction:
```ts
// BAD: external call inside transaction exceeds 5s default
await prisma.$transaction(async (tx) => {
  const user = await tx.user.findUniqueOrThrow({ where: { id } });
  await sendEmail(user.email); // external call!
  await tx.user.update({ where: { id }, data: { emailSent: true } });
});

// GOOD: external calls outside transaction
const user = await prisma.user.findUniqueOrThrow({ where: { id } });
await sendEmail(user.email);
await prisma.user.update({ where: { id }, data: { emailSent: true } });
```

### `migrate dev` can reset the database
```bash
# NEVER on shared dev, staging, or production:
npx prisma migrate dev

# SAFE for staging and production:
npx prisma migrate deploy
```

### `@updatedAt` does not fire on `updateMany`
```ts
// BAD: updatedAt stays at old value
await prisma.post.updateMany({ where: { authorId }, data: { published: true } });

// GOOD: explicitly update timestamp
await prisma.post.updateMany({
  where: { authorId },
  data: { published: true, updatedAt: new Date() },
});
```

### Soft delete + `findUniqueOrThrow` leaks deleted records
`findUniqueOrThrow` requires a unique constraint field in `where`. Use `findFirstOrThrow` when filtering with `deletedAt: null`.

---

## Best Practices

| Rule | Reason |
|---|---|
| `migrate deploy` in CI/CD, `migrate dev` only locally | `migrate dev` can reset the DB on drift |
| Map entities to response DTOs | Prevents leaking internal fields and hashes |
| Catch `PrismaClientKnownRequestError` at service boundary | Translate to NestJS HTTP exceptions |
| Set `updatedAt: new Date()` manually in `updateMany` | `@updatedAt` skips bulk writes |
| Always provide `where` on `deleteMany` | Prevents accidental table wipe |

