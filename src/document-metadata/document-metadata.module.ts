import { Module } from '@nestjs/common';
import { DocumentMetadataService } from './document-metadata.service';
import { documentMetadataProvider } from './document-metadata.provider';

@Module({
  providers: [DocumentMetadataService, ...documentMetadataProvider],
})
export class DocumentMetadataModule {}
