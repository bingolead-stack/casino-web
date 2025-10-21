import { Module } from '@nestjs/common';
import { RecentGameService } from './recent_game.service';
import { RecentGameController } from './recent_game.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [RecentGameController],
  providers: [RecentGameService],
  exports: [RecentGameService],
})
export class RecentGameModule {}
