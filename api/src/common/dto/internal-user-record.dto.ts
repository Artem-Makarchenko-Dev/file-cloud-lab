import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Subset of `User` for internal listing docs (`GET /prisma`). */
export class InternalUserRecordDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  updatedAt: string;

  @ApiProperty({ example: 1 })
  roleId: number;

  @ApiProperty({ enum: ['FREE', 'PRO'] })
  plan: string;

  @ApiProperty({
    enum: ['NONE', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE'],
  })
  billingStatus: string;

  @ApiPropertyOptional({ nullable: true })
  stripeCustomerId: string | null;

  @ApiPropertyOptional({ nullable: true })
  stripeSubscriptionId: string | null;

  @ApiPropertyOptional({ nullable: true })
  stripePriceId: string | null;
}
