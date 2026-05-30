import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Storage } from './s3.storage';

export const STORAGE = 'STORAGE_PROVIDER';

@Module({
  providers: [
    {
      provide: STORAGE,
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        return new S3Storage({
          region: config.getOrThrow<string>('S3_REGION'),
          bucket: config.getOrThrow<string>('S3_BUCKET'),
          endpoint: config.get<string>('S3_ENDPOINT'),
          accessKeyId: config.getOrThrow<string>('S3_ACCESS_KEY'),
          secretAccessKey: config.getOrThrow<string>('S3_SECRET_KEY'),
          cloudfrontDomain: config.get<string>('CLOUDFRONT_DOMAIN'),
        });
      },
    },
  ],
  exports: [STORAGE],
})
export class StorageModule {}
