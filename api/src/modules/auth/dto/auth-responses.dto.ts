import { ApiProperty } from '@nestjs/swagger';

export class SignupResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@email.com' })
  email: string;
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'Short-lived JWT for Authorization: Bearer',
  })
  accessToken: string;
}

export class LogoutResponseDto {
  @ApiProperty({ example: true })
  ok: boolean;
}

export class RefreshResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'New access token; refresh cookie is rotated via Set-Cookie',
  })
  accessToken: string;
}

export class MeResponseDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'user@email.com' })
  email: string;

  @ApiProperty({ example: 2 })
  roleId: number;

  @ApiProperty({
    isArray: true,
    type: String,
    example: ['users.read', 'users.delete'],
    description: 'Effective permission codes from the user role',
  })
  permissions: string[];
}
