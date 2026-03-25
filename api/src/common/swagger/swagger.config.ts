import { DocumentBuilder } from '@nestjs/swagger';

const SWAGGER_DESCRIPTION = `
Full-featured file storage API with authentication, RBAC, billing, and file management.

## Features
- JWT + refresh token (HttpOnly cookies: sid, refresh)
- File upload via presigned URLs (S3-compatible storage)
- Role-based access control (RBAC)
- Admin monitoring (SSE)
- Stripe billing integration

## Authentication
- **Access token:** Authorization: Bearer <JWT> for API calls (required for most routes)
- **Refresh:** HttpOnly refresh cookie + sid; call POST /auth/refresh to rotate.
- **Login** sets cookies and returns accessToken for SPAs

## Pagination
List endpoints return { data, meta } where meta includes total, page, limit, totalPages, hasNextPage, hasPrevPage.

## Errors
JSON errors follow a common envelope: statusCode, code, message, timestamp, path (and optional errors).

## Use case
1. User signs up or logs in
2. Client requests a presigned upload URL, uploads bytes to object storage
3. Client confirms upload; metadata is stored
4. User lists, downloads, or deletes their files
5. Optional: Stripe Checkout for subscription upgrades

---

**GraphQL:** POST /graphql — Apollo / introspection (not OpenAPI).

**Realtime:** Socket.IO namespace /notifications — JWT in handshake.auth.token.
`.trim();

export function swaggerOperationId(
  controllerKey: string,
  methodKey: string,
): string {
  const base = controllerKey.replace(/Controller$/, '');
  const ctrl = base.charAt(0).toLowerCase() + base.slice(1);
  return ctrl + methodKey.charAt(0).toUpperCase() + methodKey.slice(1);
}

export const swaggerConfig = new DocumentBuilder()
  .setTitle('File Cloud Lab API')
  .setDescription(SWAGGER_DESCRIPTION)
  .setVersion('1.0.0')
  .addServer('/', 'This deployment')
  .addTag('Core', 'Connectivity')
  .addTag('Auth', 'Sign-in, session, OAuth')
  .addTag('Users', 'User directory (RBAC)')
  .addTag('Files', 'Uploads and file metadata')
  .addTag('Payments', 'Checkout')
  .addTag('Stripe', 'Webhooks')
  .addTag('Health', 'Liveness and readiness')
  .addTag('Admin', 'Operations tooling')
  .addTag('Internal', 'Dev-only diagnostics')
  .addBearerAuth(
    { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
    'access-token',
  )
  .addCookieAuth(
    'refresh',
    {
      type: 'apiKey',
      in: 'cookie',
      description: 'Refresh token (send with POST /auth/refresh).',
    },
    'refresh',
  )
  .addSecurityRequirements('access-token')
  .build();
