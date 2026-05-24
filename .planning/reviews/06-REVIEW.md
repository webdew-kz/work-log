# Code Review — Phase 6: Интеграция и финальная проверка

## 🔴 Critical

- **Docker Compose db port mapping is host-dependent**: Mapped to `5434:5432` for dev but `5432:5432` for production compose (db container). The production `docker-compose.yml` should use internal port `5432` only (no host mapping needed for db) to avoid port conflicts on deployment servers. Current compose exposes db externally which is a security risk in production.
- **Web Dockerfile build-time env var**: `ARG VITE_API_URL` is set but not passed to build command. In multi-stage Dockerfile, `ENV VITE_API_URL=${VITE_API_URL}` sets it during build stage which Vite picks up. Verified correct. ✓
- **API Dockerfile seed on startup**: `npx prisma db seed || true` — seed runs on every container restart, which is idempotent (uses `upsert`) but adds ~1s to startup. Consider running seed only on first migration.

## 🟡 High

- **No healthcheck endpoints**: Neither API nor DB has healthcheck configuration in docker-compose. Kubernetes or Docker Swarm orchestration would not detect API failures correctly. Add a `GET /api/health` endpoint and configure `healthcheck` in compose.
- **Frontend nginx does not proxy API**: Frontend runs on nginx serving static files. API calls from browser go directly to `localhost:3001`. This breaks if frontend and API are on different hosts. Should add nginx reverse proxy for `/api` to API container, or document that both must be on same host.
- **No rate limiting**: API has no rate limiting. Could be abused with rapid automated requests.
- **CORS is wide open**: `app.enableCors()` allows all origins. In production, should restrict to known frontend origins.

## 🟢 Medium

- **Missing .dockerignore**: `node_modules` from root and apps get copied into Docker build context, inflating build time and image size.
- **API logs to console only**: No structured logging or log rotation configured.
- **No graceful shutdown**: NestJS does handle SIGTERM but container stop timeout may be too short (Docker default 10s).

## ℹ️ Info

- `docker-compose up --build` verified working with PostgreSQL 16.
- `npm run db:seed` produces correct seed data.
- README instructions are accurate for both dev and production modes.