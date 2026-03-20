import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { OnEvent } from '@nestjs/event-emitter';
import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { DomainEventMap } from '../../events/domain-event.types';

@WebSocketGateway({
  namespace: 'notifications',
  cors: { origin: '*' },
})
export class NotificationsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(NotificationsGateway.name);

  constructor(private readonly jwtService: JwtService) {}

  handleConnection(client: Socket): void {
    try {
      const token = client.handshake.auth?.token as string | undefined;

      if (!token) {
        this.logger.warn(`Socket ${client.id} rejected: no token`);
        client.disconnect(true);
        return;
      }

      const payload = this.jwtService.verify<{ sub: number }>(token);
      const userId = payload?.sub;

      if (!userId) {
        this.logger.warn(`Socket ${client.id} rejected: invalid payload`);
        client.disconnect(true);
        return;
      }

      (client.data as { userId: number }).userId = userId;
      void client.join(`user:${userId}`);

      this.logger.log(`Socket ${client.id} connected as user ${userId}`);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`Socket ${client.id} rejected: ${message}`);
      client.disconnect(true);
    }
  }

  handleDisconnect(client: Socket): void {
    const userId = (client.data as { userId?: number })?.userId;

    if (userId) {
      this.logger.log(`Socket ${client.id} disconnected (user ${userId})`);
    } else {
      this.logger.log(`Socket ${client.id} disconnected`);
    }
  }

  @OnEvent('file.processed')
  handleFileProcessed(payload: DomainEventMap['file.processed']): void {
    try {
      this.server.to(`user:${payload.userId}`).emit('file.processed', payload);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.error(`WS emit error (file.processed): ${message}`);
    }
  }

  @OnEvent('payment.completed')
  handlePaymentCompleted(payload: DomainEventMap['payment.completed']): void {
    this.server.to(`user:${payload.userId}`).emit('payment.completed', payload);
  }
}
