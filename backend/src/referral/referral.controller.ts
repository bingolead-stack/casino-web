import {
  Controller,
  Get,
  Query,
  Post,
  BadRequestException,
} from '@nestjs/common';
import { ReferralService } from './referral.service';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';

@Controller('referral')
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Get('referred-users')
  getReferredUsers(
    @LoggedUser() user: User,
    @Query('offset') offset: string,
    @Query('length') length: string,
  ) {
    return this.referralService.getReferredUsers(user.id, +offset, +length);
  }

  @Get('referred-users-count')
  getReferredUsersCount(@LoggedUser() user: User) {
    return this.referralService.getReferredUsersCount(user.id);
  }

  @Get('reward')
  getCalculatedReward(@LoggedUser() user: User) {
    return this.referralService.getCalculatedReward(user.id);
  }

  @Post('withdraw-referral')
  withdrawReferral(@LoggedUser() user: User) {
    if (user.id === '000001f7' || user.id === '0000027d') {
      // zeed, houseofcards
      throw new BadRequestException();
    }
    return this.referralService.withdrawReferral(user.id);
  }
}
