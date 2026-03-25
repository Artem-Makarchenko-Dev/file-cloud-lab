import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LivenessResponseDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: 3600.12, description: 'Process uptime in seconds' })
  uptime: number;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  timestamp: string;
}

export class PostgresCheckDto {
  @ApiProperty({ enum: ['up', 'down'], example: 'up' })
  status: string;

  @ApiPropertyOptional({ example: 3, description: 'Round-trip latency in ms' })
  latencyMs?: number;
}

export class ReadinessChecksDto {
  @ApiProperty({ type: PostgresCheckDto })
  postgres: PostgresCheckDto;
}

export class ReadinessResponseDto {
  @ApiProperty({ enum: ['ok', 'error'], example: 'ok' })
  status: string;

  @ApiProperty({ type: ReadinessChecksDto })
  checks: ReadinessChecksDto;

  @ApiProperty({ example: 3600.12 })
  uptime: number;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  timestamp: string;
}
