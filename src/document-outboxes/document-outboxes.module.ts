import { Module } from '@nestjs/common';
import { DocumentOutboxesService } from './document-outboxes.service';
import { DocumentOutboxesController } from './document-outboxes.controller';
import { outboxMetadataProvider } from '../outbox-metadata/outbox-metadata.provider';
import { usersProvider } from '../users/users.provider';
import { documentProvider } from '../documents/document.provider';
import { UsersService } from '../users/users.service';
import { DocumentsService } from '../documents/documents.service';
import { UsersModule } from '../users/users.module';
import { DocumentsModule } from '../documents/documents.module';
import { OutboxMetadataService } from '../outbox-metadata/outbox-metadata.service';
import { OutboxMetadataModule } from '../outbox-metadata/outbox-metadata.module';
import { documentOutboxesProvider } from './document-outboxes.provider';
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
    OutboxMetadataModule,
    DocumentVersionsModule,
  ],
  controllers: [DocumentOutboxesController],
  providers: [
    DocumentOutboxesService,
    DocumentMetadataService,
    DocumentFilesService,
    UsersService,
    DocumentsService,
    OutboxMetadataService,
    DocumentVersionsService,
    ...outboxMetadataProvider,
    ...usersProvider,
    ...documentProvider,
    ...documentOutboxesProvider,
    ...documentMetadataProvider,
    ...documentVersionsProvider,
    ...documentFilesProvider,
  ],
})
export class DocumentOutboxesModule {}
