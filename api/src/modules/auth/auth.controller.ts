import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { SignupDto } from './dto/signup.dto';
import { SessionService } from './session/session.service';
import { clearAuthCookies, setAuthCookies, setRefreshCookie } from './auth.cookies';
import { SessionAuthGuard } from './guards/session-auth.guard';
import { JwtService } from '@nestjs/jwt';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Public } from './decorators/public.decorator';
import type { AuthUser } from './types/auth-user.type';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly sessionService: SessionService,
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
  async login(
    @Body() body: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.authService.login(body);

    const { sid, refreshToken } = await this.sessionService.createSession(user.id);
    setAuthCookies(res, sid, refreshToken);

    const accessToken = this.jwtService.sign({
      sub: user.id,
      roleId: user.roleId,
    });

    return { accessToken };
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sid = req.cookies?.['sid'];
    if (sid) {
      await this.sessionService.revokeSession(sid);
    }
    clearAuthCookies(res);
    return { ok: true };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const sid = req.cookies?.['sid'];
    const refreshToken = req.cookies?.['refresh'];

    const { accessToken, refreshToken: newRefresh } =
      await this.authService.refresh(sid, refreshToken);

    setRefreshCookie(res, newRefresh);

    return { accessToken };
  }

  @Get('me')
  @UseGuards(SessionAuthGuard, JwtAuthGuard)
  async me(@Req() req: Request) {
    return (req as any).user as AuthUser;
  }
}
