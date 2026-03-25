import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

/** Shape returned by the global HTTP exception filter for errors. */
export class HttpErrorResponseDto {
  @ApiProperty({ example: 401, description: 'HTTP status code' })
  statusCode: number;

  @ApiProperty({
    example: 'Unauthorized',
    description: 'Machine-readable code or Nest error name',
  })
  code: string;

  @ApiProperty({
    example: 'Unauthorized',
    description: 'Human-readable message',
  })
  message: string;

  @ApiProperty({
    example: '2026-03-25T12:00:00.000Z',
    description: 'ISO 8601 timestamp when the error was produced',
  })
  timestamp: string;

  @ApiProperty({
    example: '/auth/me',
    description: 'Request path that failed',
  })
  path: string;

  @ApiPropertyOptional({
    description:
      'Optional extra detail (e.g. validation). Omitted when not applicable.',
    type: 'array',
    items: {
      type: 'object',
      additionalProperties: true,
      example: { field: 'email', message: 'must be an email' },
    },
  })
  errors?: Record<string, unknown>[];
}
