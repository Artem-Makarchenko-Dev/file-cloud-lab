import { Controller, Get } from '@nestjs/common';
import { Public } from '../modules/auth/decorators/public.decorator';
import { RedisService } from './redis.service';

@Controller('redis')
export class RedisController {
  constructor(private readonly redis: RedisService) {}

  @Public()
  @Get()
  async redisTest() {
    await this.redis.set('hello', 'world');
    return this.redis.get('hello');
  }
}
