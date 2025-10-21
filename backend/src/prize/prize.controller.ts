import { Controller, Get } from '@nestjs/common';
import { PrizeService } from './prize.service';
import { Public } from 'src/auth/strategies/public-strategy';

@Controller('prize')
export class PrizeController {
  constructor(private readonly prizeService: PrizeService) {}

  @Public()
  @Get('/leaderboard')
  getLeaderboard() {
    return this.prizeService.getLeaderboard();
  }
}
