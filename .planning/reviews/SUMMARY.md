# Code Review Summary — All Phases

## Critical Findings

| Phase | Issue | Impact |
|-------|-------|--------|
| 02/03 | No `@Param` validation — malformed IDs cause Prisma P2023 → 500 | Unhandled errors, poor UX |
| 06 | DB port exposed externally in docker-compose.yml | Security risk in production |
| 06 | No healthcheck endpoint | Orchestration cannot detect failures |
| 06 | nginx does not proxy API calls | Breaks if frontend/API on different hosts |

## High Findings

| Phase | Issue | Recommendation |
|-------|-------|----------------|
| 02 | Race condition in create — non-atomic uniqueness check | Use Prisma `upsert` or catch P2002 |
| 03 | Unvalidated `sort` param passed to Prisma orderBy | Whitelist allowed sort fields |
| 03 | `new Date()` on unvalidated date strings | Validate ISO format before constructing Date |
| 05 | Search triggers API on every keystroke | Add 300ms debounce |
| 06 | CORS allows all origins | Restrict to known frontend origins |
| 06 | No rate limiting | Add express-rate-limit or NestJS throttler |

## Medium Findings

- No pagination on any list endpoint (Phase 2, 3)
- Dialog missing Escape key handler and focus trap (Phase 4, 5)
- Missing `.dockerignore` inflates build context (Phase 1, 6)
- No max length on form fields (Phase 4, 5)
- Table not horizontally scrollable on mobile (Phase 5)

## Overall Assessment

**Quality:** Good — clean architecture, proper separation of concerns, DTO validation, React Hook Form + Zod integration.
**Security:** Acceptable for internal tool, needs hardening for production (CORS, rate limiting, DB exposure).
**Production readiness:** Needs healthchecks, nginx proxy config, `.dockerignore`, and input validation on route params before deployment.