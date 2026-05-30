import { Module } from '@nestjs/common';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';
import { PrismaModule } from '../../prisma/prisma.module';
import { StorageModule } from '../../infrastructure/storage/storage.module';
import { FileProcessingModule } from '../jobs/file-processing/file-processing.module';

@Module({
  imports: [PrismaModule, StorageModule, FileProcessingModule],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
