import { Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Plan } from '@prisma/client';
import Stripe from 'stripe';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.stripe = new Stripe(
      this.config.getOrThrow<string>('STRIPE_SECRET_KEY'),
    );
  }

  async createCheckoutSession(userId: number) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await this.stripe.customers.create({
        email: user.email,
        metadata: { userId: user.id.toString() },
      });

      customerId = customer.id;

      await this.prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    const session = await this.stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [
        {
          price: this.config.getOrThrow<string>('STRIPE_PRICE_PRO'),
          quantity: 1,
        },
      ],
      success_url: `${this.config.getOrThrow<string>('APP_URL')}/billing/success`,
      cancel_url: `${this.config.getOrThrow<string>('APP_URL')}/billing/cancel`,
    });

    return { url: session.url };
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.config.getOrThrow<string>(
      'STRIPE_WEBHOOK_SECRET',
    );

    const event = this.stripe.webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        const user = await this.prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (!user) return;

        await this.prisma.user.update({
          where: { id: user.id },
          data: { plan: Plan.PRO, stripeSubscriptionId: subscriptionId },
        });

        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;

        const user = await this.prisma.user.findFirst({
          where: { stripeSubscriptionId: subscription.id },
        });

        if (!user) return;

        await this.prisma.user.update({
          where: { id: user.id },
          data: { plan: Plan.FREE, stripeSubscriptionId: null },
        });

        break;
      }
    }
  }
}
