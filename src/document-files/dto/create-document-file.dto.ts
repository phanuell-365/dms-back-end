import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateDocumentFileDto {
  @IsNotEmpty()
  @IsString()
  mimetype: string;

  @IsNotEmpty()
  @IsString()
  newFilename: string;

  @IsNotEmpty()
  @IsString()
  originalFilename: string;

  @IsNotEmpty()
  @IsNumber()
  size: number;
}
