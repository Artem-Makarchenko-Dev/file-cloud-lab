import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiServiceUnavailableResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { HttpErrorResponseDto } from '../dto/http-error-response.dto';

const simpleExample = (statusCode: number, message: string) => ({
  statusCode,
  message,
});

export function ApiErrBadRequest(
  description = 'Bad request or validation failure',
) {
  return ApiBadRequestResponse({
    description,
    type: HttpErrorResponseDto,
    schema: {
      example: simpleExample(400, 'Validation failed'),
    },
  });
}

export function ApiErrUnauthorized(description = 'Missing or invalid JWT') {
  return ApiUnauthorizedResponse({
    description,
    type: HttpErrorResponseDto,
    schema: {
      example: simpleExample(401, 'Unauthorized'),
    },
  });
}

export function ApiErrForbidden(description = 'Insufficient permissions') {
  return ApiForbiddenResponse({
    description,
    type: HttpErrorResponseDto,
    schema: {
      example: simpleExample(403, 'Forbidden'),
    },
  });
}

export function ApiErrNotFound(description = 'Resource not found') {
  return ApiNotFoundResponse({
    description,
    type: HttpErrorResponseDto,
    schema: {
      example: simpleExample(404, 'Not Found'),
    },
  });
}

export function ApiErrConflict(description = 'Resource conflict') {
  return ApiConflictResponse({
    description,
    type: HttpErrorResponseDto,
    schema: {
      example: simpleExample(409, 'Conflict'),
    },
  });
}

export function ApiErrInternal(description = 'Unexpected server error') {
  return ApiInternalServerErrorResponse({
    description,
    type: HttpErrorResponseDto,
    schema: {
      example: simpleExample(500, 'Internal server error'),
    },
  });
}

export function ApiErrServiceUnavailable(
  description = 'Dependency not ready (e.g. database)',
) {
  return ApiServiceUnavailableResponse({
    description,
    type: HttpErrorResponseDto,
    schema: {
      example: simpleExample(503, 'Service Unavailable'),
    },
  });
}

/** Typical stack for JWT + RBAC list/read endpoints */
export function ApiErrorsAuthenticatedList() {
  return applyDecorators(
    ApiErrUnauthorized(),
    ApiErrForbidden('Missing required permission'),
  );
}

/** JWT + RBAC + optional 404 */
export function ApiErrorsAuthenticatedRead() {
  return applyDecorators(
    ApiErrUnauthorized(),
    ApiErrForbidden('Missing required permission'),
    ApiErrNotFound(),
  );
}

/** JWT-protected mutation that may 404 */
export function ApiErrorsAuthenticatedWrite() {
  return applyDecorators(
    ApiErrUnauthorized(),
    ApiErrForbidden(),
    ApiErrNotFound(),
  );
}
