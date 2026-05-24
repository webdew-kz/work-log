# Build stage
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/
RUN npm install --workspace=@worklog/api
COPY apps/api ./apps/api
COPY package.json ./
RUN cd apps/api && npx prisma generate
RUN npm run build -w apps/api

# Production stage
FROM node:22-alpine
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules
COPY apps/api/package*.json ./
ENV NODE_ENV=production
EXPOSE 3001
CMD ["sh", "-c", "npx prisma migrate deploy && npx prisma db seed || true && node dist/main.js"]
