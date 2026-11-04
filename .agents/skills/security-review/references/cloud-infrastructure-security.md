# Cloud & Infrastructure Security Reference

Полный чеклист и руководство по безопасности облачной инфраструктуры доступны в самостоятельном воркспейс-скилле:
👉 **[cloud-infrastructure-security](../cloud-infrastructure-security/SKILL.md)**

### Краткий состав руководства:
1. **IAM & Access Control:** Наименьшие привилегии, роли OIDC для GitHub Actions, запрет root в проде.
2. **Secrets & KMS:** Хранение в AWS Secrets Manager (EU регион), шифрование SSE-KMS.
3. **Network & Storage:** Изоляция PostgreSQL в приватной VPC, 100% Block Public Access в S3.
4. **Logging & Monitoring:** CloudWatch без PII и содержимого файлов, retention 90+ дней.
5. **CI/CD:** `pnpm audit`, замороженный локфайл, OIDC без долгоживущих ключей.
6. **Edge & WAF:** Cloudflare WAF (OWASP), защита от DDoS/ботов, строгие заголовки HSTS/CSP.
7. **Backups:** Автоматические бэкапы RDS (30 дней), жизненный цикл файлов S3 (TTL очистки).

