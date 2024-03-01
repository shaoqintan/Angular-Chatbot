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

  QA_PROMPT = `You are a helpful AI assistant. Use the following pieces of context to answer the question at the end.
    If you don't know the answer, just say you don't know. DO NOT try to make up an answer.
    If the question is not related to the context, politely respond that you are tuned to only answer questions that are related to the context.
    
    {context}
    
    Question: {question}
    Helpful answer in markdown:`;

  makeChain(vectorstore: PineconeStore) {
    const model = new OpenAI({
      temperature: 1, // increase temepreature to get more creative answers
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
