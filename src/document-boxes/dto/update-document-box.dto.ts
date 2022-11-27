import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentBoxDto } from './create-document-box.dto';
import { IsArray, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateDocumentBoxDto extends PartialType(CreateDocumentBoxDto) {
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
