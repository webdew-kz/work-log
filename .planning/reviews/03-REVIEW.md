# Code Review — Phase 3: Backend API — Журнал работ

## 🔴 Critical

- **@Param("id") has no validation**: Same issue as Phase 2. Malformed IDs cause unhandled Prisma P2023 → 500 error.

## 🟡 High

- **Potential SQL injection in sorting**: `sort` query param is passed directly to Prisma orderBy. While Prisma itself prevents SQL injection, passing arbitrary strings could cause runtime errors. Should whitelist allowed sort fields: `["date", "volume", "executor", "workType", "createdAt"]`.
- **Date string parsing without validation**: `new Date(params.dateFrom)` / `new Date(params.dateTo)` can produce `Invalid Date` which Prisma may handle poorly. Should validate ISO date strings before constructing Date objects.
- **Missing pagination**: `findAll` returns unbounded result set. Risk of memory exhaustion with large datasets.

## 🟢 Medium

- **Search `mode: "insensitive"` with PostgreSQL**: Works correctly with PostgreSQL via Prisma, but requires `citext` extension awareness. Current Prisma schema does not define `@db.Citext` — default `mode: "insensitive"` works for ASCII but may behave unexpectedly with Cyrillic depending on DB locale.
- **WorkLogDto date field**: `@IsDateString()` validates ISO 8601 format but does not prevent future dates. Should consider `@MaxDate(new Date())` for business rule validation.

## ℹ️ Info

- Proper `include: { workType: true }` on all CRUD operations — good.
- Filter composition in `findAll` is clean and extensible.
- Correct handling of `204 NO_CONTENT` for deletions.