import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsString } from 'class-validator';

export class SetProviderStateDto {
  @ApiProperty()
  @IsString()
  provider: string;

  @ApiProperty()
  @IsBoolean()
  added_slot: boolean;
}
