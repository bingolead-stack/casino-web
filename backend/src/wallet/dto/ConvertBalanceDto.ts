import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class ConvertBalanceDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  sourceToken: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  balance: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destToken: string;
}
