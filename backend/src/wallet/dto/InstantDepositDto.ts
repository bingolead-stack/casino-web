import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class InstantDepositDto {
  @ApiProperty()
  signature: any;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chainId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  tokenAmount: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  transactionHash: string;
}
