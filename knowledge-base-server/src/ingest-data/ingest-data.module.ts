import { Module } from '@nestjs/common';
import { IngestDataService } from './ingest-data.service';
import { PineconeClientService } from 'src/pinecone-database/pinecone-client.service';
import { IngestDataController } from './ingest-data.controller';

@Module({
  imports: [],
  controllers: [IngestDataController],
  providers: [IngestDataService, PineconeClientService],
})
export class IngestDataModule { }
