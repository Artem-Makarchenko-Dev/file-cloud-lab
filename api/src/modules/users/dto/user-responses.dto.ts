import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/dto/pagination-meta.dto';

export class UserListRoleDto {
  @ApiProperty({ example: 'admin' })
  name: string;
}

export class UserListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @ApiProperty({ example: true })
  isActive: boolean;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ type: UserListRoleDto })
  role: UserListRoleDto;
}

export class UsersPaginatedResponseDto {
  @ApiProperty({ type: [UserListItemDto] })
  data: UserListItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class UserDetailRoleDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user' })
  name: string;

  @ApiPropertyOptional({ example: 'Default user role' })
  description?: string | null;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  updatedAt: string;
}

export class UserDetailResponseDto {
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

  @ApiProperty({ type: UserDetailRoleDto })
  role: UserDetailRoleDto;
}

/** Public fields for a deleted user (password hash omitted from API docs). */
export class UserDeletedResponseDto {
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

  @ApiProperty({ enum: ['FREE', 'PRO'], example: 'FREE' })
  plan: string;

  @ApiProperty({
    enum: ['NONE', 'ACTIVE', 'PAST_DUE', 'CANCELED', 'INCOMPLETE'],
  })
  billingStatus: string;

  @ApiPropertyOptional({ example: 'cus_xxx' })
  stripeCustomerId?: string | null;

  @ApiPropertyOptional({ example: 'sub_xxx' })
  stripeSubscriptionId?: string | null;

  @ApiPropertyOptional({ example: 'price_xxx' })
  stripePriceId?: string | null;
}
