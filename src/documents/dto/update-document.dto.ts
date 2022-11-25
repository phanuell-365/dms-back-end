import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentDto } from './create-document.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { VersionType } from '../../document-versions/enum';

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

  @IsOptional()
  @IsEnum(VersionType, {
    message: 'Version type must be either "draft" or "final"',
  })
  versionType: VersionType;

  @IsOptional()
  @IsString()
  purposeChange: string;
}
