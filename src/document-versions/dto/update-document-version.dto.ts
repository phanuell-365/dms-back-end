import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentVersionDto } from './create-document-version.dto';
import { IsDate, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateDocumentVersionDto extends PartialType(
  CreateDocumentVersionDto,
) {
  @IsOptional()
  @IsString()
  versionNumber: string;

  @IsOptional()
  @IsString()
  purposeChange: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  versioningDate?: Date;

  @IsOptional()
  @IsUUID()
  DocumentFileId?: string;
}
