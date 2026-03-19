import { Controller, Get } from '@nestjs/common';
import { Public } from '../modules/auth/decorators/public.decorator';
import { PrismaService } from './prisma.service';

@Controller('prisma')
export class PrismaController {
  constructor(private readonly prisma: PrismaService) {}

  @Public()
  @Get()
  getUsers() {
    return this.prisma.user.findMany();
  }
}
