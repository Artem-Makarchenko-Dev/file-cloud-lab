import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class FileProcessingService {
  constructor(
    @InjectQueue('file-processing')
    private readonly queue: Queue,
  ) {}

  async addProcessingJob(data: { fileId: number; userId: number }) {
    await this.queue.add('process-file', data, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
      removeOnComplete: true,
      removeOnFail: false,
    });
  }
}
