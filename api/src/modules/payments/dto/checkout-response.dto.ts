import { ApiPropertyOptional } from '@nestjs/swagger';

export class CheckoutSessionResponseDto {
  @ApiPropertyOptional({
    example: 'https://checkout.stripe.com/c/pay/cs_test_123',
    description: 'Hosted Stripe Checkout URL (null if session URL missing)',
  })
  url: string | null;
}
