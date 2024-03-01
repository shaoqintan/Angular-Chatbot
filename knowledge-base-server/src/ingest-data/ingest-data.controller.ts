import { Controller, Get } from '@nestjs/common';
import { IngestDataService } from './ingest-data.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('ingest-data')
@ApiTags('Ingest Data')
export class IngestDataController {
  constructor(private readonly ingestDataService: IngestDataService) {}

  @Get()
  @ApiOperation({ summary: 'Ingest data', description: 'Ingest data from PDF documents and create embeddings.' })
  @ApiResponse({ status: 200, description: 'Data ingestion successful' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  ingestData() {
    return this.ingestDataService.ingestData();
  }
}
