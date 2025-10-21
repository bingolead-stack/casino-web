import { Injectable, Logger } from '@nestjs/common';
import { PredictDepositType, Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddPredictDepositDto } from './dto/AddPredictDepositDto';
import e from 'express';
import { BITCOIN_CHAIN_ID, LITECOIN_CHAIN_ID } from 'src/blockchain/constants';

@Injectable()
export class PredictDepositService {
  private readonly logger = new Logger(PredictDepositService.name);

  constructor(private readonly prisma: PrismaService) {}

  addPredictDeposit(userId: string, body: AddPredictDepositDto) {
    return this.prisma.predictDeposit.create({
      data: {
        userId,
        chainId: body.chainId,
        type: PredictDepositType.visited,
        tokenAddress: body.tokenAddress,
      },
    });
  }

  async getUsersShouldBeChecked(evm: boolean) {
    const where: Prisma.PredictDepositWhereInput = {};

    if (evm) {
      where.chainId = {
        notIn: [BITCOIN_CHAIN_ID, LITECOIN_CHAIN_ID],
      };
      where.createdAt = {
        gt: new Date(new Date().getTime() - 0.5 * 3600000),
      };
    } else {
      where.chainId = {
        in: [BITCOIN_CHAIN_ID, LITECOIN_CHAIN_ID],
      };
      where.createdAt = {
        gt: new Date(new Date().getTime() - 1 * 3600000),
      };
    }

    const rows = await this.prisma.predictDeposit.findMany({
      select: {
        userId: true,
        chainId: true,
        tokenAddress: true,
      },
      distinct: ['userId', 'chainId', 'tokenAddress'],
      where: where,
    });

    return rows;
  }
}
