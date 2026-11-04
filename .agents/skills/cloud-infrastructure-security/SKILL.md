---
name: cloud-infrastructure-security
description: >-
  Use this skill when deploying to cloud platforms, configuring infrastructure,
  managing IAM policies, setting up logging/monitoring, or implementing CI/CD pipelines.
  Provides cloud security checklist aligned with best practices.
---

# Cloud & Infrastructure Security Skill

This skill ensures cloud infrastructure, CI/CD pipelines, and deployment configurations follow security best practices and comply with industry standards and strict EU-region requirements.

## When to Activate

- Deploying applications to cloud platforms (AWS, Vercel, Railway, Cloudflare)
- Configuring IAM roles and permissions
- Setting up CI/CD pipelines (GitHub Actions)
- Implementing infrastructure as code (Terraform, CloudFormation)
- Configuring logging and monitoring (CloudWatch)
- Managing secrets in cloud environments (Secrets Manager, KMS)
- Setting up CDN and edge security (Cloudflare)
- Implementing disaster recovery and backup strategies

## Cloud Security Checklist

### 1. IAM & Access Control

#### Principle of Least Privilege

```yaml
# PASS: CORRECT: Minimal permissions with specific resources
iam_role:
  permissions:
    - s3:GetObject
    - s3:PutObject
    - s3:DeleteObject
  resources:
    - arn:aws:s3:::doc-converter-storage-eu/*  # Specific bucket only

# FAIL: WRONG: Overly broad permissions
iam_role:
  permissions:
    - s3:*
  resources:
    - "*"
```

#### Multi-Factor Authentication (MFA)

```bash
# ALWAYS enable MFA for root/admin accounts
aws iam enable-mfa-device \
  --user-name admin \
  --serial-number arn:aws:iam::123456789:mfa/admin \
  --authentication-code1 123456 \
  --authentication-code2 789012
```

#### Verification Steps

- [ ] No root account usage in production
- [ ] MFA enabled for all privileged accounts
- [ ] Service accounts use IAM roles, not long-lived access keys
- [ ] IAM policies follow least privilege
- [ ] Regular access reviews conducted
- [ ] Unused credentials rotated or removed

### 2. Secrets Management & KMS

#### Cloud Secrets Managers (AWS EU Region)

```typescript
// PASS: CORRECT: Use AWS Secrets Manager in EU region
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({ region: 'eu-central-1' });
const response = await client.send(
  new GetSecretValueCommand({ SecretId: 'prod/doc-converter/api' })
);
const secrets = JSON.parse(response.SecretString!);

// FAIL: WRONG: Hardcoded in repository or stored without encryption
const apiKey = "sk-live-xxxxx";
```

#### Verification Steps

- [ ] All secrets stored in cloud secrets manager (AWS Secrets Manager) in EU region
- [ ] Automatic rotation configured for database credentials
- [ ] Master keys managed via AWS KMS (SSE-KMS for S3)
- [ ] No secrets in code, logs, or error messages
- [ ] Audit logging enabled for secret and KMS key access

### 3. Network & Storage Security

#### Private VPC and Storage Isolation

```terraform
# PASS: CORRECT: Private RDS instance without public access
resource "aws_db_instance" "postgres" {
  allocated_storage       = 20
  engine                  = "postgres"
  publicly_accessible     = false
  vpc_security_group_ids  = [aws_security_group.db.id]
  deletion_protection     = true
  backup_retention_period = 30
}

# FAIL: WRONG: Public RDS instance
resource "aws_db_instance" "bad" {
  publicly_accessible = true
}
```

#### S3 Bucket Security (Strict EU Jurisdiction & Private by Default)

```bash
# PASS: CORRECT: Private bucket, Block Public Access enabled, SSE-KMS
aws s3api put-public-access-block \
  --bucket doc-converter-eu-files \
  --public-access-block-configuration "BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true"
```

#### Verification Steps

