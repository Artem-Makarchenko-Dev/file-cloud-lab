# File Cloud Lab

Backend-driven SaaS platform for file storage and management, built using an API-first approach with a focus on production-grade architecture.

## Quick Access

- API (Swagger): [Open Swagger Docs](https://nest-docker-test-5t7h.onrender.com/docs)

- Postman Collection: [Open Postman Workspace](https://www.postman.com/artem3-2305/workspace/file-cloud-lab-api)

- Design (Figma): [Open Figma Design](https://www.figma.com/design/0hUbG6oFLoB2inmTHxfQNv/File-Cloud-Lab)

- Live Demo (Frontend): [Open Live App](https://full-stack-web-hni7.onrender.com/)  
  _(frontend is in progress, intentionally minimal and focused on demonstrating backend integration and core flows: initial page and authentication)_

## TL;DR

- API-first backend platform designed as a production-style SaaS system
- Covers auth, permissions, file lifecycle, payments, async jobs, and realtime updates
- Integrates PostgreSQL, Redis, MongoDB, S3-compatible storage, and Stripe
- Implements background processing via BullMQ and event-driven architecture
- Demonstrates system design, scalability, and backend engineering practices

## Tech Stack (quick view)
Core technologies used in the system:

Backend:
- NestJS
- Prisma
- PostgreSQL

Infrastructure:
- Redis
- MongoDB
- MinIO (S3-compatible)

Async & Realtime:
- BullMQ
- WebSocket
- SSE

Payments:
- Stripe

Frontend (partial):
- Next.js
- Redux Toolkit

## Project Scope

This project is focused on backend architecture and system design.

It follows a backend-first approach, where the API is treated as a standalone platform, 
and the frontend is considered an independent client layer.

The frontend is partially implemented to demonstrate integration, 
while the main goal of the project is to design and build a production-style backend system.

The system is designed to support multiple clients, including web, admin, and potential future integrations.

## Features

### Authentication & Security
- JWT access tokens with refresh flow
- Session-based authentication with HttpOnly cookies
- Refresh token rotation backed by Redis
- Google OAuth integration

### Users & Access Control
- User management (list, details, deletion)
- Role-based access control (RBAC)
- Route-level permission guards

### File Management
- Presigned upload URL generation
- Direct upload to S3-compatible storage
- Upload confirmation and metadata handling
- File listing, download, and soft delete

### Payments & Billing
- Stripe integration
- Subscription flow and checkout session handling

### Async Processing
- Background jobs with BullMQ
- File processing pipeline
- Domain events layer for decoupled workflows

### Realtime
- WebSocket gateway for realtime updates
- Server-Sent Events (SSE) for admin/event streams

### Observability & Stability
- Structured logging with Pino
- Audit logging (MongoDB)
- Global error handling
- Request validation (DTO + whitelist mode)
- Rate limiting via throttler

### API & Admin
- REST API with Swagger documentation
- GraphQL layer for admin operations

## Architecture

### High-level

The system is structured as a backend-driven platform with a clear separation between API, client, and infrastructure layers.

- API handles business logic, data access, async processing, and integrations
- Client acts as a thin layer responsible for user interaction and API consumption
- Infrastructure services (DB, cache, storage, queue) are externalized

High-level flow:

Client → API → Services → Database  
             ↓  
           Redis / Queue  
             ↓  
          Workers / Jobs  
             ↓  
        External services (S3, Stripe)

---

### Modules

The backend is organized into modular domains:

- auth: authentication, sessions, JWT, OAuth, guards
- users: user management and access control
- files: file lifecycle, upload flow, metadata handling
- payments: Stripe integration and subscription handling
- jobs: background processing and queues (BullMQ)
- events: domain events and decoupled communication
- realtime: WebSocket and SSE delivery
- audit: request and event logging (MongoDB)
- health: liveness and readiness checks
- infrastructure: storage abstraction (S3-compatible)

---

### Architecture Style

- Layered modular architecture (NestJS modules)
- Clear separation between domain logic and infrastructure
- API-first design with client-agnostic backend
- Monorepo setup with isolated applications (api / web)

---

### Key Patterns

- Dependency Injection via NestJS providers
- Event-driven architecture using domain events
- Guard-based authorization (auth + RBAC)
- Storage abstraction for S3-compatible providers
- Async processing via queue-based workers (BullMQ)

---

### System Overview

The system consists of several core subsystems:

- authentication and identity
- access control (RBAC)
- file storage (S3-compatible)
- async processing (queues and jobs)
- realtime delivery (WebSocket, SSE)
- billing (Stripe)
- observability (logging, audit, health)

## User Flow

### Main Flow

1. User opens the application.
2. User signs up or logs in.
3. Client initializes auth state using refresh + `me` request.
4. Authenticated user requests a presigned upload URL.
5. Client uploads file directly to S3-compatible storage.
6. Client confirms upload with the API.
7. File metadata is stored and becomes available in the system.
8. User can view, download, or delete files.
9. Background jobs process files if needed.
10. Realtime updates are delivered via WebSocket or SSE.

---

### Admin / Extended Flow

1. Admin accesses protected endpoints.
2. System validates permissions via RBAC guards.
3. Admin retrieves user data via REST or GraphQL.
4. Events are emitted and processed asynchronously.
5. System streams updates via SSE or WebSocket.

## API

### Swagger

[Open Swagger Docs](https://nest-docker-test-5t7h.onrender.com/docs)

### Postman Collection

[Open Postman Workspace](https://www.postman.com/artem3-2305/workspace/file-cloud-lab-api)

Includes pre-configured requests for authentication, file upload flow, and core API endpoints.

---

### API Structure

The API is organized into domain-based modules with clear separation of concerns:

- auth
- users
- files
- payments
- admin (GraphQL)
- realtime
- health

---

### Core Endpoints

Auth:
- POST /auth/signup
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET /auth/me

Users:
- GET /users
- GET /users/:id
- DELETE /users/:id

Files:
- POST /files/presign
- POST /files/confirm
- GET /files
- GET /files/:id/download
- DELETE /files/:id

Payments:
- POST /payments/checkout
- POST /payments/webhook

Health:
- GET /health

---

### Upload Flow

1. Client requests a presigned upload URL from the API.
2. File is uploaded directly to S3-compatible storage.
3. Client confirms upload with the API.
4. File metadata is stored and becomes available for access.

---

### Auth Flow

1. User logs in or signs up.
2. API returns access token and sets session cookies.
3. Access token is used for authenticated requests.
4. On 401 response, client triggers refresh flow.
5. Refresh token rotation is handled via HttpOnly cookies.
6. Request is retried with a new access token.

---

### Admin (GraphQL)

- Endpoint: /graphql
- Used for admin-level queries and aggregated data access
- Protected via RBAC

---

### Realtime

- WebSocket gateway for realtime updates
- Server-Sent Events (SSE) for streaming data
- Integrated with domain events

---

### Notes

- Full endpoint list is available in Swagger
- API is designed to be client-agnostic and supports multiple consumers

## Design

Figma (view-only):
[Open Figma Design](https://www.figma.com/design/0hUbG6oFLoB2inmTHxfQNv/File-Cloud-Lab)

The design covers both user and admin flows, including authentication, file management, RBAC, billing, and system monitoring.

---

### First Screen Landing
![Landing](./design/main.webp)

---

### User Interface

#### Profile & Files
![Profile](./design/user/profile.webp)
![Files list](./design/user/files-list.webp)

---

### Admin Interface

#### Users & File Management
![Users](./design/admin/users.webp)


![Console](./design/admin/console.webp)

## Development Journey

The project was developed as a backend-focused system, evolving through several structured phases to reach a production-style SaaS architecture.

### Phase 1 — Setup & Infrastructure
- Initialized monorepo (NestJS API + Next.js client)
- Set up Docker-based local infrastructure (PostgreSQL, Redis, MongoDB, MinIO) via Docker Compose
- Configured multi-compose setup (infra, development, production-like environments)
- Added Makefile to standardize development workflow and simplify environment orchestration
- Configured Prisma ORM and base project structure

### Phase 2 — Authentication & Security
- Implemented JWT authentication
- Added session handling with HttpOnly cookies
- Implemented refresh token rotation (Redis-backed)
- Integrated Google OAuth

### Phase 3 — Core Domain & Access Control
- Implemented Users module
- Designed and implemented RBAC (roles and permissions)
- Added route-level authorization guards

### Phase 4 — File Storage & Upload Flow
- Integrated S3-compatible storage (MinIO locally, AWS S3 in production)
- Implemented presigned upload flow (direct client → storage)
- Added file metadata management and lifecycle (list, download, soft delete)

### Phase 5 — Payments & Business Logic
- Integrated Stripe payments
- Implemented subscription and checkout flow
- Added webhook handling for billing events

### Phase 6 — Async Processing & Events
- Introduced domain events layer
- Implemented background jobs using BullMQ
- Built file processing pipeline

### Phase 7 — Realtime & Delivery
- Added WebSocket gateway for realtime updates
- Implemented Server-Sent Events (SSE) for streaming data
- Integrated realtime layer with domain events

### Phase 8 — Observability & Stability
- Added structured logging with Pino
- Implemented audit logging (MongoDB)
- Added global error handling and validation
- Implemented rate limiting

### Phase 9 — API Layer & Admin
- Added Swagger (OpenAPI) documentation
- Implemented GraphQL layer for admin use cases
- Designed API as client-agnostic interface

### Phase 10 — Production Readiness & Deployment
- Added health checks (liveness/readiness)
- Implemented pagination and seed scripts
- Added test suite (unit and e2e)
- Deployed on Render with connected PostgreSQL, Redis, MongoDB, and S3 storage

## Setup & Installation

### Prerequisites

- Node.js 20+
- Yarn 1.x
- Docker and Docker Compose

---

### Environment

Copy environment variables:

cp .env.example .env
cp web/.env.example web/.env.local

Key variables include:

- DATABASE_URL
- REDIS_URL
- MONGO_URI
- JWT_ACCESS_SECRET
- S3 configuration
- STRIPE keys

---

### Run Locally

The project uses Docker-based infrastructure (PostgreSQL, Redis, MongoDB, MinIO) 
with a multi-compose setup and Makefile-based workflow for simplified development and environment orchestration.

#### Option A (recommended)

```bash
make dev
```

This will:
- start infrastructure services via Docker Compose
- run backend and frontend in development mode
- run database migrations and seed initial data

---

#### Option B (manual setup)

```bash
docker compose -f docker-compose.infra.yml up -d  

cd api  
yarn  
yarn prisma:generate  
yarn db:migrate  
yarn db:seed  
yarn start:dev  

cd ../web  
yarn  
yarn dev  
```

---

### Development Workflow

Common commands:

```bash
make dev      # start full environment
make build    # build services
make test     # run tests
```

### Database & Setup Commands

```bash
yarn prisma:generate   # generate Prisma client
yarn db:migrate        # apply database migrations
yarn db:seed           # seed initial data
```

## Testing

The project includes automated tests for core backend functionality.

### Stack

- Jest
- Supertest
- NestJS testing utilities

---

### Coverage

- Unit tests for services and core logic
- E2E tests for authentication and main API flows

---

### Run Tests

cd api  
yarn test  
yarn test:e2e  
yarn test:cov  

---

### Notes

- Focus is on critical flows: authentication, file lifecycle, and permissions
- Test setup is designed to support further expansion as the system evolves
- Current status: all test suites passing locally

## Production Considerations

### Security

- JWT-based authentication with refresh token rotation
- Session handling via HttpOnly cookies
- RBAC with route-level guards
- DTO validation with whitelist mode
- Global exception handling
- Rate limiting for auth and public endpoints
- Proper CORS configuration for secure cross-origin requests

---

### Performance

- Direct-to-storage upload flow (bypasses API for file transfer)
- Background processing via BullMQ (async jobs)
- Redis used for caching and session handling
- Pagination implemented for users and files

---

### Scalability

- Stateless API with externalized session storage (Redis)
- File storage offloaded to S3-compatible services
- Queue-based architecture allows independent scaling of workers
- Modular architecture supports horizontal scaling

---

### Observability

- Structured logging with Pino
- Audit logging stored in MongoDB
- Health checks (liveness/readiness)
- Structured logs with correlation IDs for request tracing

---

### Trade-offs & Known Issues

- Logout flow requires consistent cookie path configuration
- OAuth flow currently uses query-based token transfer (can be improved)
- Frontend build depends on external Google Fonts

## Roadmap

### Short-term Improvements

- Fix logout cookie cleanup (align cookie path configuration)
- Replace OAuth query-token flow with secure token exchange
- Improve frontend build stability (self-host fonts / local fallback)
- Expand E2E coverage for auth, files, and RBAC

---

### Mid-term Enhancements

- Improve admin panel UX and workflows
- Extend billing features (plans, usage-based logic)
- Add file processing capabilities (thumbnails, metadata extraction)
- Enhance observability (metrics, monitoring integration)

---

### Long-term Direction

- Introduce microservices or service decomposition
- Add multi-tenant support
- Implement advanced permission models (scopes / policies)
- Support multiple client applications (mobile, external integrations)