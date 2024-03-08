import { Injectable } from '@nestjs/common';
//import { CohereEmbeddings } from 'langchain/embeddings/Cohere';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
// import { makeChain } from '@/utils/makechain';
// import { pinecone } from '@/utils/pinecone-client';
import { PineconeClientService } from 'src/pinecone-database/pinecone-client.service';
import { OpenAI } from 'langchain/llms/openai';
//import { Cohere } from 'langchain/llms/cohere';
import { ConversationalRetrievalQAChain } from 'langchain/chains';

@Injectable()
export class ChatService {
  constructor(private pineconeClientService: PineconeClientService) { }
  CONDENSE_PROMPT = `Given the following conversation and a follow up question, rephrase the follow up question to be a standalone question.

    Chat History:
    {chat_history}
    Follow Up Input: {question}
    Standalone question:`;

  QA_PROMPT = process.env.QA_PROMPT; // prompt engineering to make sure the output tone align with the character given

  makeChain(vectorstore: PineconeStore) {
    const model = new OpenAI({
      temperature: 0.8, // increase temepreature to get more creative answers
      modelName: 'gpt-3.5-turbo', //change this to gpt-4 if you have access
    });

    //const model = new Cohere({
    //  temperature: 0, // increase temepreature to get more creative answers
    //  model: ,
    //  apiKey: 'U66BHwPHuFjdUlLFweTcT9hQkl2uBOsxPkuElAmg',
    //});

    const chain = ConversationalRetrievalQAChain.fromLLM(
      model,
      vectorstore.asRetriever(),
      {
        qaTemplate: this.QA_PROMPT,
        questionGeneratorTemplate: this.CONDENSE_PROMPT,
        returnSourceDocuments: true, //The number of source documents returned is 4 by default
      },
    );
    return chain;
  }
}
