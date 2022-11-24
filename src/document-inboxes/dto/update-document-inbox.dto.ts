import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentInboxDto } from './create-document-inbox.dto';

export class UpdateDocumentInboxDto extends PartialType(CreateDocumentInboxDto) {}
