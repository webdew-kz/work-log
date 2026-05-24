# Журнал работ на строительном объекте

Веб-приложение для ведения ежедневного учёта выполненных работ на строительном объекте. Прораб или ответственный сотрудник может фиксировать дату, вид работ, объём и исполнителя через удобный интерфейс с поиском, сортировкой и фильтрацией.

## Возможности

- **Журнал работ** — создание, редактирование, удаление записей с подтверждением
- **Справочник видов работ** — управление справочником с защитой от удаления используемых записей
- **Поиск и фильтрация** — глобальный поиск, фильтры по дате, исполнителю, виду работ
- **Сортировка** — по всем колонкам таблицы с индикацией направления
- **Адаптивный дизайн** — таблицы на десктопе, компактные карточки на мобильных устройствах
- **Тёмная тема** — переключатель в шапке

## Стек технологий

### Frontend

| Технология | Назначение | Почему выбрана |
|---|---|---|
| **React 19** | UI-библиотека | Декларативный подход, обширная экосистема, оптимизированный рендеринг |
| **TypeScript** | Типизация | Статическая проверка типов на этапе сборки, автодополнение в IDE, надёжный рефакторинг |
| **Vite** | Сборщик | Мгновенный HMR, быстрая сборка production-бандла, минимальная конфигурация |
| **Tailwind CSS** | Стилизация | Utility-first подход, нет конфликта CSS, дизайн-система через конфиг |
| **shadcn/ui** | Компоненты | Копируемый код (не npm-зависимость), полный контроль над стилями, доступность |
| **React Hook Form + Zod** | Формы и валидация | Минимум ре-рендеров, декларативная схема валидации, TypeScript-first |
| **Lucide React** | Иконки | Единообразие, tree-shakeable, поддержка темной темы |

### Backend

| Технология | Назначение | Почему выбрана |
|---|---|---|
| **NestJS** | Фреймворк API | Модульная архитектура, декораторы, встроенная валидация, enterprise-паттерны |
| **TypeScript** | Типизация | Единый язык с frontend, строгая типизация контроллеров и сервисов |
| **Prisma ORM** | Работа с БД | Type-safe запросы, миграции, мощная система фильтрации, генерация типов |
| **PostgreSQL** | База данных | Надёжность, поддержка сложных запросов, `citext` для case-insensitive поиска |
| **class-validator** | DTO-валидация | Декларативная валидация через декораторы, интеграция с NestJS ValidationPipe |

### DevOps

| Технология | Назначение | Почему выбрана |
|---|---|---|
| **Docker Compose** | Оркестрация | Одна команда для запуска всего стека, изолированные сервисы, воспроизводимое окружение |
| **nginx** | Reverse proxy | Раздача статики, проксирование API, единая точка входа |

**Монорепозиторий (npm workspaces)** позволяет управлять frontend и backend в одном репозитории с единой установкой зависимостей и скриптами запуска.

## Структура проекта

```
├── apps/
│   ├── api/              # NestJS + Prisma + PostgreSQL
│   │   ├── prisma/
│   │   │   ├── schema.prisma    # Схема БД: WorkLog, WorkType
│   │   │   ├── seed.ts          # Seed-данные (6 видов работ)
│   │   │   └── migrations/
│   │   └── src/
│   │       ├── main.ts          # Точка входа, ValidationPipe, CORS
│   │       ├── app.module.ts    # Глобальный модуль
│   │       ├── prisma/          # PrismaService (lifecycle hooks)
│   │       ├── work-types/      # CRUD справочника + custom exceptions
│   │       └── work-logs/       # CRUD журнала + pagination + фильтрация
│   └── web/              # React + Vite + TypeScript
│       └── src/
│           ├── App.tsx          # Табы, ThemeToggle
│           ├── components/
│           │   ├── work-logs/   # WorkLogsPage, MobileCard, SortHeader
│           │   ├── work-types/  # WorkTypesPage
│           │   ├── shared/      # ErrorAlert, FormDialog, ConfirmDialog, ErrorBoundary, ThemeToggle
│           │   └── ui/          # Button, Dialog, Input, Label
│           ├── api/
│           │   └── client.ts    # API клиент: fetch + AbortController + ApiError
│           ├── hooks/
│           │   └── useDebounce.ts
│           └── lib/
│               └── utils.ts     # cn() — clsx + tailwind-merge
├── docker-compose.yml    # PostgreSQL + API + Web (nginx)
├── .env.example          # Пример переменных окружения
└── README.md             # Этот файл
```

## Быстрый старт (Docker Compose)

Подходит для демонстрации или production-развёртывания. Требуется только Docker.

```bash
# 1. Клонировать репозиторий
cd journal-work-construction

# 2. Скопировать .env
cp .env.example .env

# 3. Запустить все сервисы
docker-compose up --build
```

**После запуска:**

| Сервис | URL | Описание |
|---|---|---|
| Frontend | http://localhost | Веб-интерфейс |
| API | http://localhost:3001/api | REST API |
| Health | http://localhost:3001/api/health | Проверка работоспособности |
| PostgreSQL | localhost:5434 | База данных (порт проброшен для удобства) |

**Остановка:**

```bash
docker-compose down
# Или с удалением данных:
docker-compose down -v
```

