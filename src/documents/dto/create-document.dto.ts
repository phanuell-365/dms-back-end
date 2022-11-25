import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

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
  @IsString()
  versionNumber: string;

  @IsNotEmpty()
  @IsString()
  purposeChange: string;
}
