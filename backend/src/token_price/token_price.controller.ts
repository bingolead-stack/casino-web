import { Controller, Get, Query } from '@nestjs/common';
import { TokenPriceService } from './token_price.service';
import { Public } from 'src/auth/strategies/public-strategy';

@Controller('token-price')
export class TokenPriceController {
  constructor(private readonly tokenPriceService: TokenPriceService) {}

  @Get('token-list')
  async getTokenList(@Query('chainId') chainId: number) {
    return this.tokenPriceService.getTokenList(+chainId);
  }

  @Public()
  @Get('token-price')
  async getTokenPrice(
    @Query('chainId') chainId: string,
    @Query('tokenAddress') tokenAddress: string,
  ) {
    return this.tokenPriceService.getTokenPrice(+chainId, tokenAddress);
  }
}
