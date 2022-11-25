import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './documents.controller';
import { DocumentVersionsService } from '../document-versions/document-versions.service';
import { DocumentMetadataService } from '../document-metadata/document-metadata.service';
import { documentMetadataProvider } from '../document-metadata/document-metadata.provider';
import { documentProvider } from './document.provider';
import { documentFilesProvider } from '../document-files/document-files.provider';
import { documentVersionsProvider } from '../document-versions/document-versions.provider';
import { DocumentVersionsModule } from '../document-versions/document-versions.module';
import { DocumentMetadataModule } from '../document-metadata/document-metadata.module';
import { DocumentFilesService } from '../document-files/document-files.service';

@Module({
  imports: [DocumentVersionsModule, DocumentMetadataModule],
  controllers: [DocumentsController],
  providers: [
    DocumentsService,
    DocumentVersionsService,
    DocumentMetadataService,
    DocumentFilesService,
    ...documentMetadataProvider,
    ...documentProvider,
    ...documentFilesProvider,
    ...documentVersionsProvider,
  ],
})
export class DocumentsModule {}
