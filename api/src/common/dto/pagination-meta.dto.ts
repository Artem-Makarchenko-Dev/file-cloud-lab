import { ApiProperty } from '@nestjs/swagger';

export class PaginationMetaDto {
  @ApiProperty({
    example: 42,
    description: 'Total number of items matching the query (all pages)',
  })
  total: number;

  @ApiProperty({ example: 1, description: 'Current page (1-based)' })
  page: number;

  @ApiProperty({ example: 10, description: 'Page size' })
  limit: number;

  @ApiProperty({
    example: 5,
    description: 'Total number of pages (0 when total is 0)',
  })
  totalPages: number;

  @ApiProperty({ example: true, description: 'Whether a next page exists' })
  hasNextPage: boolean;

  @ApiProperty({
    example: false,
    description: 'Whether a previous page exists',
  })
  hasPrevPage: boolean;
}
