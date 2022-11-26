import { Module } from '@nestjs/common';
import { DocumentVersionsService } from './document-versions.service';
import { DocumentFilesService } from '../document-files/document-files.service';
import { DocumentFilesModule } from '../document-files/document-files.module';
import { documentFilesProvider } from '../document-files/document-files.provider';
import { documentVersionsProvider } from './document-versions.provider';
import { documentProvider } from '../documents/document.provider';

@Module({
  imports: [DocumentFilesModule],
  providers: [
    DocumentVersionsService,
    DocumentFilesService,
    ...documentFilesProvider,
    ...documentVersionsProvider,
    ...documentProvider,
  ],
})
export class DocumentVersionsModule {}
