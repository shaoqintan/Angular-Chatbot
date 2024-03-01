import { Injectable } from '@nestjs/common';
import { Document } from 'langchain/document';
import * as pdf from 'pdf-parse/lib/pdf-parse.js';
import { BufferLoader } from './bufferLoader';

@Injectable()
export class CustomPDFLoaderService extends BufferLoader {
  public async parse(
    raw: Buffer,
    metadata: Document['metadata'],
  ): Promise<Document[]> {
    const parsed = await pdf(raw);
    return [
      new Document({
        pageContent: parsed.text,
        metadata: {
          ...metadata,
          pdf_numpages: parsed.numpages,
        },
      }),
    ];
  }
}
