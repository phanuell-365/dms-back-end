import { IsArray, IsBoolean, IsNotEmpty } from 'class-validator';

export class MarkAsReadDto {
  @IsNotEmpty()
  @IsArray()
  documentMetadataIds?: string[];

  @IsNotEmpty()
  @IsBoolean()
  all?: boolean;
}
