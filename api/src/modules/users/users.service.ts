import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { PaginationResponse } from '../../common/types/pagination-response';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll({
    page,
    limit,
    sortBy,
    order,
    roleId,
    isActive,
  }: PaginationDto): Promise<PaginationResponse<unknown>> {
    const skip = (page - 1) * limit;

    const allowedSortFields = ['createdAt', 'email'];
    const sortField = allowedSortFields.includes(sortBy ?? '')
      ? sortBy
      : 'createdAt';
    const sortOrder = order ?? 'desc';

    const where = {
      ...(roleId !== undefined && { roleId: Number(roleId) }),
      ...(isActive !== undefined && { isActive }),
    };

    const [data, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          isActive: true,
          createdAt: true,
          role: { select: { name: true } },
        },
        skip,
        take: limit,
        orderBy: { [sortField!]: sortOrder },
      }),
      this.prisma.user.count({ where }),
    ]);

    const totalPages = total === 0 ? 0 : Math.ceil(total / limit);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };
  }

  async findById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async delete(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('User not found');

    return this.prisma.user.delete({ where: { id } });
  }

  async findRoleByUserId(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: {
          select: {
            id: true,
            name: true,
            description: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!user?.role) {
      throw new NotFoundException('Role not found');
    }

    return user.role;
  }
}
