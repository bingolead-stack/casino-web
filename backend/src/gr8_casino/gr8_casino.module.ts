import { Module } from '@nestjs/common';
import { Gr8CasinoService } from './gr8_casino.service';
import { Gr8CasinoController } from './gr8_casino.controller';
import { SocketModule } from 'src/socket/socket.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { RecentGameModule } from 'src/recent_game/recent_game.module';
import { UserActivityModule } from 'src/user_activity/user_activity.module';

@Module({
  imports: [SocketModule, PrismaModule, RecentGameModule, UserActivityModule],
  controllers: [Gr8CasinoController],
  providers: [Gr8CasinoService],
  exports: [Gr8CasinoService],
})
export class Gr8CasinoModule {}
