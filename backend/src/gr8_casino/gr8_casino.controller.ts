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
import { Gr8CasinoService } from './gr8_casino.service';
import { Public } from 'src/auth/strategies/public-strategy';
import { User } from '@prisma/client';
import { StartGameDto } from './dto/StartGameDto';
import * as requestIp from 'request-ip';
import { Request } from 'express';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';

@Controller('gr8-casino')
export class Gr8CasinoController {
  private readonly logger = new Logger(Gr8CasinoController.name);

  constructor(private readonly gr8CasinoService: Gr8CasinoService) {}

  @Get('games')
  @Public()
  findGames(
    @Query('keyword') keyword: string,
    @Query('type') type: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('provider') provider: string,
  ) {
    this.logger.debug('games');
    return this.gr8CasinoService.findGames(
      keyword,
      type,
      provider,
      +offset,
      +limit,
    );
  }

  @Get('custom-games')
  @Public()
  fetchCustomGames(
    @Query('category') category: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    this.logger.debug('custom-games');
    return this.gr8CasinoService.fetchCustomGames(category, +offset, +limit);
  }

  @Get('providers')
  @Public()
  fetchProviders() {
    this.logger.debug('providers');
    return this.gr8CasinoService.fetchProviders();
  }

  @Post('start-game')
  startGame(
    @LoggedUser() user: User,
    @Body() data: StartGameDto,
    @Req() request: Request,
  ) {
    this.logger.debug('start-game');
    const ip = requestIp.getClientIp(request);
    const ipv4 = ip.startsWith('::ffff:') ? ip.substring(7) : ip;
    return this.gr8CasinoService.startGame(user, data, ipv4);
  }

  @Get(':id')
  @Public()
  fetchGameById(@Param('id') id: string) {
    this.logger.debug('fetchGameById');
    return this.gr8CasinoService.fetchGameById(id);
  }
}
