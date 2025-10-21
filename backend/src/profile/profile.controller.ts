import { Controller, Get, Query } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { WalletService } from 'src/wallet/wallet.service';

@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly walletService: WalletService,
  ) {}

  @Get('financial-activity')
  getFinancialActivity(
    @LoggedUser() user: User,
    @Query('beginTimestamp') beginTimestamp: string,
    @Query('endTimestamp') endTimestamp: string,
  ) {
    return this.walletService.getFinancialActivity(
      user.id,
      +beginTimestamp,
      +endTimestamp,
    );
  }

  @Get('payment-history')
  getPaymentHistory(
    @LoggedUser() user: User,
    @Query('offset') offset: string,
    @Query('length') length: string,
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
    @Query('type') type: string,
  ) {
    return this.walletService.getPaymentHistory(
      user.id,
      +startTimestamp,
      +endTimestamp,
      +offset,
      +length,
      type,
    );
  }

  @Get('casino-history')
  getCasinoHistory(
    @LoggedUser() user: User,
    @Query('offset') offset: string,
    @Query('length') length: string,
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
  ) {
    return this.walletService.getCasinoHistory(
      user.id,
      +startTimestamp,
      +endTimestamp,
      +offset,
      +length,
    );
  }

  @Get('sportsbook-history')
  getSportsbookHistory(
    @LoggedUser() user: User,
    @Query('offset') offset: string,
    @Query('length') length: string,
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
  ) {
    return this.walletService.getSportsbookHistory(
      user.id,
      +startTimestamp,
      +endTimestamp,
      +offset,
      +length,
    );
  }
}
