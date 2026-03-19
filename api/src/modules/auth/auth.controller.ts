import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { JwtService } from '@nestjs/jwt';
import { Public } from './decorators/public.decorator';
import type { AuthUser } from './types/auth-user.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() body: SignupDto) {
    return this.authService.signup(body);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    const user = await this.authService.login(body);

    const accessToken = this.jwtService.sign({
      sub: user.id,
      roleId: user.roleId,
    });

    return { accessToken };
  }

  @Get('me')
  async me(@Req() req: Request) {
    return (req as any).user as AuthUser;
  }
}
