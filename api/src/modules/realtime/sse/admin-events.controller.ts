import { Controller, Sse, MessageEvent, UseGuards } from '@nestjs/common';
import { Observable, fromEventPattern } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { GqlJwtAuthGuard } from '../../auth/guards/gql-jwt-auth.guard';

@UseGuards(GqlJwtAuthGuard)
@Controller('admin')
export class AdminEventsController {
  constructor(private readonly emitter: EventEmitter2) {}

  @Sse('events')
  stream(): Observable<MessageEvent> {
    const event$ = fromEventPattern<{ type?: string }>(
      (handler: (...args: unknown[]) => void) => this.emitter.on('*', handler),
      (handler: (...args: unknown[]) => void) => this.emitter.off('*', handler),
    );

    return event$.pipe(
      map((event) => ({
        type: event?.type ?? 'system',
        data: event,
      })),
    );
  }
}
