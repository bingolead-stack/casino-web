import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsEmail,
  IsNumberString,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class ProcessPaymentDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  @Min(50)
  amount: number;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsNumberString()
  @MinLength(10)
  @MaxLength(10)
  @IsNotEmpty()
  phone: string;

  @ApiProperty()
  @IsString()
  @MinLength(2)
  @MaxLength(2)
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsString()
  redirectUrl: string;
}
