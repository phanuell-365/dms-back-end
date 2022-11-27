import { PartialType } from '@nestjs/mapped-types';
import { CreateDocumentMetadataDto } from './create-document-metadata.dto';
import { IsOptional, IsString } from 'class-validator';

// import { Transform } from 'class-transformer';

export class UpdateDocumentMetadataDto extends PartialType(
  CreateDocumentMetadataDto,
) {
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
  //
  // @IsOptional()
  // @IsString()
  // type?: string;
  //
  // @IsOptional()
  // @IsString()
  // format?: string;
  //
  // @IsOptional()
  // @Transform(({ value }) => new Date(value))
  // @IsDate()
  // creationDate?: Date;
}
