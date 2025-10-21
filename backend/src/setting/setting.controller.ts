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
import { SettingService } from './setting.service';
import { Public } from 'src/auth/strategies/public-strategy';
import { CustomGameIntegrate } from 'src/auth/strategies/custom-game-strategy';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';

@Controller('setting')
export class SettingController {
  private readonly logger = new Logger(SettingController.name);

  constructor(private readonly settingService: SettingService) {}

  @Get('get/:id')
  @Public()
  getSetting(@Param('id') id: string) {
    return this.settingService.getSetting(id);
  }
}
