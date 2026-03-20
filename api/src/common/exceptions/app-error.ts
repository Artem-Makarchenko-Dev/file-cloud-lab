import { HttpStatus } from '@nestjs/common';
import { ErrorCode } from './error-codes.enum';

export class AppError extends Error {
  constructor(
    public readonly code: ErrorCode,
    public readonly statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
    message?: string,
  ) {
    super(message ?? code);
  }
}
