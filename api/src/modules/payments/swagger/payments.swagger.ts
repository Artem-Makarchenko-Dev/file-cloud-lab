import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function SwaggerPaymentsController() {
  return applyDecorators(ApiTags('Payments'), ApiBearerAuth('access-token'));
}

export function SwaggerCreateCheckout() {
  return applyDecorators(
    ApiOperation({
      summary: 'Create Stripe Checkout session for Premium plan',
    }),
    ApiResponse({
      status: 201,
      description: 'Checkout session created successfully',
      schema: {
        example: { url: 'https://checkout.stripe.com/c/pay/cs_test_123...' },
      },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
