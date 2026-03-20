import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import type { Request } from 'express';
import { FilesService } from './files.service';
import { CompleteUploadDto } from './dto/complete-upload.dto';
import { PresignUploadDto } from './dto/presign-upload.dto';
import {
  SwaggerFilesController,
  SwaggerPresign,
  SwaggerConfirm,
  SwaggerFindAllFiles,
  SwaggerDownloadFile,
  SwaggerDeleteFile,
} from './swagger/files.swagger';

@SwaggerFilesController()
@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('presign')
  @SwaggerPresign()
  async presignUpload(@Body() dto: PresignUploadDto, @Req() req: Request) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    return this.filesService.presignUpload(
      userId,
      dto.filename,
      dto.contentType,
    );
  }

  @Post('confirm')
  @SwaggerConfirm()
  async confirm(@Body() dto: CompleteUploadDto, @Req() req: Request) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    return this.filesService.confirmUpload(userId, dto.key);
  }

  @Get()
  @SwaggerFindAllFiles()
  async findAll(@Req() req: Request) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    return this.filesService.findAll(userId);
  }

  @Get(':id/download')
  @SwaggerDownloadFile()
  async download(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    return this.filesService.generateDownloadUrl(userId, id);
  }

  @Delete(':id')
  @SwaggerDeleteFile()
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    const userId = req.user?.id;
    if (!userId) throw new UnauthorizedException();

    return this.filesService.softDelete(userId, id);
  }
}
