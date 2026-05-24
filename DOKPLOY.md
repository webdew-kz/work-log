# Деплой на Dokploy

## Требования

- Сервер с Dokploy ([dokploy.com](https://dokploy.com))
- Git-репозиторий `webdew-kz/work-log`
- Домен (например, `worklog.example.com`)

## Шаги деплоя

### 1. Подготовка репозитория

Репозиторий уже содержит `dokploy-compose.yml` с конфигурацией для Dokploy.

### 2. Создание проекта в Dokploy

1. Открой панель Dokploy (`https://your-dokploy-server.com`)
2. Создай новый проект: **"Журнал работ"**
3. Добавь приложение типа **Docker Compose**
4. В настройках приложения:
   - **Source**: Git
   - **Repository**: `webdew-kz/work-log`
   - **Branch**: `master`
   - **Compose File**: `dokploy-compose.yml`

### 3. Настройка переменных окружения

| Переменная | Значение | Описание |
|---|---|---|
| `DOMAIN` | `worklog.example.com` | Твой домен |
| `POSTGRES_USER` | `postgres` | Пользователь БД |
| `POSTGRES_PASSWORD` | `(сгенерируй)` | Пароль БД (обязательно!) |
| `POSTGRES_DB` | `worklog` | Имя базы данных |

### 4. Настройка домена

1. В Dokploy перейди во вкладку **Domains**
2. Добавь домен: `worklog.example.com`
3. Убедись, что DNS-запись `A` указывает на IP сервера Dokploy
4. Traefik автоматически выпустит SSL-сертификат (Let's Encrypt)

### 5. Запуск деплоя

Нажми **Deploy** — Dokploy автоматически:
1. Склонирует репозиторий
2. Соберёт Docker-образы (`web` + `api`)
3. Запустит PostgreSQL
4. Применит миграции Prisma
5. Выполнит seed-данные
6. Настроит nginx с reverse proxy
7. Выпустит SSL-сертификат

### 6. Проверка

После деплоя:
- Веб-приложение: `https://worklog.example.com`
- API: `https://worklog.example.com/api`
- Health check: `https://worklog.example.com/api/health`

### Архитектура на Dokploy

```
┌─────────────────────────────────────────┐
│              Traefik (Dokploy)           │
│         HTTPS + Let's Encrypt            │
└──────────────────┬──────────────────────┘
                   │
                   ▼
┌─────────────────────────────────────────┐
│              nginx (web)                 │
│        /api/ → proxy_pass → api:3001    │
│        /     → static (React SPA)        │
└──────────────────┬──────────────────────┘
                   │
         ┌────────┴────────┐
         ▼                 ▼
   ┌───────────┐     ┌───────────┐
   │  API      │     │  PostgreSQL│
   │ (NestJS)  │     │  (DB)     │
   │ port 3001 │     │  port 5432│
   └───────────┘     └───────────┘
```

## Обновление приложения

При пуше в `master` Dokploy автоматически пересоберёт и перезапустит сервисы.

## Устранение неполадок

### Приложение не открывается
```bash
# Проверь логи в Dokploy → Logs
docker logs dokploy-worklog-web-1
docker logs dokploy-worklog-api-1
```

### Ошибка подключения к БД
Убедись, что `DATABASE_URL` содержит правильный пароль:
```
postgresql://postgres:ТВОЙ_ПАРОЛЬ@db:5432/worklog?schema=public
```

### Prisma миграции не применились
```bash
docker exec -it dokploy-worklog-api-1 sh
npx prisma migrate deploy
npx prisma db seed
```
