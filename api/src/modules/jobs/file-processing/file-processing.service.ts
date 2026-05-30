import { Injectable } from '@nestjs/common';
import { SqsService } from 'src/infrastructure/sqs/sqs.service';

@Injectable()
export class FileProcessingService {
  constructor(
    private readonly sqsService: SqsService
  ) {}

  async addProcessingJob(data: { fileId: number; userId: number }) {
    await this.sqsService.sendMessage(data);
  }
}
