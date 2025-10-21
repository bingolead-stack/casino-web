
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsString } from 'class-validator';

export class SupportMessageUserDto {
  @ApiProperty()
  @IsString()
  message: string;

  @ApiProperty()
  @IsArray()
  filepaths: string[];

  @ApiProperty()
  @IsArray()
  filenames: string[];

  @ApiPropertyOptional()
  replyId?: number;

  @ApiProperty()
  @IsNumber()
  tempId: number;
}