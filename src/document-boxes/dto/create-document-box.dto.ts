import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { MarkStatus } from '../../document-box-metadata/enum';
import { Transform } from 'class-transformer';

export class CreateDocumentBoxDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  keywords: string;

  @IsNotEmpty()
  @IsArray()
  recipientIds: string[];

  @IsNotEmpty()
  @IsArray()
  documentIds: string[];

  @IsOptional()
  @IsEnum(MarkStatus, {
    message: `Mark status must be one of the following: ${Object.values(
      MarkStatus,
    ).join(', ')}`,
  })
  markStatus?: MarkStatus;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  readAt?: Date;

  @IsOptional()
  @IsUUID()
  OutboxMetadataId?: string;
}
