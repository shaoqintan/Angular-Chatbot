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
import { Files } from './file-uploader/file-uploader.model';
@Module({
  imports: [
    PineconeClientModule,
    ConfigModule.forRoot({
      envFilePath: '.env',
    }),
    IngestDataModule,
    CustomPDFLoaderModule,
    ChatModule,
    FileUploadModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..'),
      renderPath: '/docs',
    }),
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: '10.0.17.35',
      port: 32432,
      username: 'vone',
      password: 'vone',
      database: 'knowledge_base',
      autoLoadModels: true,
      synchronize: true,

    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
