import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from '../auth.service';
import { SessionService } from '../session/session.service';

@Injectable()
export class SessionAuthGuard implements CanActivate {
  constructor(
    private readonly sessionService: SessionService,
    private readonly authService: AuthService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const sid = request.cookies?.['sid'] as string | undefined;
    const refreshToken = request.cookies?.['refresh'] as string | undefined;

    if (!sid || !refreshToken) {
      throw new UnauthorizedException('Missing session cookies');
    }

    const session = await this.sessionService.findValidSession(sid, refreshToken);

    if (!session) {
      throw new UnauthorizedException('Invalid session ID');
    }

    const user = await this.authService.getUserById(session.userId);

    if (!user) {
      throw new UnauthorizedException('User not found for session');
    }

    (request as any).user = user;
    (request as any).userId = user.id;

    return true;
  }
}
