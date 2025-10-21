import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class LazyWithdrawDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chainId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  cash: number;

  @ApiPropertyOptional()
  @IsOptional()
  note?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tokenName: string;
}
