import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import type { DomainEventMap } from '../../events/domain-event.types';
import { FileProcessingService } from './file-processing.service';

@Injectable()
export class FileListener {
  private readonly logger = new Logger(FileListener.name);

  constructor(private readonly fileProcessingService: FileProcessingService) {}

  @OnEvent('file.uploaded')
  async handleFileUploaded(
    payload: DomainEventMap['file.uploaded'],
  ): Promise<void> {
    this.logger.log(
      `File uploaded: fileId=${payload.fileId}, userId=${payload.userId}`,
    );
    await this.fileProcessingService.addProcessingJob(payload);
  }

  @OnEvent('file.processed')
  handleFileProcessed(payload: DomainEventMap['file.processed']): void {
    this.logger.log(
      `File processed: fileId=${payload.fileId}, size=${payload.size}`,
    );
  }
}
