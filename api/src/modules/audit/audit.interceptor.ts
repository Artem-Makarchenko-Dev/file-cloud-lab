import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AuditService } from './audit.service';
import type { Request, Response } from 'express';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  constructor(private readonly auditService: AuditService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    let request: Request | undefined;
    let response: Response | undefined;

    if (context.getType() === 'http') {
      request = context.switchToHttp().getRequest<Request>();
      response = context.switchToHttp().getResponse<Response>();
    }

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - now;

        void this.auditService.log({
          userId: request?.user?.id ?? undefined,
          type: 'HTTP_REQUEST',
          route: request?.originalUrl,
          method: request?.method,
          status: response?.statusCode,
          ip: request?.ip,
          userAgent: request?.headers?.['user-agent'],
          duration,
        });
      }),
    );
  }
}
