import { IsDate, IsNotEmpty, IsOptional, IsString, IsUUID } from "class-validator";
import { Transform } from 'class-transformer';

export class CreateDocumentVersionDto {
  @IsNotEmpty()
  @IsString()
  versionNumber: string;

  @IsNotEmpty()
  @IsString()
  purposeChange: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  versioningDate?: Date;

  @IsNotEmpty()
  @IsUUID()
  DocumentFileId?: string;
}
