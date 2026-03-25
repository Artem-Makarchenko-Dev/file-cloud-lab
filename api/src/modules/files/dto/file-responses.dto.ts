import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationMetaDto } from '../../../common/dto/pagination-meta.dto';

export class PresignUploadResponseDto {
  @ApiProperty({
    example: 'https://s3.example.com/bucket/...',
    description: 'Presigned PUT URL for direct upload',
  })
  url: string;

  @ApiProperty({
    example: 'users/1/1710000000000-document.pdf',
    description: 'Object key to send with confirm',
  })
  key: string;
}

export class FileListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'report.pdf' })
  filename: string;

  @ApiPropertyOptional({ example: 1024 })
  size?: number | null;

  @ApiProperty({ example: 'application/pdf' })
  contentType: string;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  createdAt: string;

  @ApiProperty({
    enum: ['PENDING', 'UPLOADED', 'DELETED'],
    example: 'UPLOADED',
  })
  status: string;
}

export class FilesPaginatedResponseDto {
  @ApiProperty({ type: [FileListItemDto] })
  data: FileListItemDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta: PaginationMetaDto;
}

export class FileRecordResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'users/1/1710000000000-file.png' })
  key: string;

  @ApiProperty({ example: 'file.png' })
  filename: string;

  @ApiProperty({ example: 'image/png' })
  contentType: string;

  @ApiPropertyOptional({ example: 2048 })
  size?: number | null;

  @ApiProperty({ enum: ['PENDING', 'UPLOADED', 'DELETED'] })
  status: string;

  @ApiProperty({ example: 1 })
  uploadedBy: number;

  @ApiProperty({ example: '2026-03-25T12:00:00.000Z' })
  createdAt: string;
}

export class DownloadUrlResponseDto {
  @ApiProperty({
    example: 'https://s3.example.com/bucket/...',
    description: 'Time-limited download URL',
  })
  url: string;
}
