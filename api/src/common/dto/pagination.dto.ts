import { Type, Transform } from 'class-transformer';
import { IsInt, IsIn, IsOptional, IsBoolean, Max, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
    example: 1,
    description:
      'Page number (1-based). Sent as a query string; coerced to number.',
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 100,
    default: 10,
    example: 10,
    description: 'Page size (max 100). Coerced to number.',
    type: Number,
  })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit = 10;

  @ApiPropertyOptional({
    description:
      'Sort field. Users: `createdAt`, `email`. Files: `createdAt`, `filename`, `size`.',
  })
  @IsOptional()
  sortBy?: string;

  @ApiPropertyOptional({
    enum: ['asc', 'desc'],
    description: 'Sort direction',
  })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  order?: 'asc' | 'desc';

  @ApiPropertyOptional({
    description:
      'Files only: filter by status (`PENDING`, `UPLOADED`, `DELETED`)',
  })
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({
    description: 'Files only: filter by MIME type (exact match)',
  })
  @IsOptional()
  contentType?: string;

  @ApiPropertyOptional({
    type: Number,
    description: 'Users only: filter by role ID',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  roleId?: number;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Users only: filter by active flag',
    example: true,
  })
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (value === undefined || value === null || value === '') {
      return undefined;
    }
    if (typeof value === 'boolean') {
      return value;
    }
    if (value === 'true') {
      return true;
    }
    if (value === 'false') {
      return false;
    }
    return undefined;
  })
  @IsBoolean()
  isActive?: boolean;
}
