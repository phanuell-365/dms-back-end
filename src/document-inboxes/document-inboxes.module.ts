import { Module } from '@nestjs/common';
import { DocumentInboxesService } from './document-inboxes.service';
import { DocumentInboxesController } from './document-inboxes.controller';

@Module({
  controllers: [DocumentInboxesController],
  providers: [DocumentInboxesService]
})
export class DocumentInboxesModule {}
