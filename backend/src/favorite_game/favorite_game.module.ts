import { Module } from '@nestjs/common';
import { FavoriteGameService } from './favorite_game.service';
import { FavoriteGameController } from './favorite_game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [FavoriteGameController],
  providers: [FavoriteGameService],
  exports: [FavoriteGameService],
})
export class FavoriteGameModule {}
