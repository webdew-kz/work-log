# ROADMAP — Журнал работ на строительном объекте

## Phase 1: Скелет проекта и DevOps

**Goal:** Подготовить monorepo, Docker Compose, Prisma schema, seed-данные.

**Requirements:** REQ-019, REQ-020, REQ-021, REQ-022, REQ-023, REQ-024, REQ-025

**Deliverables:**
- Корневой `package.json` ( workspaces )
- `apps/api/` — NestJS + Prisma + PostgreSQL
- `apps/web/` — React + Vite + TypeScript
- `docker-compose.yml` для API + PostgreSQL
- `README.md` и `.env.example`
- Prisma schema с `WorkLog` и `WorkType`
- Seed-скрипт с видами работ

**UI hint:** no

---

## Phase 2: Backend API — Справочник видов работ

**Goal:** Реализовать REST CRUD для WorkType с защитой от удаления используемых.

**Requirements:** REQ-001, REQ-002, REQ-003, REQ-004, REQ-005

**Deliverables:**
- `GET /work-types` — список
- `POST /work-types` — создание (валидация уникальности)
- `PATCH /work-types/:id` — обновление
- `DELETE /work-types/:id` — удаление с проверкой использования

---

## Phase 3: Backend API — Журнал работ

**Goal:** Реализовать REST CRUD для WorkLog.

**Requirements:** REQ-007, REQ-008, REQ-009, REQ-010, REQ-012

**Deliverables:**
- `GET /work-logs` — список с include workType
- `POST /work-logs` — создание
- `PATCH /work-logs/:id` — обновление
- `DELETE /work-logs/:id` — удаление
- Валидация DTO через Zod/class-validator

---

## Phase 4: Frontend — Справочник видов работ

**Goal:** UI вкладки справочника с CRUD.

**Requirements:** REQ-001, REQ-002, REQ-003, REQ-004, REQ-005, REQ-006

**Deliverables:**
- Вкладка «Справочник видов работ»
- Таблица, форма добавления/редактирования
- Модал подтверждения удаления
- Валидация формы через Zod + React Hook Form
- Toast-уведомления

**UI hint:** yes

---

## Phase 5: Frontend — Журнал работ

**Goal:** UI вкладки журнала с CRUD, поиском, сортировкой, фильтрацией.

**Requirements:** REQ-007–REQ-018

**Deliverables:**
- Вкладка «Журнал работ»
- Таблица с сортировкой по колонкам
- Глобальный поиск
- Фильтры по полям
- Форма создания/редактирования (select с видами работ)
- Модал подтверждения удаления
- Состояния загрузки, ошибки, пустого списка

**UI hint:** yes

---

## Phase 6: Интеграция и финальная проверка

**Goal:** Протестировать полный флоу через Docker Compose.

**Requirements:** все

**Deliverables:**
- Проверка запуска `docker-compose up`
- E2E smoke test: добавить виды работ, создать записи, отредактировать, удалить
- Финальный README