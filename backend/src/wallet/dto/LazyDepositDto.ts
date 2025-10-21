import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber } from 'class-validator';

export class LazyDepositDto {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  chainId: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tokenAddress: string;
}
