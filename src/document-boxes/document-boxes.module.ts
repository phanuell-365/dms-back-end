import { Module } from '@nestjs/common';
import { DocumentBoxesService } from './document-boxes.service';
import { DocumentBoxesController } from './document-boxes.controller';
import { documentBoxMetadataProvider } from '../document-box-metadata/document-box-metadata.provider';
import { usersProvider } from '../users/users.provider';
import { documentProvider } from '../documents/document.provider';
import { UsersService } from '../users/users.service';
import { DocumentsService } from '../documents/documents.service';
import { UsersModule } from '../users/users.module';
import { DocumentsModule } from '../documents/documents.module';
import { DocumentBoxMetadataService } from '../document-box-metadata/document-box-metadata.service';
import { DocumentBoxMetadataModule } from '../document-box-metadata/document-box-metadata.module';
import { documentBoxesProvider } from './document-boxes.provider';
import { DocumentMetadataService } from '../document-metadata/document-metadata.service';
import { documentMetadataProvider } from '../document-metadata/document-metadata.provider';
import { DocumentVersionsService } from '../document-versions/document-versions.service';
import { documentVersionsProvider } from '../document-versions/document-versions.provider';
import { DocumentVersionsModule } from '../document-versions/document-versions.module';
import { DocumentFilesService } from '../document-files/document-files.service';
import { DocumentFilesModule } from '../document-files/document-files.module';
import { documentFilesProvider } from '../document-files/document-files.provider';

@Module({
  imports: [
    UsersModule,
    DocumentsModule,
    DocumentFilesModule,
    DocumentBoxMetadataModule,
    DocumentVersionsModule,
  ],
  controllers: [DocumentBoxesController],
  providers: [
    DocumentBoxesService,
    DocumentMetadataService,
    DocumentFilesService,
    UsersService,
    DocumentsService,
    DocumentBoxMetadataService,
    DocumentVersionsService,
    ...documentBoxMetadataProvider,
    ...usersProvider,
    ...documentProvider,
    ...documentBoxesProvider,
    ...documentMetadataProvider,
    ...documentVersionsProvider,
    ...documentFilesProvider,
  ],
})
export class DocumentBoxesModule {}
