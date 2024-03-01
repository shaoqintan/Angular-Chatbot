import {
  Controller,
  Post,
  Body,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { OpenAIEmbeddings } from 'langchain/embeddings/openai';
//import { CohereEmbeddings } from 'langchain/embeddings/Cohere';
import { PineconeStore } from 'langchain/vectorstores/pinecone';
import { PineconeClientService } from 'src/pinecone-database/pinecone-client.service';
import { ApiBody, ApiCreatedResponse, ApiOperation, ApiProperty, ApiResponse } from '@nestjs/swagger';
//import { Cohere } from 'langchain/llms/cohere';

@Controller('chat')
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private readonly pineconeClientService: PineconeClientService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Chat with the AI' })
  @ApiBody({
    description: 'User question and chat history. Question is a required field. Question is of type string. History is of type array, while each array item is of type string.', schema: {
      type: 'object',
      properties: {
        question: { type: 'string', example: 'What is the capital of France?' },
        history: { type: 'array', items: { type: 'string', example: 'Paris is the capital of France.' } },
      },
      required: ['question'],
    },
  })
  async handler(
    @Body('question') question: string,
    @Body('history') history: Array<any>,
  ) {
    if (!question) {
      throw new BadRequestException('No question in the request');
    }
    // OpenAI recommends replacing newlines with spaces for best results
    const sanitizedQuestion = question.trim().replaceAll('\n', ' ');

    try {
      const index = this.pineconeClientService
        .getPineconeClient()
        .Index(process.env.PINECONE_INDEX_NAME);

      /* create vectorstore*/
      const vectorStore = await PineconeStore.fromExistingIndex(
        new OpenAIEmbeddings({}),
        //new CohereEmbeddings({}),
        {
          pineconeIndex: index,
          textKey: 'text',
          namespace: process.env.PINECONE_NAME_SPACE, //namespace comes from your config folder
        },
      );

      //create chain
      const chain = this.chatService.makeChain(vectorStore);
      //Ask a question using chat history
      console.log(history);
      const parsedHs = history.map((value) => ({
        content: value['content'],
        _getType: () => value.role
      }))

      const response = await chain.call({
        question: sanitizedQuestion,
        chat_history: history.map((value) => ({
          content: value['content'],
          _getType: () => value.role
        })),
      });
      console.log(parsedHs);
      console.log('response', response);
      return response;
    } catch (error: any) {
      console.log('error', error);
      throw new InternalServerErrorException(
        error.message || 'Something went wrong',
      );
    }
  }
}
