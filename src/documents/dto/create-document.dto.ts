import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { VersionType } from '../../document-versions/enum';

export class CreateDocumentDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  creator: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsString()
  keywords: string;

  @IsOptional()
  @IsString()
  contributors?: string;

  @IsNotEmpty()
  @IsEnum(VersionType, {
    message: 'Version type must be either "draft" or "final"',
  })
  versionType: VersionType;

  @IsNotEmpty()
  @IsString()
  purposeChange: string;
}
