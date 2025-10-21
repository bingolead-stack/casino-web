import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { TransactionDto } from './dto/TransactionDto';
import { Public } from 'src/auth/strategies/public-strategy';
import { Gr8Integrate } from 'src/auth/strategies/gr8-strategy';
import { InstantDepositDto } from './dto/InstantDepositDto';
import { LoggedUser } from 'src/auth/decorators/logged-user.decorator';
import { User } from '@prisma/client';
import { LazyWithdrawDto } from './dto/LazyWithdrawDto';
import { LazyDepositDto } from './dto/LazyDepositDto';
import { TransferBalanceDto } from './dto/TransferBalanceDto';
import * as requestIp from 'request-ip';
import { Request } from 'express';
import { ConvertBalanceDto } from './dto/ConvertBalanceDto';
import { CheckBalanceDto } from './dto/CheckBalanceDto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  // get-user-balance
  @Public()
  @Gr8Integrate()
  @Get('/:userId/balances')
  getUserBalance(
    @Headers('X-Brand') brand: string,
    @Headers('X-Operator-Id') operatorId: string,
    @Param('userId') userId: string,
    @Query('currencies') currencies: string,
  ) {
    return this.walletService.getUserBalance(
      brand,
      operatorId,
      userId,
      currencies,
    );
  }

  // perform-transaction
  @Public()
  @Gr8Integrate()
  @Post('/:userId/transactions')
  @HttpCode(200)
  performTransaction(
    @Headers('X-Brand') brand: string,
    @Headers('X-Operator-Id') operatorId: string,
    @Param('userId') userId: string,
    @Body() data: TransactionDto,
  ) {
    return this.walletService.performTransaction(
      brand,
      operatorId,
      userId,
      data,
    );
  }

  // get transaction
  @Public()
  @Gr8Integrate()
  @Get('/:userId/transactions/:transactionId')
  getTransactionById(
    @Headers('X-Brand') brand: string,
    @Headers('X-Operator-Id') operatorId: string,
    @Param('userId') userId: string,
    @Param('transactionId') transactionId: string,
  ) {
    return this.walletService.getTransactionById(
      brand,
      operatorId,
      userId,
      transactionId,
    );
  }

  @Post('instant-deposit')
  instantDeposit(@LoggedUser() user: User, @Body() data: InstantDepositDto) {
    return this.walletService.instantDeposit(user, data);
  }

  @Post('lazy-deposit')
  lazyDeposit(@LoggedUser() user: User, @Body() data: LazyDepositDto) {
    return this.walletService.lazyDeposit(user, data);
  }

  @Post('lazy-withdraw')
  lazyWithdraw(
    @LoggedUser() user: User,
    @Body() data: LazyWithdrawDto,
    @Req() request: Request,
  ) {
    const ip = requestIp.getClientIp(request);
    const ipv4 = ip.startsWith('::ffff:') ? ip.substring(7) : ip;
    return this.walletService.lazyWithdraw(user, data, ipv4);
  }

  @Delete('lazy-withdraw/:id')
  cancelWithdraw(@LoggedUser() user: User, @Param('id') requestId: string) {
    return this.walletService.cancelWithdraw(user, +requestId);
  }

  @Get('lazy-withdraw')
  getLazyWithdraw(
    @LoggedUser() user: User,
    @Query('offset') offset: string,
    @Query('length') length: string,
  ) {
    return this.walletService.getLazyWithdraw(user, +offset, +length);
  }

  @Get('last-deposit-transaction')
  getLastDepositTransaction(@LoggedUser() user: User) {
    return this.walletService.getLastDepositTransaction(user.id);
  }

  @Post('transfer-balance')
  transferBalance(@LoggedUser() user: User, @Body() data: TransferBalanceDto) {
    return this.walletService.transferBalance(user, data);
  }

  @Post('convert-balance')
  convertBalance(@LoggedUser() user: User, @Body() data: ConvertBalanceDto) {
    return this.walletService.convertBalance(user, data);
  }

  @Post('check-balance')
  checkBalance(
    @LoggedUser() user: User,
    @Body() data: CheckBalanceDto,
    @Req() req: Request,
  ) {
    if (
      req.headers['x-614b834g-f79c-4f74-a9ac-8f4d325aad54'] !==
      '33454a9-7a5c-402a-98ad-24345343d84a'
    ) {
      throw new BadRequestException();
    }

    return this.walletService.checkBalance(user, data);
  }
}
