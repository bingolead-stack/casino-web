import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class WithdrawDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  status: number;

  @ApiProperty()
  @IsString()
  tokenAddress: string;

  @ApiProperty()
  @IsNumber()
  tokenAmount: number;

  @ApiProperty()
  @IsString()
  txHash: string;
  
  @ApiProperty()
  @IsNumber()
  approvedCash: number;
}
