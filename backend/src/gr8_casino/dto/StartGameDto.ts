import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class StartGameDto {
  @ApiProperty()
  @IsString()
  gameId: string;

  @ApiProperty()
  @IsString()
  tokenName: string;
}
