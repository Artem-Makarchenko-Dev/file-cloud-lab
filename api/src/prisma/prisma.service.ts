import {
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
  Logger,
} from '@nestjs/common';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { ConfigService } from '@nestjs/config';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly pool: Pool;

  constructor(configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL');
    if (!connectionString) throw new Error('DATABASE_URL is not set');

    const pool = new Pool({
      connectionString,
      max: Number(configService.get<string>('PG_POOL_MAX')) || 10,
      idleTimeoutMillis:
        Number(configService.get<string>('PG_IDLE_TIMEOUT_MS')) || 30000,
      connectionTimeoutMillis:
        Number(configService.get<string>('PG_CONN_TIMEOUT_MS')) || 2000,
    });

    super({
      adapter: new PrismaPg(pool),
      log: ['warn', 'error'],
    });

    this.pool = pool;
  }

  private readonly logger = new Logger(PrismaService.name);

  private async connectWithRetry() {
    const retries = 10;

    for (let i = 0; i < retries; i++) {
      try {
        await this.$connect();
        this.logger.log('Connected to database');
        return;
      } catch {
        this.logger.warn(`DB not ready... (${i + 1}/${retries})`);
        const delay = 2000 * (i + 1);
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    throw new Error('❌ Could not connect to database');
  }

  async onModuleInit() {
    await this.connectWithRetry();
  }

  async onModuleDestroy() {
    await this.$disconnect();
    await this.pool.end();
  }
}
