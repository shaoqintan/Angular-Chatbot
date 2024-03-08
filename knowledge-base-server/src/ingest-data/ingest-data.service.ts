import { Injectable } from '@nestjs/common';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
//import { CohereEmbeddings } from 'langchain/embeddings/Cohere';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { CustomPDFLoaderService } from 'src/customPDFLoader/customPDFLoader.service';
import { DirectoryLoader } from 'langchain/document_loaders/fs/directory';
import { PineconeClientService } from 'src/pinecone-database/pinecone-client.service';

@Injectable()
export class IngestDataService {
  /* Name of directory to retrieve your files from */
  filePath = 'docs/';

  constructor(private pineconeClientService: PineconeClientService) {}

  async ingestData() {
    try {
      /*load raw docs from the all files in the directory */
      const directoryLoader = new DirectoryLoader(this.filePath, {
        '.pdf': (path) => new CustomPDFLoaderService(path),
      });

      // const loader = new PDFLoader(filePath);
      const rawDocs = await directoryLoader.load();

      /* Split text into chunks */
      const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 1000,
        chunkOverlap: 200,
      });

      console.log('split docs...');
      const docs = await textSplitter.splitDocuments(rawDocs);

      console.log('creating vector store...');
      /*create and store the embeddings in the vectorStore*/
      const embeddings = new OpenAIEmbeddings();
      //const embeddings = new CohereEmbeddings();
      const index = this.pineconeClientService
        .getPineconeClient()
        .Index(process.env.PINECONE_INDEX_NAME); //change to your own index name

      //embed the PDF documents
      await PineconeStore.fromDocuments(docs, embeddings, {
        pineconeIndex: index,
        namespace: process.env.PINECONE_NAME_SPACE,
        textKey: 'text',
      });
    } catch (error) {
      console.log('error', error);
      throw new Error('Failed to ingest your data');
    }
    console.log('ingestion complete');
  }
}
