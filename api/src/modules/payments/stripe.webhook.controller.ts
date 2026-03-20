import { Controller, Post, Req, Res } from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request, Response } from 'express';
import { PaymentsService } from './payments.service';
import { Public } from '../auth/decorators/public.decorator';

@Controller('stripe')
export class StripeWebhookController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Public()
  @Post('webhook')
  async handleWebhook(
    @Req() req: RawBodyRequest<Request>,
    @Res() res: Response,
  ) {
    const signature = req.headers['stripe-signature'] as string;

    try {
      await this.paymentsService.handleWebhook(req.rawBody!, signature);
      return res.status(200).send();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      console.error('Webhook error:', message);
      return res.status(401).send('Webhook Error');
    }
  }
}
