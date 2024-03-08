import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PineconeClientModule } from 'src/pinecone-database/pinecone-client.module';
import { ConfigModule } from '@nestjs/config';
import { IngestDataModule } from 'src/ingest-data/ingest-data.module';
import { CustomPDFLoaderModule } from './customPDFLoader/customPDFLoader.module';
import { ChatModule } from './chat/chat.module';
import { FileUploadModule } from './file-uploader/file-uploader.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports: [
    PineconeClientModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    IngestDataModule,
    CustomPDFLoaderModule,
    ChatModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      renderPath: '/docs',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
