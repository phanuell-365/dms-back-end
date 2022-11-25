import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  creator?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @IsString()
  contributors?: string;
}
