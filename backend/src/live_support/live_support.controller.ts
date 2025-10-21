import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { LiveSupportService } from './live_support.service';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { Public } from 'src/auth/strategies/public-strategy';
import { SupportMessageUserDto } from './dto/SupportMessageUserDto';
import { SupportMessageAdminDto } from './dto/SupportMessageAdminDto';
import { SetSmCursorDto } from './dto/SetSmCursorDto';

@Controller('live-support')
export class LiveSupportController {
  private readonly logger = new Logger(LiveSupportController.name);

  constructor(private readonly liveSupportService: LiveSupportService) {}

  @Post('send-user')
  sendSupportMessageUser(
    @LoggedUser() user: User,
    @Body() data: SupportMessageUserDto,
  ) {
    this.logger.debug(
      `Support message from user: ${user.userName} with id: ${user.id} has been arrived:`,
    );
    this.logger.debug(data);

    return this.liveSupportService.sendSupportMessageUser(user, data);
  }

  @Post('send-admin')
  sendSupportMessageAdmin(
    @LoggedUser() admin: User,
    @Body() data: SupportMessageAdminDto,
  ) {
    this.logger.debug(
      `Support message from admin: ${admin.userName} with id: ${admin.id} and role: ${admin.role} has been arrived:`,
    );
    this.logger.debug(data);

    return this.liveSupportService.sendSupportMessageAdmin(admin, data);
  }

  @Get('get-messages')
  @Public()
  getSupportMessages(
    @Query('lastId') lastId: string,
    @Query('userId') userId: string,
  ) {
    this.logger.debug(
      `Live support messages get request has arrived from user: ${userId}`,
    );
    return this.liveSupportService.getSupportMessages(+lastId, userId);
  }

  @Get('get-users')
  @Public()
  getUsersForSupport(){
    return this.liveSupportService.getUsersForSupport(); 
  }

  @Get('get-connected-users')
  @Public()
  getConnectedUsers(){
    return this.liveSupportService.getConnectedUsers();
  }

  @Post('set-admin-cursor')
  setSmAdminCursor(@Body() data: SetSmCursorDto){
    return this.liveSupportService.setSmAdminCursor(data.userId, data.cursor);
  }

  @Post('set-user-cursor')
  setSmUserCursor(@Body() data: SetSmCursorDto){
    return this.liveSupportService.setSmUserCursor(data.userId, data.cursor);
  }
}