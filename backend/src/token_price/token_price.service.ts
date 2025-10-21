import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TokenPriceService {
  private readonly logger = new Logger(TokenPriceService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly blockchainService: BlockchainService,
  ) {}

  async getTokenList(chainId: number) {
    const tokens = await this.prisma.tokenPrice.findMany({
      where: chainId
        ? {
            chainId,
            tokenName: {
              not: '',
            },
          }
        : {
            tokenName: {
              not: '',
            },
          },
      orderBy: [{ chainId: 'asc' }, { tokenAddress: 'asc' }],
    });

    return tokens;
  }

  async getTokenPrice(chainId: number, tokenAddress: string) {
    const token = await this.prisma.tokenPrice.findFirst({
      where: {
        chainId,
        tokenAddress,
      },
    });

    if (
      token.dbField === '0' ||
      token.dbField === 'usdt' ||
      token.dbField === 'usdc'
    ) {
      return 1;
    }

    if (token && new Date().getTime() - token.updatedAt.getTime() <= 3600000) {
      return token.usdPrice;
    }

    const usd = await this.blockchainService.getTokenPrice(
      chainId,
      tokenAddress,
    );

    if (token) {
      if (usd > 0) {
        await this.prisma.tokenPrice.updateMany({
          data: {
            usdPrice: usd,
            updatedAt: new Date(),
          },
          where: {
            chainId,
            tokenAddress,
          },
        });
      }
    } else {
      if (usd > 0) {
        const token1 = await this.blockchainService.getToken(
          chainId,
          tokenAddress,
        );

        await this.prisma.tokenPrice.create({
          data: {
            usdPrice: usd,
            updatedAt: new Date(),
            chainId,
            tokenAddress,
            tokenDecimals: +token1.tokenDecimals,
            tokenIcon: token1.tokenLogo || '',
            tokenName: token1.tokenName,
            tokenSymbol: token1.tokenSymbol,
            minimumLimit: Math.ceil((2 / usd) * 100) / 100,
          },
        });
      }
    }

    return usd;
  }
}
