# Security Checklist

- Input validation and output encoding for each boundary.
- Auth: short-lived tokens, refresh flow, server-side checks.
- Secrets: never commit; load from env/KeyVault; rotate regularly.
- Dependencies: lockfile discipline; audit regularly.
- Browser: CSP headers, SameSite cookies, avoid inline scripts where possible.
