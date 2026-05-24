# Code Review — Phase 2: Backend API — Справочник видов работ

## 🔴 Critical

None

## 🟡 High

- **Race condition in create/update**: `findByName` → `create` is non-atomic. Two concurrent requests could pass the uniqueness check simultaneously and both insert. Should use Prisma `upsert` or database unique constraint (already present in schema). The unique constraint on `name` in Prisma schema will catch this at DB level, but error handling is missing for Prisma P2002 unique constraint violation — currently throws generic 500.
- **Missing @IsUUID on route params**: `@Param("id") id: string` has no validation. Malformed IDs cause Prisma P2023 (invalid CUID) → unhandled 500.

## 🟢 Medium

- **findById called twice in remove**: Controller calls `findById` then `service.remove`. Could be reduced to a single `delete` with try/catch for P2025 (record not found).
- **No pagination on findAll**: Large directories of work types will return unbounded arrays.
- **Missing API versioning**: No `/api/v1/` prefix.

## ℹ️ Info

- Controller/service separation is clean.
- DTO validation with class-validator is correct.
- `hasLogs` check correctly prevents deletion of used work types.
- `@HttpCode(HttpStatus.NO_CONTENT)` on DELETE is correct REST semantics.