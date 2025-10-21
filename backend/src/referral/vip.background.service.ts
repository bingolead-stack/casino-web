import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TransactionType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { tSummarizedTransaction } from 'src/types/tSummarizedTransaction';
import { TransactionPlatform } from 'src/utils/constants';
import { SocketGateway } from 'src/socket/socket.gateway';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class VIPBackgroundService {
  private readonly logger = new Logger(VIPBackgroundService.name);
  private intervalId: NodeJS.Timeout;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly socketService: SocketGateway,
  ) {}

  onModuleInit() {
    this.logger.debug('BackgroundService has been initialized');
    this.startBackgroundTask();
  }

  onModuleDestroy() {
    this.logger.debug('BackgroundService is being destroyed');
    this.stopBackgroundTask();
  }

  async startBackgroundTask() {
    await this.run();

    this.intervalId = setTimeout(
      () => this.startBackgroundTask(),
      1.1 * 3600000,
    );
  }

  stopBackgroundTask() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }
  }

  async run() {
    const query = `
      SELECT
        *
      FROM
        "total_analytics_view";`;
    const result: tSummarizedTransaction[] =
      await this.prisma.$queryRawUnsafe(query);

    const vipData = await this.prisma.vIPLevel.findMany({
      orderBy: {
        id: 'asc',
      },
    });

    for (let rec of result) {
      const wagered = rec.sportBet + rec.casinoBet - rec.sportRollback;

      let vipLevel = 0;
      for (let i = 1; i < vipData.length; i++) {
        if (wagered < vipData[i].wagered) {
          vipLevel = i - 1;
          break;
        }
      }

      const user1 = await this.prisma.user.findUnique({
        where: { id: rec.userId },
      });

      const newVipLevel = vipLevel < user1.vipLevel ? user1.vipLevel : vipLevel;
      // set level up bonus

      const now = new Date();
      let cash = 0;
      for (let i = user1.vipLevel; i < newVipLevel; i++) {
        const tx = await this.prisma.transaction.findFirst({
          where: {
            platform: TransactionPlatform.LevelUpBonus,
            userId: rec.userId,
            note: i.toString(),
          },
        });

        if (!tx && vipData[i].levelUpBonus > 0) {
          const txId1 = uuidv4();
          await this.prisma.transaction.create({
            data: {
              id: txId1,
              cash: vipData[i].levelUpBonus,
              bonus: 0,
              locked: 0,
              io: 1,
              type: TransactionType.deposit,
              platform: TransactionPlatform.LevelUpBonus,
              currency: 'USD',
              initiatedAt: now,
              createdAt: now,
              context: {},
              userId: rec.userId,
              chainId: 0,
              tokenAmount: 0,
              isDeleted: 0,
              tokenName: '0',
              note: i.toString(),
            },
          });

          cash += vipData[i].levelUpBonus;
        }
      }

      const user = await this.prisma.user.update({
        omit: {
          btcPk: true,
          solanaPk: true,
          ethPk: true,
          ltcPk: true,
          password: true,
          subscription: true,
        },
        data: {
          vipLevel: newVipLevel,
          wagered: wagered,
          cash: {
            increment: cash,
          },
          cash_0: {
            increment: cash,
          },
        },
        where: { id: rec.userId },
      });

      this.socketService.sendBalanceUpdated(user.id, user);
    }
  }
}
