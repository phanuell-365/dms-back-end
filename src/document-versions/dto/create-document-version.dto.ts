import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { VersionType } from '../enum';

export class CreateDocumentVersionDto {
  @IsNotEmpty()
  @IsString()
  versionNumber?: string;

  @IsNotEmpty()
  @IsString()
  purposeChange: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  versioningDate?: Date;

  @IsNotEmpty()
  @IsEnum(VersionType, {
    message: `VersionType must be one of the following values: ${Object.values(
      VersionType,
    ).join(', ')}`,
  })
  versionType: VersionType;

  @IsNotEmpty()
  @IsUUID()
  DocumentFileId?: string;
}
