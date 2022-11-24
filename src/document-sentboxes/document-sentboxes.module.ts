import { Module } from '@nestjs/common';
import { DocumentSentboxesService } from './document-sentboxes.service';
import { DocumentSentboxesController } from './document-sentboxes.controller';

@Module({
  controllers: [DocumentSentboxesController],
  providers: [DocumentSentboxesService]
})
export class DocumentSentboxesModule {}
