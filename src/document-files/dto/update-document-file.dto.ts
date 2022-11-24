import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentFileDto } from './create-document-file.dto';

export class UpdateDocumentFileDto extends PartialType(CreateDocumentFileDto) {}
