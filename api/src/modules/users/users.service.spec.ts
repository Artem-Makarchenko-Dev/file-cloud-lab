import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: DeepMockProxy<PrismaService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockDeep<PrismaService>(),
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated result with meta', async () => {
      prisma.$transaction.mockResolvedValue([
        [
          {
            id: 1,
            email: 'test@test.com',
            isActive: true,
            createdAt: new Date(),
            role: { name: 'USER' },
          },
        ],
        1,
      ] as never);

      const result = await service.findAll({
        page: 1,
        limit: 10,
        sortBy: 'createdAt',
        order: 'desc',
      } as never);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
      expect(result.meta.totalPages).toBe(1);
      expect(result.meta.hasNextPage).toBe(false);
      expect(result.meta.hasPrevPage).toBe(false);
    });

    it('should calculate skip correctly for page 2', async () => {
      prisma.$transaction.mockResolvedValue([[], 0] as never);

      await service.findAll({ page: 2, limit: 10 } as never);

      const findManyArgs = prisma.user.findMany.mock.calls[0][0]!;
      expect(findManyArgs.skip).toBe(10);
      expect(findManyArgs.take).toBe(10);
    });

    it('should fallback to createdAt when invalid sort field', async () => {
      prisma.$transaction.mockResolvedValue([[], 0] as never);

      await service.findAll({ page: 1, limit: 10, sortBy: 'invalid' } as never);

      const findManyArgs = prisma.user.findMany.mock.calls[0][0]!;
      expect(findManyArgs.orderBy).toEqual({ createdAt: 'desc' });
    });

    it('should apply roleId filter', async () => {
      prisma.$transaction.mockResolvedValue([[], 0] as never);

      await service.findAll({ page: 1, limit: 10, roleId: 2 } as never);

      const findManyArgs = prisma.user.findMany.mock.calls[0][0]!;
      expect(findManyArgs.where).toEqual({ roleId: 2 });
    });

    it('should apply isActive filter', async () => {
      prisma.$transaction.mockResolvedValue([[], 0] as never);

      await service.findAll({ page: 1, limit: 10, isActive: true } as never);

      const findManyArgs = prisma.user.findMany.mock.calls[0][0]!;
      expect(findManyArgs.where).toEqual({ isActive: true });
    });

    it('should set hasNextPage true when more pages exist', async () => {
      prisma.$transaction.mockResolvedValue([[], 25] as never);

      const result = await service.findAll({ page: 1, limit: 10 } as never);

      expect(result.meta.totalPages).toBe(3);
      expect(result.meta.hasNextPage).toBe(true);
    });

    it('should return totalPages 0 when total is 0', async () => {
      prisma.$transaction.mockResolvedValue([[], 0] as never);

      const result = await service.findAll({ page: 1, limit: 10 } as never);

      expect(result.meta.totalPages).toBe(0);
      expect(result.meta.hasNextPage).toBe(false);
    });
  });

  describe('findById', () => {
    it('should return user if exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1 } as never);

      const result = await service.findById(1);

      expect(result).toEqual({ id: 1 });
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findById(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('delete', () => {
    it('should delete user if exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 1 } as never);
      prisma.user.delete.mockResolvedValue({ id: 1 } as never);

      const result = await service.delete(1);

      expect(prisma.user.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual({ id: 1 });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.delete(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findRoleByUserId', () => {
    it('should return role if found', async () => {
      prisma.user.findUnique.mockResolvedValue({
        role: { id: 1, name: 'ADMIN' },
      } as never);

      const result = await service.findRoleByUserId(1);

      expect(result).toEqual({ id: 1, name: 'ADMIN' });
    });

    it('should throw NotFoundException if user not found', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      await expect(service.findRoleByUserId(1)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw NotFoundException if role is null', async () => {
      prisma.user.findUnique.mockResolvedValue({ role: null } as never);

      await expect(service.findRoleByUserId(1)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
