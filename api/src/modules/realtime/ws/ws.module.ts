import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { EventsModule } from '../../events/events.module';
import { NotificationsGateway } from './notifications.gateway';

@Module({
  imports: [
    EventsModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('JWT_ACCESS_SECRET'),
      }),
    }),
  ],
  providers: [NotificationsGateway],
})
export class WsModule {}
