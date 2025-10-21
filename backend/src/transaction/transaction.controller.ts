import { Body, Controller, HttpCode, Post, Req } from '@nestjs/common';
import { Public } from 'src/auth/strategies/public-strategy';
import { Gr8CasinoService } from 'src/gr8_casino/gr8_casino.service';
import { BetDto } from './dto/BetDto';
import { Request } from 'express';
import { PromoWinDto } from './dto/PromoWinDto';
import { TournamentWinDto } from './dto/TournamentWinDto';
import { Gr8Integrate } from 'src/auth/strategies/gr8-strategy';

@Controller('transactions')
export class TransactionController {
  constructor(private readonly gr8CasinoService: Gr8CasinoService) {}

  @Post('bet')
  @HttpCode(200)
  @Gr8Integrate()
  @Public()
  bet(@Body() body: BetDto, @Req() req: Request) {
    return this.gr8CasinoService.bet('bet', body, req);
  }

  @Post('win')
  @HttpCode(200)
  @Gr8Integrate()
  @Public()
  win(@Body() body: BetDto, @Req() req: Request) {
    return this.gr8CasinoService.bet('win', body, req);
  }

  @Post('refund')
  @HttpCode(200)
  @Gr8Integrate()
  @Public()
  refund(@Body() body: BetDto, @Req() req: Request) {
    return this.gr8CasinoService.bet('refund', body, req);
  }

  @Post('promoWin')
  @HttpCode(200)
  @Gr8Integrate()
  @Public()
  promoWin(@Body() body: PromoWinDto, @Req() req: Request) {
    return this.gr8CasinoService.promoWin(body, req);
  }

  @Post('tournamentWin')
  @HttpCode(200)
  @Gr8Integrate()
  @Public()
  tournamentWin(@Body() body: TournamentWinDto, @Req() req: Request) {
    return this.gr8CasinoService.tournamentWin(body, req);
  }
}
