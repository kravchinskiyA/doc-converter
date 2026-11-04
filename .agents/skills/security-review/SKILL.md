---
name: security-review
description: Use this skill when adding authentication, handling user input, working with secrets, creating API endpoints, or implementing payment/sensitive features. Provides comprehensive security checklist and patterns.
metadata:
  origin: ECC
---

# Security Review Skill

This skill ensures all code follows security best practices and identifies potential vulnerabilities.

## When to Activate

- Implementing authentication or authorization
- Handling user input or file uploads
- Creating new API endpoints
- Working with secrets or credentials
- Implementing payment features (Stripe)
- Storing or transmitting sensitive data
- Integrating third-party APIs

## Security Checklist

### 1. Secrets Management

#### FAIL: NEVER Do This
```typescript
const apiKey = "sk-proj-xxxxx"  // Hardcoded secret
const dbPassword = "password123" // In source code
```

#### PASS: ALWAYS Do This
```typescript
const apiKey = process.env.OPENAI_API_KEY
const dbUrl = process.env.DATABASE_URL

// Verify secrets exist
if (!apiKey) {
  throw new Error('OPENAI_API_KEY not configured')
}
```

#### Verification Steps
- [ ] No hardcoded API keys, tokens, or passwords
- [ ] All secrets in environment variables
- [ ] `.env.local` / `.env` in .gitignore
- [ ] No secrets in git history
- [ ] Production secrets managed via KMS / secure vault

### 2. Input Validation

#### Always Validate User Input (Zod)
```typescript
import { z } from 'zod'

// Define validation schema
const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().min(1).max(100),
  age: z.number().int().min(0).max(150)
})

// Validate before processing
export async function createUser(input: unknown) {
  try {
    const validated = CreateUserSchema.parse(input)
    return await db.users.create(validated)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.issues }
    }
    throw error
  }
}
```

#### File Upload Validation
```typescript
function validateFileUpload(file: File) {
  // Size check
  const maxSize = 50 * 1024 * 1024 // e.g. 50MB
  if (file.size > maxSize) {
    throw new Error('File too large')
  }

  // Whitelist MIME type check
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png']
  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type')
  }

  // Extension check
  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png']
  const extension = file.name.toLowerCase().match(/\.[^.]+$/)?.[0]
  if (!extension || !allowedExtensions.includes(extension)) {
    throw new Error('Invalid file extension')
  }

  return true
}
```

#### Verification Steps
- [ ] All user inputs validated with schemas (Zod)
- [ ] File uploads restricted (size, type, extension) and scanned with ClamAV before processing
- [ ] No direct use of user input in queries
- [ ] Whitelist validation (not blacklist)
- [ ] Error messages don't leak sensitive info

### 3. SQL Injection Prevention

#### FAIL: NEVER Concatenate SQL
```typescript
// DANGEROUS - SQL Injection vulnerability
const query = `SELECT * FROM users WHERE email = '${userEmail}'`
await db.query(query)
```

#### PASS: ALWAYS Use Parameterized Queries or ORM (Prisma)
```typescript
// Safe - ORM query (Prisma)
const user = await prisma.user.findUnique({
  where: { email: userEmail }
})

// Safe - parameterized raw query
await prisma.$queryRaw`SELECT * FROM "User" WHERE email = ${userEmail}`
```

#### Verification Steps
- [ ] All database queries use parameterized queries or Prisma methods
- [ ] No string concatenation in SQL
- [ ] ORM used correctly without unescaped raw queries

### 4. Authentication & Authorization

#### JWT / Session Token Handling
```typescript
// FAIL: WRONG: localStorage (vulnerable to XSS)
localStorage.setItem('token', token)

// PASS: CORRECT: httpOnly cookies
res.setHeader('Set-Cookie',
  `token=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=3600`)
```

#### Authorization Checks
```typescript
export async function deleteUser(userId: string, requesterId: string) {
  // ALWAYS verify authorization first
  const requester = await db.users.findUnique({
    where: { id: requesterId }
  })

  if (requester.role !== 'admin') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // Proceed with deletion
  await db.users.delete({ where: { id: userId } })
}
```

#### Verification Steps
- [ ] Tokens stored in httpOnly, Secure, SameSite cookies
- [ ] Authorization checks before sensitive operations
- [ ] Role-based access control (RBAC) implemented
- [ ] Session management secure and expiring per security policy

