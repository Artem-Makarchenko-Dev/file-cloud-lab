import { applyDecorators } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';
import { SignupDto } from '../dto/signup.dto';

export function SwaggerSignup() {
  return applyDecorators(
    ApiOperation({ summary: 'Register new user' }),
    ApiBody({ type: SignupDto }),
    ApiResponse({ status: 201, description: 'User successfully created' }),
    ApiResponse({ status: 400, description: 'Validation failed' }),
  );
}

export function SwaggerLogin() {
  return applyDecorators(
    ApiOperation({ summary: 'User login' }),
    ApiBody({ type: LoginDto }),
    ApiResponse({
      status: 200,
      description: 'User successfully logged in',
      schema: {
        example: { accessToken: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
      },
    }),
    ApiResponse({ status: 401, description: 'Invalid credentials' }),
  );
}

export function SwaggerLogout() {
  return applyDecorators(
    ApiOperation({ summary: 'Logout current user' }),
    ApiBearerAuth('access-token'),
    ApiResponse({ status: 200, description: 'Successfully logged out' }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function SwaggerRefresh() {
  return applyDecorators(
    ApiOperation({ summary: 'Refresh access token using refresh cookie' }),
    ApiCookieAuth(),
    ApiResponse({
      status: 200,
      description: 'Access token refreshed',
      schema: { example: { accessToken: 'newAccessToken...' } },
    }),
    ApiResponse({ status: 401, description: 'Invalid or expired session' }),
  );
}

export function SwaggerMe() {
  return applyDecorators(
    ApiOperation({ summary: 'Get current authenticated user' }),
    ApiBearerAuth('access-token'),
    ApiResponse({
      status: 200,
      description: 'Current authenticated user',
      schema: { example: { id: 1, email: 'user@mail.com', roleId: 2 } },
    }),
    ApiResponse({ status: 401, description: 'Unauthorized' }),
  );
}

export function SwaggerGoogleStart() {
  return applyDecorators(
    ApiOperation({ summary: 'Start Google OAuth flow' }),
    ApiResponse({ status: 302, description: 'Redirect to Google OAuth' }),
  );
}

export function SwaggerGoogleCallback() {
  return applyDecorators(
    ApiOperation({ summary: 'Google OAuth callback handler' }),
    ApiResponse({
      status: 302,
      description: 'Redirect after successful authentication',
    }),
    ApiResponse({ status: 401, description: 'OAuth failed' }),
  );
}
