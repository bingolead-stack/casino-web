import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class WantBonusDto {
  @ApiProperty()
  @IsNotEmpty()
  wantBonus: boolean;
}
