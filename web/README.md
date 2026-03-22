# Web (Next.js)

API client for the repository root (`nest-docker-test`). Dev port: **8080**.

## Environment variables

Copy `.env.example` → `.env.local` and set:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

With Docker, the value is taken from the root `.env` (`docker-compose.dev.yml`).

## Scripts

```bash
yarn dev      # http://localhost:8080
yarn build    # requires NEXT_PUBLIC_API_URL (e.g. from .env.local)
yarn start    # production
yarn lint
```

## Pages

| Path | Description |
|------|-------------|
| `/` | Landing |
| `/login`, `/signup` | Sign in / sign up |
| `/oauth-success` | After Google OAuth (token in query + cookies from API) |
| `/users` | User list (requires `users.read` on the API) |
| `/users/[id]` | User detail (`users.read`); delete action if `users.delete` (not your own user) |

Auth matches Nest: **HttpOnly cookies** (`sid`, `refresh`) + **access JWT** in Redux and the `Authorization` header.
