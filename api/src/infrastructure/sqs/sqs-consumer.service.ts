import { Injectable, OnModuleInit, OnModuleDestroy, Logger} from '@nestjs/common';
import { SqsService } from './sqs.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class SqsConsumerService
implements OnModuleInit, OnModuleDestroy
{
    constructor(
        private readonly sqsService: SqsService,
        private readonly eventEmitter: EventEmitter2
    ) {}

    private readonly logger = new Logger(SqsConsumerService.name);
    
    private isRunning = false;

    async onModuleInit() {
        this.isRunning = true;
        this.startPolling();
    }

    async onModuleDestroy() {
        this.isRunning = false;
    }

    private async startPolling() {
        while (this.isRunning) {
            try {
                const messages = await this.sqsService.receiveMessages();

                for (const message of messages) {
                    const body = JSON.parse(message.Body!);
                    this.eventEmitter.emit('file.received', body);
                    await this.sqsService.deleteMessage(message.ReceiptHandle!);
                  }
            } catch (error) {
                this.logger.error('Error polling SQS queue', error);
                await new Promise(resolve => setTimeout(resolve, 5000));
            }
        }
    }
}