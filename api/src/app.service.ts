import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getConnectionStatus(): string {
    return 'Yeah! Beackend is connected';
  }
}
