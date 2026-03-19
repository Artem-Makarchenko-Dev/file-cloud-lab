import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow<string>('MONGO_URI');
        const dbName = configService.getOrThrow<string>('MONGO_DB_NAME');

        return { uri, dbName };
      },
    }),
  ],
})
export class MongoModule {}
