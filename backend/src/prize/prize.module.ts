import { Module } from '@nestjs/common';
import { PrizeService } from './prize.service';
import { PrizeController } from './prize.controller';
import { PrizeBackgroundService } from './prize.background.service';
import { SocketModule } from 'src/socket/socket.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [SocketModule, PrismaModule],
  controllers: [PrizeController],
  providers: [PrizeService, PrizeBackgroundService],
})
export class PrizeModule {}
