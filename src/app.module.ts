import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { DocumentMetadataModule } from './document-metadata/document-metadata.module';
import { DocumentVersionsModule } from './document-versions/document-versions.module';
import { DocumentFilesModule } from './document-files/document-files.module';
import { DocumentOutboxesModule } from './document-outboxes/document-outboxes.module';
import { DocumentInboxesModule } from './document-inboxes/document-inboxes.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { OutboxMetadataModule } from './outbox-metadata/outbox-metadata.module';

@Module({
  imports: [
    UsersModule,
    DocumentsModule,
    DocumentMetadataModule,
    DocumentVersionsModule,
    DocumentFilesModule,
    DocumentOutboxesModule,
    DocumentInboxesModule,
    AuthModule,
    DatabaseModule,
    OutboxMetadataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
