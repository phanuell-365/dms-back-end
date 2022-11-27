import { Module } from '@nestjs/common';
import { DocumentBoxMetadataService } from './document-box-metadata.service';
import { documentBoxMetadataProvider } from './document-box-metadata.provider';

@Module({
  providers: [DocumentBoxMetadataService, ...documentBoxMetadataProvider],
})
export class DocumentBoxMetadataModule {}
