import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AddFavoriteGameDto {
  @ApiProperty()
  @IsString()
  gameId: string;
}
