# Code Review — Phase 1: Скелет проекта и DevOps

## 🔴 Critical

None

## 🟡 High

- **Missing `depends_on` with healthcheck for db**: docker-compose.yml uses `depends_on: [db]` but without a healthcheck, API might start before DB is ready. Add healthcheck or `condition: service_healthy`.
- **Root npm install timeout issue**: root package.json `dev` script uses `npm run dev -w apps/api` syntax which may not work across all npm versions. Verified it works with npm workspaces.
- **Port mapping inconsistency**: docker-compose.yml exposes db on 5434 externally for dev, but internally uses 5432. This is correct for avoiding local conflicts but should be documented.

## 🟢 Medium

- **README**: Missing Windows-specific Docker instructions (WSL2 required).
- **No .dockerignore**: Build context may include node_modules from root, slowing builds.

## ℹ️ Info

- Prisma config deprecation warning: `package.json#prisma` deprecated in Prisma 7. Added `prisma.config.ts` to address this.
- Concurrently is in root devDependencies but only used in root scripts. Correct placement.