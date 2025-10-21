import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletService as GlobalWalletService } from 'src/wallet/wallet.service';
import { HasRoles } from 'src/auth/decorators/roles.decorator';
import { User, UserRole } from '@prisma/client';
import { WithdrawDto } from './dto/WithdrawDto';
import { CreditUserDto } from './dto/CreditUserDto';
import { Request } from 'express';
import { CheckTx1Dto } from './dto/CheckTx1Dto';
import { AddBalanceDto } from './dto/AddBalanceDto';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';

@Controller('admin/wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly globalWalletService: GlobalWalletService,
  ) {}

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post('withdraw/:requestId')
  withdraw(@Param('requestId') requestId: string, @Body() data: WithdrawDto) {
    return this.walletService.withdraw(+requestId, data);
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post('credit-user')
  creditUser(@Body() data: CreditUserDto) {
    return this.walletService.creditUser(data);
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN)
  @Get('withdraw')
  getLazyWithdraw(
    @LoggedUser() auth: User,
    @Query('status') status: string,
    @Query('offset') offset: string,
    @Query('length') length: string,
  ) {
    return this.walletService.getLazyWithdraw(auth, +status, +offset, +length);
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.SUB_ADMIN)
  @Get('transactions')
  getDeposit(
    @LoggedUser() auth: User,
    @Query('offset') offset: string,
    @Query('length') length: string,
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
    @Query('transactionPlatform') transactionPlatform: string,
  ) {
    return this.walletService.getTransactions(
      auth,
      transactionPlatform,
      +startTimestamp,
      +endTimestamp,
      +offset,
      +length,
    );
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('/:id/transaction')
  async getPaymentHistory(
    @Param('id') userId: string,
    @Query('offset') offset: string,
    @Query('length') length: string,
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
    @Query('showRakeback') showRakeback: string,
  ) {
    return this.globalWalletService.getPaymentHistory(
      userId,
      +startTimestamp,
      +endTimestamp,
      +offset,
      +length,
      undefined,
      showRakeback,
    );
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('/:id/sportsbook-history')
  async findSportsbookHistory(
    @Param('id') userId: string,
    @Query('offset') offset: string,
    @Query('length') length: string,
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
  ) {
    return this.globalWalletService.getSportsbookHistory(
      userId,
      +startTimestamp,
      +endTimestamp,
      +offset,
      +length,
    );
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('/:id/casino-history')
  async findCasinoHistory(
    @Param('id') userId: string,
    @Query('offset') offset: string,
    @Query('length') length: string,
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
    @Query('showRakeback') showRakeback: string,
  ) {
    return this.globalWalletService.getCasinoHistory(
      userId,
      +startTimestamp,
      +endTimestamp,
      +offset,
      +length,
    );
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Get('/:id/transaction-sum')
  async findAllTransactionSum(
    @Param('id') userId: string,
    @Query('startDate') startTimestamp: string,
    @Query('endDate') endTimestamp: string,
  ) {
    return this.globalWalletService.getFinancialActivity(
      userId,
      +startTimestamp,
      +endTimestamp,
    );
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post('/:userId/:txId/check-tx')
  async checkTransaction(
    @Param('userId') userId: string,
    @Param('txId') txId: string,
    @Req() req: Request,
  ) {
    if (
      req.headers['x-614b834g-f79c-4f74-a9ac-8f4d965aad68'] !==
      '33456b9-7a5c-402a-98ad-24345343d8bb'
    ) {
      throw new BadRequestException();
    }

    return this.walletService.checkTransaction(userId, txId);
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post('check-tx1')
  async checkTransaction1(@Body() body: CheckTx1Dto, @Req() req: Request) {
    if (
      req.headers['x-614b834g-f79c-4f74-a9ac-8f4d965aad68'] !==
      '33456b9-7a5c-402a-98ad-24345343d8bb'
    ) {
      throw new BadRequestException();
    }

    return this.walletService.checkTransaction1(body);
  }

  @HasRoles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  @Post('add-balance')
  async addBalance(@Body() body: AddBalanceDto, @Req() req: Request) {
    if (
      req.headers['x-614b834g-f79c-4f74-a9ac-8f4d965aad54'] !==
      '33456b9-7a5c-402a-98ad-24345343d84a'
    ) {
      throw new BadRequestException();
    }

    return this.walletService.addBalance(body);
  }
}
