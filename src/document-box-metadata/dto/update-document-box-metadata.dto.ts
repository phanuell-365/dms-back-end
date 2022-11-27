import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentBoxMetadataDto } from './create-document-box-metadata.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDocumentBoxMetadataDto extends PartialType(
  CreateDocumentBoxMetadataDto,
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
  @Transform(({ value }) => new Date(value))
  @IsDate()
  sentAt?: Date;
}
