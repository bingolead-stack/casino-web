import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { FavoriteGameService } from './favorite_game.service';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { AddFavoriteGameDto } from './dto/AddFavoriteGameDto';

@Controller('favorite-game')
export class FavoriteGameController {
  constructor(private readonly favoriteGameService: FavoriteGameService) {}

  @Post()
  addFavoriteGame(@LoggedUser() user: User, @Body() body: AddFavoriteGameDto) {
    return this.favoriteGameService.addFavoriteGame(user.id, body);
  }

  @Delete(':gameId')
  deleteFavoriteGame(
    @LoggedUser() user: User,
    @Param('gameId') gameId: string,
  ) {
    return this.favoriteGameService.deleteFavoriteGame(user.id, gameId);
  }

  @Get()
  getFavoriteGames(
    @LoggedUser() user: User,
    @Query('keyword') keyword: string,
    @Query('category') category: string,
    @Query('type') type: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('providerId') providerId: string,
  ) {
    return this.favoriteGameService.getFavoriteGames(
      user.id,
      keyword,
      category,
      type,
      +providerId,
      +offset,
      +limit,
    );
  }
}
