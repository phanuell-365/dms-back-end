import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentVersionDto } from './create-document-version.dto';
import { IsDate, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { VersionStatus } from '../enum/version-status';

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
  @IsEnum(VersionStatus, {
    message: `VersionStatus must be one of the following values: ${Object.values(
      VersionStatus,
    ).join(', ')}`,
  })
  versionStatus?: VersionStatus;

  @IsOptional()
  @IsUUID()
  DocumentFileId?: string;
}
