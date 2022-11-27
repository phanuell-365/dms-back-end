import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentOutboxDto } from './create-document-outbox.dto';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDocumentOutboxDto extends PartialType(
  CreateDocumentOutboxDto,
) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsArray()
  recipients?: string[];

  @IsOptional()
  @IsUUID()
  DocumentId?: string;

  @IsOptional()
  @IsUUID()
  OutboxMetadataId?: string;
}
