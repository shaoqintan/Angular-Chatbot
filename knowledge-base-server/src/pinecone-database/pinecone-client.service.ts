import { Injectable, OnModuleInit } from '@nestjs/common';
import { PineconeClient } from '@pinecone-database/pinecone';

@Injectable()
export class PineconeClientService implements OnModuleInit {
  private pinecone: PineconeClient;

  async onModuleInit() {
    if (!process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_API_KEY) {
      throw new Error('Pinecone environment or api key vars missing');
    }

    this.pinecone = await this.initPinecone();
  }

  private async initPinecone(): Promise<PineconeClient> {
    try {
      const pinecone = new PineconeClient();

      await pinecone.init({
        environment: process.env.PINECONE_ENVIRONMENT ?? '',
        apiKey: process.env.PINECONE_API_KEY ?? '',
      });

      console.log('instantion complete')
      return pinecone;
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to initialize Pinecone Client');
    }
  }
  public getPineconeClient(): PineconeClient {
    return this.pinecone;
  }
}
