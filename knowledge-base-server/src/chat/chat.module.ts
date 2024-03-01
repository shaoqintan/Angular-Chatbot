import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { PineconeClientService } from 'src/pinecone-database/pinecone-client.service';

@Module({
  imports: [],
  controllers: [ChatController],
  providers: [ChatService, PineconeClientService],
})
export class ChatModule { }
