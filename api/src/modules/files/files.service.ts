import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FileStatus } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';
import type { StorageProvider } from '../../infrastructure/storage/storage.provider';
import { STORAGE } from '../../infrastructure/storage/storage.module';

@Injectable()
export class FilesService {
  constructor(
    @Inject(STORAGE)
    private readonly storage: StorageProvider,
    private readonly prisma: PrismaService,
  ) {}

  async presignUpload(userId: number, filename: string, contentType: string) {
    const safeFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '');
    const key = `users/${userId}/${Date.now()}-${safeFilename}`;

    await this.prisma.file.create({
      data: {
        key,
        filename: safeFilename,
        contentType,
        uploadedBy: userId,
        status: FileStatus.PENDING,
      },
    });

    const url = await this.storage.generateUploadUrl({ key, contentType });

    return { url, key };
  }

  async confirmUpload(userId: number, key: string) {
    const file = await this.prisma.file.findUnique({ where: { key } });

    if (!file || file.uploadedBy !== userId) {
      throw new ForbiddenException();
    }

    if (file.status !== FileStatus.PENDING) {
      throw new BadRequestException('Invalid file status');
    }

    let metadata;
    try {
      metadata = await this.storage.headObject(key);
    } catch {
      throw new BadRequestException('File not uploaded to storage');
    }

    return this.prisma.file.update({
      where: { key },
      data: {
        status: FileStatus.UPLOADED,
        size: metadata?.ContentLength,
      },
    });
  }

  async findAll(userId: number) {
    return this.prisma.file.findMany({
      where: { uploadedBy: userId },
      select: {
        id: true,
        filename: true,
        size: true,
        contentType: true,
        createdAt: true,
        status: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async generateDownloadUrl(userId: number, fileId: number) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });

    if (!file || file.uploadedBy !== userId) {
      throw new ForbiddenException();
    }

    if (file.status !== FileStatus.UPLOADED) {
      throw new BadRequestException('File not available for download');
    }

    const url = await this.storage.generateDownloadUrl({ key: file.key });

    return { url };
  }

  async findByUserId(userId: number) {
    return this.prisma.file.findMany({
      where: { uploadedBy: userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async softDelete(userId: number, fileId: number) {
    const file = await this.prisma.file.findUnique({ where: { id: fileId } });

    if (!file || file.uploadedBy !== userId) {
      throw new ForbiddenException();
    }

    if (file.status === FileStatus.DELETED) {
      throw new BadRequestException('File already deleted');
    }

    await this.storage.deleteObject(file.key);

    return this.prisma.file.update({
      where: { id: fileId },
      data: { status: FileStatus.DELETED },
    });
  }
}
