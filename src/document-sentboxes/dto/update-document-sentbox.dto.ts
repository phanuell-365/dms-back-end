import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentSentboxDto } from './create-document-sentbox.dto';

export class UpdateDocumentSentboxDto extends PartialType(CreateDocumentSentboxDto) {}
