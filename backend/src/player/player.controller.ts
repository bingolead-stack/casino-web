import {
  Body,
  Controller,
  Get,
  HttpCode,
  Logger,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { Public } from 'src/auth/strategies/public-strategy';
import { Gr8CasinoService } from 'src/gr8_casino/gr8_casino.service';
import { GenerateSessionDto } from './dto/GenerateSessionDto';
import { Request } from 'express';
import { Gr8Integrate } from 'src/auth/strategies/gr8-strategy';

@Controller('players')
export class PlayerController {
  private readonly logger = new Logger(PlayerController.name);

  constructor(private readonly gr8CasinoService: Gr8CasinoService) {}

  @Get('accounts/:playerId')
  @Public()
  @Gr8Integrate()
  @HttpCode(200)
  getPlayerFromId(
    @Param('playerId') playerId: string,
    @Query('providerId') providerId: string,
    @Req() req: Request,
  ) {
    return this.gr8CasinoService.getPlayerFromId(playerId, providerId, req);
  }

  @Get('sessions/:sessionToken')
  @Public()
  @Gr8Integrate()
  @HttpCode(200)
  getPlayerFromSession(
    @Param('sessionToken') sessionToken: string,
    @Query('providerId') providerId: string,
    @Req() req: Request,
  ) {
    this.logger.debug('getPlayerFromSession');
    return this.gr8CasinoService.getPlayerFromSession(sessionToken, providerId, req);
  }

  @Post('sessions')
  @Public()
  @Gr8Integrate()
  @HttpCode(200)
  generateSession(
    @Query('providerId') providerId: string,
    @Body() body: GenerateSessionDto,
    @Req() req: Request,
  ) {
    return this.gr8CasinoService.generateSession(providerId, body, req);
  }
}
