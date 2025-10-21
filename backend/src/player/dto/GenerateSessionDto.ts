import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class GenerateSessionDto {
  @IsOptional()
  currency: string;

  @IsOptional()
  gameId: string;

  @IsOptional()
  playerId: string;
}
