import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

export function SwaggerUsersController() {
  return applyDecorators(ApiTags('Users'), ApiBearerAuth('access-token'));
}

export function SwaggerFindAllUsers() {
  return applyDecorators(
    ApiOperation({ summary: 'Get all users (admin only)' }),
    ApiResponse({
      status: 200,
      description: 'List of users returned successfully',
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden (missing permission)' }),
  );
}

export function SwaggerFindOneUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Get user by ID' }),
    ApiParam({ name: 'id', type: Number, description: 'User ID' }),
    ApiResponse({ status: 200, description: 'User found' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}

export function SwaggerDeleteUser() {
  return applyDecorators(
    ApiOperation({ summary: 'Delete user by ID (admin only)' }),
    ApiParam({ name: 'id', type: Number, description: 'User ID' }),
    ApiResponse({ status: 200, description: 'User deleted successfully' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
    ApiResponse({ status: 403, description: 'Forbidden (missing permission)' }),
    ApiResponse({ status: 404, description: 'User not found' }),
  );
}
