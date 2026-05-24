# AGENTS.md — Журнал работ на строительном объекте

## Workflow

Этот проект использует GSD (get-shit-done) workflow.

- `.planning/PROJECT.md` — контекст проекта
- `.planning/REQUIREMENTS.md` — требования с REQ-ID
- `.planning/ROADMAP.md` — фазы разработки
- `.planning/STATE.md` — текущее состояние

## Команды GSD

- `$gsd-plan-phase N` — запланировать фазу N
- `$gsd-execute-phase N` — выполнить фазу N
- `$gsd-check-todos` — проверить открытые задачи

## Технические стандарты

- Monorepo с `apps/web` (React+Vite) и `apps/api` (NestJS+Prisma)
- TypeScript повсюду
- Валидация форм через Zod + React Hook Form
- Компоненты UI через shadcn/ui
- Стилизация через Tailwind CSS
- API: REST с DTO-валидацией
- База данных: PostgreSQL через Prisma ORM
- Запуск через `docker-compose up`

## Ограничения

- Без авторизации и ролей
- Без нескольких объектов
- Без экспорта и аналитики
- Без мобильной версии