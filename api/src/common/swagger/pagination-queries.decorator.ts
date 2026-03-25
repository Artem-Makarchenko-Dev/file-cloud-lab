import { applyDecorators } from '@nestjs/common';
import { ApiQuery } from '@nestjs/swagger';

export function ApiUsersPaginationQueries() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Page number (1-based). Coerced from query string.',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 10,
      description: 'Items per page (1–100). Coerced from query string.',
    }),
    ApiQuery({
      name: 'roleId',
      required: false,
      type: Number,
      description: 'Filter users by role ID',
    }),
    ApiQuery({
      name: 'isActive',
      required: false,
      type: Boolean,
      description: 'Filter by active flag',
    }),
  );
}

export function ApiFilesPaginationQueries() {
  return applyDecorators(
    ApiQuery({
      name: 'page',
      required: false,
      type: Number,
      example: 1,
      description: 'Page number (1-based). Coerced from query string.',
    }),
    ApiQuery({
      name: 'limit',
      required: false,
      type: Number,
      example: 10,
      description: 'Items per page (1–100). Coerced from query string.',
    }),
    ApiQuery({
      name: 'status',
      required: false,
      type: String,
      enum: ['PENDING', 'UPLOADED', 'DELETED'],
      description: 'Filter files by processing status',
    }),
    ApiQuery({
      name: 'contentType',
      required: false,
      type: String,
      description: 'Filter by MIME type (exact match, e.g. image/png)',
    }),
  );
}
