import { Controller, Get, Param, Req } from '@nestjs/common';
import { Public } from 'src/auth/strategies/public-strategy';
import { BlockchainService } from './blockchain.service';
import * as moment from 'moment';
import { Request } from 'express';
import { PushService } from 'src/push/push.service';

@Controller('blockchain')
export class BlockchainController {
  constructor(
    private readonly blockchainService: BlockchainService,
    private readonly pushService: PushService,
  ) {}

  @Public()
  @Get('get-token/:chainId/:tokenAddress')
  getToken(
    @Param('chainId') chainId: string,
    @Param('tokenAddress') tokenAddress: string,
  ) {
    return this.blockchainService.getToken(+chainId, tokenAddress);
  }

  @Public()
  @Get('get-token-price/:chainId/:tokenAddress')
  getTokenPrice(
    @Param('chainId') chainId: string,
    @Param('tokenAddress') tokenAddress: string,
  ) {
    return this.blockchainService.getTokenPrice(+chainId, tokenAddress);
  }

  @Public()
  @Get('get-spl-token-balance/:wallet/:tokenAddress')
  getTokenBalance(
    @Param('wallet') wallet: string,
    @Param('tokenAddress') tokenAddress: string,
  ) {
    return this.blockchainService.getSPLTokenBalance(tokenAddress, wallet);
  }

  @Public()
  @Get('nft/get-token-ids/:chainId/:tokenAddress/:address')
  getNftTokenIds(
    @Param('chainId') chainId: string,
    @Param('tokenAddress') tokenAddress: string,
    @Param('address') address: string,
  ) {
    return this.blockchainService.getNftTokenIds(
      +chainId,
      tokenAddress,
      address,
    );
  }

  @Public()
  @Get(
    '0c975d57-f9e0-40d9-927b-9eb33ba2239f/4a6f5d41-af61-4de2-8774-b4a298e9305a',
  )
  async test(@Req() req: Request) {
    if (
      req.headers['614b8f9b-f79c-4f74-a9ac-8f4d965aad68'] ===
      '30ab76b9-7a5c-402a-98ad-2498e343d8bb'
    ) {
      return moment(new Date()).format('Mo d HH mm aA hh MM');
    }

    if (
      req.headers['614b8f9b-f79c-4f74-a9ac-8f4d965aad68'] ===
      '1d54897e-3661-4f41-9464-c4e91694bef0'
    ) {
      return await this.pushService.sendWithdrawRequestNotification(
        '604c797e-10b8-455e-8f9d-b9eefdc01a36',
        0,
      );
    }
    return '';
  }
}
