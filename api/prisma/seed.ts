import 'dotenv/config';
import bcrypt from 'bcrypt';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

const SALT_ROUNDS = 12;

const PERMISSION_CODES = [
  { code: 'users.read', description: 'List and read users' },
  { code: 'users.create', description: 'Create users' },
  { code: 'users.update', description: 'Update users' },
  { code: 'users.delete', description: 'Delete users' },
  { code: 'roles.read', description: 'Read roles' },
  { code: 'roles.manage', description: 'Manage roles' },
  { code: 'audit.read', description: 'Read audit logs' },
] as const;

async function main() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error('DATABASE_URL is not set');
  }

  const adminEmail =
    process.env.SEED_ADMIN_EMAIL?.trim();
  if (!adminEmail) {
    throw new Error('SEED_ADMIN_EMAIL is not set');
  }
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;
  if (!adminPassword) {
    throw new Error('SEED_ADMIN_PASSWORD is not set');
  }
  const skipAdminUser = process.env.SEED_SKIP_ADMIN_USER === 'true';

  const pool = new Pool({ connectionString: url });
  const prisma = new PrismaClient({
    adapter: new PrismaPg(pool),
    log: ['warn', 'error'],
  });

  try {
    const userRole = await prisma.role.upsert({
      where: { name: 'user' },
      update: {},
      create: { name: 'user', description: 'Default role for signups' },
    });

    const adminRole = await prisma.role.upsert({
      where: { name: 'admin' },
      update: {},
      create: { name: 'admin', description: 'Full access' },
    });

    if (userRole.id !== 1) {
      console.warn(
        'Warning: role "user" id is not 1. Signup uses roleId=1 — update auth or DB.',
      );
    }

    await prisma.permission.createMany({
      data: PERMISSION_CODES.map((p) => ({
        code: p.code,
        description: p.description,
      })),
      skipDuplicates: true,
    });

    const allPermissions = await prisma.permission.findMany();

    await prisma.rolePermission.createMany({
      data: allPermissions.map((p) => ({
        roleId: adminRole.id,
        permissionId: p.id,
      })),
      skipDuplicates: true,
    });

    if (!skipAdminUser) {
      const passwordHash = await bcrypt.hash(adminPassword, SALT_ROUNDS);
      await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
          passwordHash,
          roleId: adminRole.id,
          isActive: true,
        },
        create: {
          email: adminEmail,
          passwordHash,
          roleId: adminRole.id,
        },
      });
    }

    console.log('Seed completed.');
  } finally {
    await prisma.$disconnect();
    await pool.end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
