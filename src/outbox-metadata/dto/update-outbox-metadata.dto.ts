import { PartialType } from '@nestjs/mapped-types';
import { CreateOutboxMetadataDto } from './create-outbox-metadata.dto';
import { IsDate, IsOptional, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class UpdateOutboxMetadataDto extends PartialType(
  CreateOutboxMetadataDto,
) {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  keywords?: string;

  @IsOptional()
  @Transform(({ value }) => new Date(value))
  @IsDate()
  sentAt?: Date;
}
