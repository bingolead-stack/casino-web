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
import { ChatService } from './chat.service';
import { Public } from 'src/auth/strategies/public-strategy';
import { CustomGameIntegrate } from 'src/auth/strategies/custom-game-strategy';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { SendMessageDto } from './dto/SendMessageDto';

@Controller('chat')
export class ChatController {
  private readonly logger = new Logger(ChatController.name);

  constructor(private readonly chatService: ChatService) {}

  @Post('send')
  sendMessage(@LoggedUser() user: User, @Body() data: SendMessageDto) {
    return this.chatService.sendMessage(user, data);
  }

  @Get('get-history')
  @Public()
  getHistory(@Query('lastId') lastId: string) {
    return this.chatService.getHistory(+lastId);
  }

  @Get('get-connected-users')
  @Public()
  getConnectedUsers() {
    return this.chatService.getConnectedUsers();
  }
}
