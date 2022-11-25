import { IsDate, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

// import { Transform } from 'class-transformer';

export class CreateDocumentMetadataDto {
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
  contributors: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  format?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  creationDate?: Date;
}
