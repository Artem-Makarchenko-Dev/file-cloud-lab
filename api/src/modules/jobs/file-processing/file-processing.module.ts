import { Module } from '@nestjs/common';
import { FileProcessingProcessor } from './file-processing.processor';
import { FileProcessingService } from './file-processing.service';
import { EventsModule } from '../../events/events.module';
import { FileListener } from './file.listener';
import { SqsModule } from 'src/infrastructure/sqs/sqs.module';

@Module({
  imports: [EventsModule, SqsModule],
  providers: [FileProcessingProcessor, FileProcessingService, FileListener],
  exports: [FileProcessingService],
})
export class FileProcessingModule {}
