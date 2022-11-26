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
import { VersionStatus } from '../enum/version-status';

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
  versioningDate: Date;

  @IsNotEmpty()
  @IsEnum(VersionType, {
    message: `VersionType must be one of the following values: ${Object.values(
      VersionType,
    ).join(', ')}`,
  })
  versionType: VersionType;

  @IsNotEmpty()
  @IsEnum(VersionStatus, {
    message: `VersionStatus must be one of the following values: ${Object.values(
      VersionStatus,
    ).join(', ')}`,
  })
  versionStatus?: VersionStatus;

  @IsNotEmpty()
  @IsUUID()
  DocumentId: string;

  @IsNotEmpty()
  @IsUUID()
  DocumentFileId: string;

  @IsNotEmpty()
  @IsUUID()
  oldDocumentFileId?: string;
}
