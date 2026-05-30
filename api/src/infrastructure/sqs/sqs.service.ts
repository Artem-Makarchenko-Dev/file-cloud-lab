import { Injectable } from '@nestjs/common';
import {
    DeleteMessageCommand,
    Message,
    ReceiveMessageCommand,
    SendMessageCommand,
    SQSClient,
  } from '@aws-sdk/client-sqs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SqsService {
    private readonly queueUrl: string;
    private readonly client: SQSClient;

    constructor(private readonly configService: ConfigService) {
        this.client = new SQSClient({
            region: this.configService.get('S3_REGION'),
            credentials: {
              accessKeyId: this.configService.get('S3_ACCESS_KEY')!,
              secretAccessKey: this.configService.get('S3_SECRET_KEY')!,
            },
          });
          this.queueUrl = this.configService.get('SQS_QUEUE_URL')!;
    }

    async sendMessage(body: object) {
        const command = new SendMessageCommand({
            QueueUrl: this.queueUrl,
            MessageBody: JSON.stringify(body),
        });
        await this.client.send(command);
    }


    async receiveMessages(): Promise<Message[]> {
        const result = await this.client.send(new ReceiveMessageCommand({
        QueueUrl: this.queueUrl,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 20,
        }));
        return result.Messages ?? [];
    }

    async deleteMessage(receiptHandle: string): Promise<void> {
        await this.client.send(new DeleteMessageCommand({
        QueueUrl: this.queueUrl,
        ReceiptHandle: receiptHandle,
        }));
    }
}