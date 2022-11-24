import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentMetadatumDto } from './create-document-metadatum.dto';

export class UpdateDocumentMetadatumDto extends PartialType(CreateDocumentMetadatumDto) {}
