import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentFileDto } from './create-document-file.dto';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateDocumentFileDto extends PartialType(CreateDocumentFileDto) {
  @IsOptional()
  @IsString()
  mimetype: string;

  @IsOptional()
  @IsString()
  newFilename: string;

  @IsOptional()
  @IsString()
  originalFilename: string;

  @IsOptional()
  @IsNumber()
  size: number;
}
