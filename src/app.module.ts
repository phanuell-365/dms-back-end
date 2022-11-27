import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { DocumentsModule } from './documents/documents.module';
import { DocumentMetadataModule } from './document-metadata/document-metadata.module';
import { DocumentVersionsModule } from './document-versions/document-versions.module';
import { DocumentFilesModule } from './document-files/document-files.module';
import { DocumentBoxesModule } from './document-boxes/document-boxes.module';
import { DocumentInboxesModule } from './document-inboxes/document-inboxes.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { DocumentBoxMetadataModule } from './document-box-metadata/document-box-metadata.module';

@Module({
  imports: [
    UsersModule,
    DocumentsModule,
    DocumentMetadataModule,
    DocumentVersionsModule,
    DocumentFilesModule,
    DocumentBoxesModule,
    DocumentInboxesModule,
    AuthModule,
    DatabaseModule,
    DocumentBoxMetadataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
