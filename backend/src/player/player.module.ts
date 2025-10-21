import { Module } from '@nestjs/common';
import { PlayerService } from './player.service';
import { PlayerController } from './player.controller';
import { Gr8CasinoModule } from 'src/gr8_casino/gr8_casino.module';

@Module({
  imports: [Gr8CasinoModule],
  controllers: [PlayerController],
  providers: [PlayerService],
})
export class PlayerModule {}
