import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Injectable, Logger } from '@nestjs/common';
import { DomainEventsService } from '../../events/domain-events.service';

@Processor('file-processing')
@Injectable()
export class FileProcessingProcessor extends WorkerHost {
  private readonly logger = new Logger(FileProcessingProcessor.name);

  constructor(private readonly events: DomainEventsService) {
    super();
  }

  async process(job: Job<{ fileId: number; userId: number }>): Promise<void> {
    const { fileId, userId } = job.data;

    this.logger.log(`Start processing file ${fileId}`);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    this.logger.log(`File ${fileId} processed`);

    this.events.emit('file.processed', {
      fileId,
      userId,
      size: 12345,
    });
  }
}
