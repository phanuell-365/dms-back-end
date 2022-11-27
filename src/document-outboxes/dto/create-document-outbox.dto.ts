import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateDocumentOutboxDto {
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
  @IsUUID()
  OutboxMetadataId?: string;
}
