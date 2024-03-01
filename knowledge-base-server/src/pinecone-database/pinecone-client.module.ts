import { Module } from '@nestjs/common';

import { PineconeClientController } from './pinecone-client.controller';
import { PineconeClientService } from './pinecone-client.service';

@Module({
  imports: [],
  controllers: [PineconeClientController],
  providers: [PineconeClientService],
})
export class PineconeClientModule {}
