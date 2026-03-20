import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CompleteUploadDto } from '../dto/complete-upload.dto';
import { PresignUploadDto } from '../dto/presign-upload.dto';

export function SwaggerFilesController() {
  return applyDecorators(ApiTags('Files'), ApiBearerAuth('access-token'));
}

export function SwaggerPresign() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate presigned URL for file upload' }),
    ApiBody({ type: PresignUploadDto }),
    ApiResponse({
      status: 201,
      description: 'Presigned URL generated successfully',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function SwaggerConfirm() {
  return applyDecorators(
    ApiOperation({
      summary: 'Confirm file upload after S3 upload is complete',
    }),
    ApiBody({ type: CompleteUploadDto }),
    ApiResponse({
      status: 201,
      description: 'Upload confirmed and file saved in DB',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function SwaggerFindAllFiles() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all user files' }),
    ApiResponse({ status: 200, description: 'List of user files' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function SwaggerDownloadFile() {
  return applyDecorators(
    ApiOperation({ summary: 'Generate temporary download URL for file' }),
    ApiParam({ name: 'id', type: Number, description: 'File ID' }),
    ApiResponse({ status: 200, description: 'Download URL generated' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'File not found' }),
  );
}

export function SwaggerDeleteFile() {
  return applyDecorators(
    ApiOperation({ summary: 'Soft delete file' }),
    ApiParam({ name: 'id', type: Number, description: 'File ID' }),
    ApiResponse({ status: 200, description: 'File soft-deleted' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}
