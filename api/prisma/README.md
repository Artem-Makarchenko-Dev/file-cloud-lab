# Prisma (Nest API)

## Migrations

From the `api` directory:

```bash
yarn db:migrate
```

## Seed

Requires `DATABASE_URL` (and optional `SEED_*` vars — see root `.env.example`).

```bash
yarn db:seed
```

This creates:

- Roles: `user` (created first so `id` is typically **1**, matching signup `roleId: 1`) and `admin`
- Permissions (`users.read`, `users.delete`, …) and assigns **all** to `admin`
- Admin user (unless `SEED_SKIP_ADMIN_USER=true`)

Run after migrations:

```bash
yarn db:migrate && yarn db:seed
```

On Render (or CI), run the same commands in the **build** or **release** step when `DATABASE_URL` points at the production database.
