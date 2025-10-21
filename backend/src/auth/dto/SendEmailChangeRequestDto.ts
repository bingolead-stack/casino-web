import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class SendEmailChangeRequestDto {
  @ApiProperty()
  @IsEmail()
  email: string;
}
