import {
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  Param,
  ParseFilePipe,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import * as fs from 'fs'
import { Sequelize } from 'sequelize-typescript';
import { InjectModel } from '@nestjs/sequelize';
import { Files } from './file-uploader.model';
import { FileUploadService } from './file-uploader.service';

@Controller('file-upload')
@ApiTags('File Upload')
export class FileUploadController {
  constructor(private sequelize: Sequelize, @InjectModel(Files)
  private filesModel: typeof Files, private fileUploadService: FileUploadService) { }
  @Post('upload')
  @UseInterceptors(FilesInterceptor('files', 3, {
    storage: diskStorage({
      destination: './docs',
      filename: (req, file, callback) => {
        const uniqueSuffix =
          Date.now() + '-' + Math.round(Math.random() * 1e9);
        const filename = `${uniqueSuffix}${file.originalname}`;
        callback(null, filename);
      },
    }),
  }))

  async upload(@UploadedFiles() files: Express.Multer.File[]) {
    for (const file of files) {
      const filename_id = file.filename;
      const filename_name = file.originalname;
      await this.filesModel.create({ filename_id, filename_name });
    }
  }
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload files', description: 'Upload multiple files of type PDF. Key of the form data body is "files"' })
  async uploadFile(@UploadedFiles(new ParseFilePipe({
    validators: [
      new FileTypeValidator({ fileType: 'pdf' }),
    ],
  }),) files: Array<Express.Multer.File>) {
    return { message: 'Files uploaded successfully' }
  }

  @Get()
  getFileList() {
    return fs.readdirSync('./docs');
  }

  @Get(':filename_id')
  async findOne(@Param('filename_id') filenameId: string) {
    return this.fileUploadService.findFilenameNameById(filenameId);
  }

  @Delete('delete-file/:filename')
  deleteFile(@Param('filename') filename: string) {
    fs.unlink(`./docs/${filename}`, (err) => {
      if (err) {
        throw err;
      }
    })
  }
}