- [ ] Database (PostgreSQL) is NOT publicly accessible, sits in private VPC subnet
- [ ] S3 buckets have Block Public Access enabled 100%
- [ ] S3 bucket encryption configured with SSE-KMS
- [ ] Strict EU region placement (`eu-central-1` / `eu-west-1`)
- [ ] Security groups restrict traffic to necessary ports only (443 inbound for ALB)

### 4. Logging & Monitoring

#### CloudWatch Logs without PII

```typescript
// PASS: CORRECT: Log security events without PII or user document contents
import { CloudWatchLogsClient, PutLogEventsCommand } from '@aws-sdk/client-cloudwatch-logs';

const logSecurityEvent = async (event: { type: string; userId: string; ip: string; result: string }) => {
  // Never log passwords, tokens, full email, or file bytes
};
```

#### Verification Steps

- [ ] CloudWatch logging enabled for API, Worker, and RDS
- [ ] Failed authentication and rate-limit violations logged
- [ ] Log retention configured (at least 90 days for audit and compliance)
- [ ] Alarms configured for abnormal error spikes and unauthorized access
- [ ] Zero PII and zero document payload data in logs

### 5. CI/CD Pipeline Security

#### Secure GitHub Actions Workflow

```yaml
# PASS: CORRECT: Secure workflow using OIDC and pnpm
name: CI/CD Pipeline

on:
  push:
    branches: [main]

jobs:
  audit-and-deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write # For AWS OIDC

    steps:
      - uses: actions/checkout@v4

      - name: Install pnpm
        uses: pnpm/action-setup@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Audit dependencies
        run: pnpm audit --audit-level=high

      - name: Configure AWS credentials (OIDC)
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/GitHubActionsDeployRole
          aws-region: eu-central-1
```

#### Verification Steps

- [ ] OIDC used instead of static long-lived AWS Access Keys
- [ ] Lockfile (`pnpm-lock.yaml`) enforced in CI (`pnpm install --frozen-lockfile`)
- [ ] `pnpm audit` configured to fail on high/critical vulnerabilities
- [ ] Branch protection rules enabled on `main`
- [ ] Required reviews before merging pull requests

### 6. Cloudflare & Edge Protection

#### Edge Security Configuration

```typescript
// PASS: CORRECT: Edge security headers in Cloudflare Workers / Next.js middleware
const securityHeaders = {
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
};
```

#### Verification Steps

- [ ] Cloudflare WAF active with OWASP Managed Core Ruleset
- [ ] DDoS and Bot Fight mode enabled
- [ ] Strict SSL/TLS (Full/Strict) mode enforced
- [ ] Edge rate limiting for `/api/auth/*` and upload endpoints
- [ ] Modern security headers injected

### 7. Backup & Disaster Recovery

#### Automated Backups & Retention

- [ ] Automated daily RDS backups with point-in-time recovery (30 days retention)
- [ ] S3 versioning and lifecycle policies for automated purge of expired conversions (TTL 1-24 hours)
- [ ] Deletion protection enabled on production databases
- [ ] Disaster recovery and backup restoration procedure documented and tested

---

## Pre-Deployment Cloud Security Checklist

Before ANY production cloud deployment:

- [ ] **Jurisdiction**: All compute, database, and storage strictly in the **EU Region**
- [ ] **IAM**: Root account inactive, MFA active, least privilege roles via OIDC
- [ ] **Secrets**: Stored in AWS Secrets Manager / KMS, zero secrets in git repository
- [ ] **Network**: Private VPC, RDS not public, security groups locked down
- [ ] **Storage**: S3 Block Public Access enabled, SSE-KMS active, TTL auto-purge
- [ ] **Logging**: Centralized CloudWatch logging with alarms, no PII
- [ ] **CI/CD**: `pnpm audit` clean, frozen lockfile, signed commits
- [ ] **WAF & CDN**: Cloudflare WAF, DDoS protection, security headers
- [ ] **Backups**: Automated daily backups with tested restoration plan