### 5. XSS Prevention

#### Sanitize HTML
```typescript
import DOMPurify from 'isomorphic-dompurify'

// ALWAYS sanitize user-provided HTML
function renderUserContent(html: string) {
  const clean = DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p'],
    ALLOWED_ATTR: []
  })
  return <div dangerouslySetInnerHTML={{ __html: clean }} />
}
```

#### Content Security Policy
```typescript
// next.config.js / middleware
const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      base-uri 'self';
      object-src 'none';
      frame-ancestors 'none';
      script-src 'self';
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: https:;
      font-src 'self';
      connect-src 'self' https://api.yourdomain.com;
    `.replace(/\s{2,}/g, ' ').trim()
  }
]
```

#### Verification Steps
- [ ] User-provided HTML sanitized
- [ ] CSP headers configured
- [ ] No unvalidated dynamic content rendering
- [ ] React's built-in XSS protection used

### 6. CSRF Protection

#### CSRF Tokens & SameSite Cookies
```typescript
res.setHeader('Set-Cookie',
  `session=${sessionId}; HttpOnly; Secure; SameSite=Strict; Path=/`)
```

#### Verification Steps
- [ ] CSRF tokens / double-submit headers on state-changing operations
- [ ] SameSite=Strict/Lax on all session cookies
- [ ] Origin / Referer header validation on API endpoints

### 7. Rate Limiting

#### API Rate Limiting (NestJS / Throttler)
```typescript
// NestJS Throttler configuration
@Throttle({ default: { limit: 100, ttl: 60000 } })
@Get('profile')
getProfile() { ... }
```

#### Verification Steps
- [ ] Rate limiting on all API endpoints
- [ ] Stricter limits on expensive operations (conversion, login, password reset)
- [ ] IP-based and user-based throttling configured

### 8. Sensitive Data Exposure

#### Logging
```typescript
// FAIL: WRONG: Logging sensitive data
console.log('User login:', { email, password })
console.log('Payment:', { cardNumber, cvv })

// PASS: CORRECT: Redact sensitive data (No PII)
console.log('User login:', { emailMasked: maskEmail(email), userId })
console.log('Payment:', { last4: card.last4, customerId })
```

#### Error Messages
```typescript
// FAIL: WRONG: Exposing internal details
catch (error) {
  return res.status(500).json({ error: error.message, stack: error.stack })
}

// PASS: CORRECT: Generic error messages for users
catch (error) {
  logger.error('Internal error', error)
  return res.status(500).json({ error: 'An unexpected error occurred' })
}
```

#### Verification Steps
- [ ] No passwords, tokens, API keys, or raw customer files in logs
- [ ] Error messages generic for client responses
- [ ] Detailed errors and stacks only in secure server logs
- [ ] No stack traces exposed to clients

### 9. Dependency Security

#### Verification Steps
- [ ] Dependencies up to date (`npm audit`, `pnpm audit`)
- [ ] No known high/critical vulnerabilities
- [ ] Lock files committed (`pnpm-lock.yaml`)
- [ ] CI/CD pipeline enforces audit checks

## Pre-Deployment Security Checklist

Before ANY production deployment or sensitive feature completion:

- [ ] **Secrets**: No hardcoded secrets, all in env vars / KMS
- [ ] **Input Validation**: All user inputs validated via Zod schemas
- [ ] **SQL Injection**: All queries use Prisma ORM or parameterized queries
- [ ] **XSS**: User content sanitized, CSP headers active
- [ ] **CSRF**: Protection and SameSite cookies configured
- [ ] **Authentication**: Better Auth / secure session handling in httpOnly cookies
- [ ] **Authorization**: RBAC checks in place for all administrative and user endpoints
- [ ] **Rate Limiting**: Throttler enabled on endpoints
- [ ] **Logging**: Zero PII (passwords, tokens, file content) in logs
- [ ] **Dependencies**: Clean audit (`pnpm audit`)
- [ ] **Jurisdiction**: All storage (S3) and processing strictly in EU region

## Related Skills & References

- **Cloud & Infrastructure Security**: Для проверки облачной инфраструктуры, IAM, S3, RDS, CI/CD и Cloudflare используйте скилл [cloud-infrastructure-security](../cloud-infrastructure-security/SKILL.md) ([краткий справочник](./references/cloud-infrastructure-security.md)).

