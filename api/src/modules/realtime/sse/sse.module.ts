import { Module } from '@nestjs/common';
import { EventsModule } from '../../events/events.module';
import { AdminEventsController } from './admin-events.controller';

@Module({
  imports: [EventsModule],
  controllers: [AdminEventsController],
})
export class SseModule {}
