import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Files } from './file-uploader.model';

@Injectable()
export class FileUploadService {
    constructor(@InjectModel(Files)
    private filesModel: typeof Files,) { }

    async findFilenameNameById(filenameId: string): Promise<string | null> {
        const entry = await this.filesModel.findOne({
            where: { filename_id: filenameId },
            attributes: ['filename_name'],
        });

        return entry ? entry.filename_name : null;
    }
}
