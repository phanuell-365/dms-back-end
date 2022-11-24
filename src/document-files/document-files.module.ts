import { Module } from '@nestjs/common';
import { DocumentFilesService } from './document-files.service';
import { DocumentFilesController } from './document-files.controller';

@Module({
  controllers: [DocumentFilesController],
  providers: [DocumentFilesService]
})
export class DocumentFilesModule {}
