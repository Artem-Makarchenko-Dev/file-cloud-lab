import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import { PrismaService } from '../../prisma/prisma.service';
import { SessionService } from './session/session.service';
import { JwtService } from '@nestjs/jwt';

const SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly sessionService: SessionService,
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: { email?: string; password?: string } = {}) {
    if (!email || !password) {
      throw new BadRequestException({
        code: 'INVALID_INPUT',
        message: 'Email and password are required',
      });
    }

    const user = await this.prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);

    if (!passwordMatch) {
      throw new UnauthorizedException({
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password',
      });
    }

    return {
      id: user.id,
      email: user.email,
      roleId: user.roleId,
    };
  }

  async signup({
    email,
    password,
  }: {
    email?: string;
    password?: string;
  } = {}) {
    if (!email || !password) {
      throw new BadRequestException({
        code: 'INVALID_INPUT',
        message: 'Email and password are required',
      });
    }

    const existingUser = await this.prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      throw new ConflictException({
        code: 'USER_ALREADY_EXISTS',
        message: 'A user with this email already exists',
      });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);

    const createdUser = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        roleId: 1,
      },
      select: {
        id: true,
        email: true,
      },
    });

    return {
      id: createdUser.id,
      email: createdUser.email,
    };
  }

  async refresh(sid?: string, refreshToken?: string) {
    if (!sid || !refreshToken) {
      throw new UnauthorizedException('Missing session');
    }

    const rotated = await this.sessionService.rotateSession(sid, refreshToken);

    if (!rotated) {
      throw new UnauthorizedException('Invalid session');
    }

    const session = await this.sessionService.findValidSession(
      sid,
      rotated.refreshToken,
    );

    if (!session) {
      throw new UnauthorizedException('Session corrupted');
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.userId },
      select: { id: true, roleId: true },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const accessToken = this.jwtService.sign({
      sub: user.id,
      roleId: user.roleId,
    });

    return {
      accessToken,
      refreshToken: rotated.refreshToken,
    };
  }

  async getUserById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        roleId: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
