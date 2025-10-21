import { Controller, Get, Query } from '@nestjs/common';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { RecentGameService } from './recent_game.service';

@Controller('recent-game')
export class RecentGameController {
  constructor(private readonly favoriteGameService: RecentGameService) {}

  @Get()
  getFavoriteGames(
    @LoggedUser() user: User,

    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    return this.favoriteGameService.getRecentGames(user.id, +offset, +limit);
  }
}
