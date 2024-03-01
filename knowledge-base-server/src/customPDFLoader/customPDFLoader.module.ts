import { Module } from '@nestjs/common';
import { CustomPDFLoaderService } from './customPDFLoader.service';

@Module({
  imports: [],
  controllers: [],
  providers: [CustomPDFLoaderService],
})
export class CustomPDFLoaderModule {}
