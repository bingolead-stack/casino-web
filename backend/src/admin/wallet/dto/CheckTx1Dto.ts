import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber } from 'class-validator';

export class CheckTx1Dto {
  @ApiProperty()
  @IsString()
  userId: string;

  @ApiProperty()
  @IsString()
  txHash: string;

  @ApiProperty()
  @IsNumber()
  cash: number;

  @ApiProperty()
  @IsNumber()
  chainId: number;

  @ApiProperty()
  @IsNumber()
  tokenAmount: number;

  @ApiProperty()
  @IsString()
  tokenName: string;

  @ApiProperty()
  @IsString()
  tokenAddress: string;
}
