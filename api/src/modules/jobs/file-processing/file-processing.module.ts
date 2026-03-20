import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { FileProcessingProcessor } from './file-processing.processor';
import { FileProcessingService } from './file-processing.service';
import { EventsModule } from '../../events/events.module';
import { FileListener } from './file.listener';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'file-processing',
    }),
    EventsModule,
  ],
  providers: [FileProcessingProcessor, FileProcessingService, FileListener],
  exports: [FileProcessingService],
})
export class FileProcessingModule {}
