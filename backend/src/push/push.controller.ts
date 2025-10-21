// push.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { PushService } from './push.service';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';

@Controller('push')
export class PushController {
  constructor(private readonly pushService: PushService) {}

  @Post('/subscribe')
  subscribe(@LoggedUser() user: User, @Body() subscription) {
    return this.pushService.subscripbe(user, subscription);
  }
}
