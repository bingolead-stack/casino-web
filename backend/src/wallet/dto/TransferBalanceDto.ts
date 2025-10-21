import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class TransferBalanceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  emailOrUsername: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  balance: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tokenName: string;
}
