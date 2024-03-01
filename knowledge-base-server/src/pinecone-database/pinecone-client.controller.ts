import { Controller } from '@nestjs/common';
import { PineconeClientService } from './pinecone-client.service';
@Controller('pinecone-client')
export class PineconeClientController {
  constructor(private pineconeClientService: PineconeClientService) {}
}
