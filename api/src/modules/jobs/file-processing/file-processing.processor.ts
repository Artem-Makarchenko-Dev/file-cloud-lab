import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { DomainEventsService } from '../../events/domain-events.service';

@Injectable()
export class FileProcessingProcessor {
  private readonly logger = new Logger(FileProcessingProcessor.name);

  constructor(private readonly events: DomainEventsService) {}

  @OnEvent('file.received')
  async process(data: { fileId: number; userId: number }): Promise<void> {
    const { fileId, userId } = data;

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