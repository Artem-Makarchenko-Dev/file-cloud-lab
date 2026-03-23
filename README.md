# File Cloud Lab

A learning-oriented full-stack project: a file cloud with SaaS-style features—authentication, roles and permissions, uploads to S3-compatible storage, Stripe subscriptions, background jobs, and real-time updates.

## Features

- **Authentication**: JWT (access + refresh), HttpOnly cookies, optional Google OAuth  
- **RBAC**: roles and permissions (PostgreSQL / Prisma)  
- **Files**: presigned upload to S3-compatible storage (MinIO in dev), upload confirmation, file statuses  
- **Payments**: Stripe (subscriptions, FREE/PRO plans)  
- **Infrastructure**: Redis (cache/queues), MongoDB, BullMQ for background processing  
- **Real-time**: WebSocket and Server-Sent Events  
- **Admin**: GraphQL endpoint for administrative flows  
- **Observability**: Pino, correlation ID, request audit, health checks, Swagger (`/docs`)

## Stack

| Layer | Technologies |
|------|--------------|
| API | NestJS 11, Prisma 7 (PostgreSQL), Mongoose, GraphQL (Apollo), BullMQ, Socket.IO |
| Web | Next.js 16, React 19, Redux Toolkit, Tailwind CSS 4 |
| Storage | AWS SDK for S3 (MinIO-compatible) |
| Queues | Redis + BullMQ |

## Repository layout

```
api/          # NestJS backend (default port 3000)
web/          # Next.js frontend (dev 8080)
docker-compose.infra.yml   # Postgres, Redis, MongoDB, MinIO, Redis Insight
docker-compose.yml         # production-like: api + web
docker-compose.dev.yml     # hot reload for api + web
```

## Quick start (Docker)

1. Copy environment variables:

   ```bash
   cp .env.example .env
   ```

   Fill in values for your local setup (database, Redis, Mongo, MinIO/S3, JWT, and optionally Google and Stripe).

2. Start infrastructure and apps (example for development with hot reload):

   ```bash
   docker compose -f docker-compose.infra.yml up -d
   docker compose -f docker-compose.dev.yml up --build
   ```

3. Open:

   - Web: http://localhost:8080  
   - API: http://localhost:3000  
   - Swagger: http://localhost:3000/docs  

See `docker-compose.infra.yml` for ports and services (PostgreSQL 5432, Redis 6379, MinIO 9000/9001, MongoDB 27017, etc.).

## Local development without Docker

- **API**: `cd api && yarn && yarn prisma:generate && yarn db:migrate && yarn db:seed && yarn start:dev`  
- **Web**: `cd web && yarn && yarn dev` (set `NEXT_PUBLIC_API_URL`; see [web/README.md](web/README.md))

## Frontend docs

Routes, auth flow, and Next.js env vars are documented in [web/README.md](web/README.md).

## License

Private / UNLICENSED (see `api/package.json`).
