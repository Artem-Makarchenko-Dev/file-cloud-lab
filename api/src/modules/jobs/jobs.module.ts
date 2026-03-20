import { Module } from '@nestjs/common';
import { FileProcessingModule } from './file-processing/file-processing.module';

@Module({
  imports: [FileProcessingModule],
  exports: [FileProcessingModule],
})
export class JobsModule {}
