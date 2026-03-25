import { ApiProperty } from '@nestjs/swagger';

export class ConnectionResponseDto {
  @ApiProperty({
    example: 'Yeah! Beackend is connected',
    description: 'Human-readable connectivity message',
  })
  message: string;
}