## Разработка (Development)

### Требования

- Node.js 22+
- npm 10+
- Docker и Docker Compose (только для PostgreSQL)

### 1. Установка зависимостей

```bash
# Root зависимости (concurrently для параллельного запуска)
npm install

# API
npm install -w apps/api

# Web
npm install -w apps/web
```

### 2. Запуск PostgreSQL

```bash
docker-compose up db -d
```

PostgreSQL запустится на порту `5434` (внешний), внутри контейнера — стандартный `5432`.

### 3. Настройка окружения

```bash
cp .env.example .env
```

`.env` уже содержит корректные значения для локальной разработки:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5434/worklog?schema=public"
API_PORT=3001
VITE_API_URL=http://localhost:3001
```

### 4. Применение миграций и seed-данных

```bash
cd apps/api

# Сгенерировать Prisma Client
npx prisma generate

# Применить миграции
npx prisma migrate deploy

# Заполнить seed-данные (6 видов работ)
npx tsx prisma/seed.ts
```

### 5. Запуск серверов разработки

**Вариант А — одновременно (требуется concurrently из root):**

```bash
# Из корня проекта
npm run dev
```

**Вариант Б — отдельно (в двух терминалах):**

```bash
# Терминал 1 — API
cd apps/api
npx ts-node -r tsconfig-paths/register src/main.ts
```

```bash
# Терминал 2 — Web
cd apps/web
npx vite
```

**После запуска:**

| Сервис | URL |
|---|---|
| Frontend | http://localhost:5173 |
| API | http://localhost:3001/api |
| Health check | http://localhost:3001/api/health |

## API Endpoints

### Health check

- `GET /api/health` — проверка работоспособности API

### Справочник видов работ

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/api/work-types` | Список всех видов работ |
| `POST` | `/api/work-types` | Создать новый вид работ |
| `PATCH` | `/api/work-types/:id` | Обновить вид работ |
| `DELETE` | `/api/work-types/:id` | Удалить вид работ (запрещено, если используется) |

### Журнал работ

| Метод | Путь | Описание |
|---|---|---|
| `GET` | `/api/work-logs` | Список записей |
| `GET` | `/api/work-logs?search=...` | Поиск по тексту |
| `GET` | `/api/work-logs?workTypeId=...` | Фильтр по виду работ |
| `GET` | `/api/work-logs?executor=...` | Фильтр по исполнителю |
| `GET` | `/api/work-logs?dateFrom=YYYY-MM-DD&dateTo=YYYY-MM-DD` | Фильтр по дате |
| `GET` | `/api/work-logs?sort=date&order=asc` | Сортировка |
| `GET` | `/api/work-logs?page=1&limit=20` | Пагинация |
| `POST` | `/api/work-logs` | Создать запись |
| `PATCH` | `/api/work-logs/:id` | Обновить запись |
| `DELETE` | `/api/work-logs/:id` | Удалить запись |

### Параметры сортировки

Допустимые значения `sort`: `date`, `workType`, `volume`, `executor`, `createdAt`.  
Допустимые значения `order`: `asc`, `desc`.

## Модель данных

### WorkType (Вид работ)

| Поле | Тип | Ограничения |
|---|---|---|
| id | CUID | PK, автогенерация |
| name | string | Уникально, обязательно, max 100 символов |

### WorkLog (Запись журнала)

| Поле | Тип | Описание |
|---|---|---|
| id | CUID | PK, автогенерация |
| date | Date | Дата выполнения работ |
| volume | string | Объём с единицей измерения, max 100 символов |
| executor | string | ФИО исполнителя, max 200 символов |
| workTypeId | CUID | FK → WorkType |

**Связь:** WorkType 1:N WorkLog (при удалении WorkType с существующими записями — ошибка `WorkTypeInUseException`).

## Seed-данные

При первом применении миграций и запуске seed-скрипта автоматически создаются виды работ:

1. Кладка перегородок
2. Монтаж опалубки
3. Армирование
4. Бетонирование
5. Штукатурные работы
6. Монтаж инженерных сетей

## Устранение неполадок

### Порт 5432 занят другим PostgreSQL

Если локальный PostgreSQL уже занимает порт 5432, проект использует порт `5434`. Убедитесь, что в `.env` указан `localhost:5434`.

### Ошибка "Cannot find module"

```bash
# Переустановить зависимости
rm -rf node_modules apps/*/node_modules
npm install
npm install -w apps/api
npm install -w apps/web
```

### Prisma: Environment variable not found: DATABASE_URL

```bash
# Вариант 1 — экспорт перед командой (Linux/macOS)
export DATABASE_URL="postgresql://postgres:postgres@localhost:5434/worklog?schema=public"
npx prisma migrate deploy

# Вариант 2 — Windows PowerShell
$env:DATABASE_URL="postgresql://postgres:postgres@localhost:5434/worklog?schema=public"
npx prisma migrate deploy
```

### API не запускается с ошибкой декораторов

В `tsconfig.json` проекта `apps/api` уже включены:
- `experimentalDecorators: true`
- `emitDecoratorMetadata: true`

Если ошибка сохраняется, запускайте через:
```bash
cd apps/api
npx ts-node -r tsconfig-paths/register src/main.ts
```

## Лицензия

MIT