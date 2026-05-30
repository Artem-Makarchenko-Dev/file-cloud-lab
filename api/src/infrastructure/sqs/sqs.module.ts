import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { SqsConsumerService } from './sqs-consumer.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  providers: [SqsService, SqsConsumerService],
  exports: [SqsService, SqsConsumerService],
  imports: [ConfigModule],
})
export class SqsModule {}