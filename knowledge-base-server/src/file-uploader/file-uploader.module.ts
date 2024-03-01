import { Module } from '@nestjs/common';
import { FileUploadService } from './file-uploader.service';
import { FileUploadController } from './file-uploader.controller';
import { Files } from './file-uploader.model';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  imports: [SequelizeModule.forFeature([Files])],
  controllers: [FileUploadController],
  providers: [FileUploadService],
})
export class FileUploadModule { }
