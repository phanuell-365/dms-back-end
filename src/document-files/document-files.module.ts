import { Module } from '@nestjs/common';
import { DocumentFilesService } from './document-files.service';
import { documentFilesProvider } from './document-files.provider';

@Module({
  providers: [DocumentFilesService, ...documentFilesProvider],
})
export class DocumentFilesModule {}
