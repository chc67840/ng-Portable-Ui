# Edge Cases & Jangle Situations

## Hallucinated APIs or imports
- Symptom: unknown symbol or package appears.
- Action: Go to Definition. If missing, reject; ask Chat to replace with concrete, installed dependencies.

## Angular change detection pitfalls
- Prefer signals/computed; use trackBy on *ngFor; avoid excessive async pipes in deep trees.

## EF Core N+1 / slow queries
- Project to DTOs, Include where needed, AsNoTracking for reads, parameterize raw SQL, inspect generated SQL.

## npm supply-chain worries
- Use npm ci with lockfiles; inspect postinstall scripts; run `npm audit --production`; pin versions for critical deps.

## Race conditions / concurrency
- .NET: prefer CancellationTokens, use SemaphoreSlim for critical sections; avoid static shared mutable state.
- Frontend: debounce/throttle repetitive requests; ensure idempotent service methods.

## Logging & telemetry
- Add correlation IDs; log at boundaries; avoid PII in logs.

## Feature flags / toggles
- Gate risky features and keep a kill-switch for quick rollback.
