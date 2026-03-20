import {
  Controller,
  HttpCode,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { PaymentsService } from './payments.service';
import {
  SwaggerPaymentsController,
  SwaggerCreateCheckout,
} from './swagger/payments.swagger';

@SwaggerPaymentsController()
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('checkout')
  @HttpCode(201)
  @SwaggerCreateCheckout()
  async createCheckoutSession(@Req() req: Request) {
    const userId = req.user?.id;

    if (!userId) {
      throw new UnauthorizedException();
    }

    return this.paymentsService.createCheckoutSession(userId);
  }
}
