import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateOutboxMetadataDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsString()
  keywords: string;

  @IsNotEmpty()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  sentAt: Date;
}
