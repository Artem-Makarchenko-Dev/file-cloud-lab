import { Controller, Get } from '@nestjs/common';
import { PrismaService } from './prisma.service' 

@Controller('prisma')
export class PrismaController {
    constructor(private readonly prisma: PrismaService) {}

    @Get()
    getUsers() {
        return this.prisma.user.findMany()
    }
}
