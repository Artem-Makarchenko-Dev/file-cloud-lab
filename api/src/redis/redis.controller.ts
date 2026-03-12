import { Controller, Get } from '@nestjs/common';
import { RedisService } from './redis.service' 

@Controller('redis')
export class RedisController {
    constructor(private readonly redis: RedisService) {}

    @Get()
    async redisTest() {
        await this.redis.set('hello', 'world');
        return this.redis.get('hello');
    }
}