import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { v4 as uuidv4 } from 'uuid';
import { TransactionPlatform } from 'src/utils/constants';
import { PrizeUser, TransactionType } from '@prisma/client';
import { numberRound } from 'src/utils/numberRound';
import { tSummarizedTransaction } from 'src/types/tSummarizedTransaction';

@Injectable()
export class PrizeBackgroundService {
  private readonly logger = new Logger(PrizeBackgroundService.name);
  private intervalId: NodeJS.Timeout;
  private counter = 0;

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
    this.logger.debug('Checking prize states');

    await this.run();

    this.intervalId = setTimeout(() => this.startBackgroundTask(), 60000);
    this.counter = (this.counter + 1) % 40320;
  }

  stopBackgroundTask() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }
  }

  async run() {
    const prize = await this.prisma.prize.findFirst({
      where: {
        status: 0,
      },
      orderBy: {
        startedAt: 'desc',
      },
    });

    if (!prize) {
      return;
    }

    const startDate = prize.startedAt;
    const endDate = prize.endedAt;
    const query = `
      SELECT
        "userId",
        SUM(
          CASE
            WHEN TYPE = 'deposit'::"TransactionType"
            AND IO = 1
            AND PLATFORM = 'deposit.crypto'::TEXT THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "depositCrypto",
        SUM(
          CASE
            WHEN TYPE = 'deposit'::"TransactionType"
            AND IO = 1
            AND PLATFORM = 'deposit.manual'::TEXT THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "depositManual",
        SUM(
          CASE
            WHEN TYPE = 'deposit'::"TransactionType"
            AND IO = 1
            AND PLATFORM = 'deposit.bonus'::TEXT THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "depositBonus",
        SUM(
          CASE
            WHEN TYPE = 'deposit'::"TransactionType"
            AND IO = 1
            AND PLATFORM = 'referral.bonus'::TEXT THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "referralBonus",
        SUM(
          CASE
            WHEN TYPE = 'deposit'::"TransactionType"
            AND IO = 1
            AND PLATFORM = 'transfer'::TEXT THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "transferIn",
        SUM(
          CASE
            WHEN TYPE = 'withdrawal'::"TransactionType"
            AND IO = '-1'::INTEGER
            AND PLATFORM = 'withdraw.crypto'::TEXT THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "withdrawCrypto",
        SUM(
          CASE
            WHEN TYPE = 'withdrawal'::"TransactionType"
            AND IO = '-1'::INTEGER
            AND PLATFORM = 'withdraw.manual'::TEXT THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "withdrawManual",
        SUM(
          CASE
            WHEN TYPE = 'withdrawal'::"TransactionType"
            AND IO = '-1'::INTEGER
            AND PLATFORM = 'transfer'::TEXT THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "transferOut",
        SUM(
          CASE
            WHEN (
              (
                TYPE = 'withdrawal'::"TransactionType"
                AND PLATFORM = 'fungamess.casino'::TEXT
              )
              OR (
                TYPE = 'bet'::"TransactionType"
                AND PLATFORM = 'gr8.casino'::TEXT
              )
            )
            AND IO = '-1'::INTEGER THEN CASH
            WHEN TYPE = 'refund'::"TransactionType"
            AND PLATFORM = 'gr8.casino'::TEXT THEN CASH * IO * -1
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "casinoBet",
        SUM(
          CASE
            WHEN (
              (
                TYPE = 'deposit'::"TransactionType"
                AND PLATFORM = 'fungamess.casino'::TEXT
              )
              OR (
                TYPE = 'win'::"TransactionType"
                AND PLATFORM = 'gr8.casino'::TEXT
              )
            )
            AND IO = 1 THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "casinoWin",
        SUM(
          CASE
            WHEN TYPE = 'withdrawal'::"TransactionType"
            AND IO = '-1'::INTEGER
            AND PLATFORM = 'sport'::TEXT THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "sportBet",
        SUM(
          CASE
            WHEN TYPE = 'deposit'::"TransactionType"
            AND IO = 1
            AND PLATFORM = 'sport'::TEXT THEN CASH
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "sportWin",
        SUM(
          CASE
            WHEN TYPE = 'rollback'::"TransactionType"
            AND PLATFORM = 'sport'::TEXT THEN CASH * IO::DOUBLE PRECISION
            ELSE 0::DOUBLE PRECISION
          END
        ) AS "sportRollback"
      FROM
        "transactions"
      WHERE
        "createdAt" > '${startDate.toISOString()}' AND "createdAt" <= '${endDate.toISOString()}'
        AND "userId" != '000001f7'
        AND "userId" != '00000202'
        AND "userId" != '0000020f'
      GROUP BY
        "userId";`;

    const result: tSummarizedTransaction[] =
      await this.prisma.$queryRawUnsafe(query);

    let res1 = result.map((e) => ({
      ...e,
      wagered: (e.casinoBet || 0) + (e.sportBet || 0) - (e.sportRollback || 0),
    }));

    if (prize.id === 1) {
      /**
       * Add one second place 
        rabbithole 117000.26 (wagered amount ) 
        Add 4th place 
        Juliano01 55000
       */

      res1.push({
        wagered: 117000.26,
        userId: '00000817',
        depositCrypto: 0,
        depositManual: 0,
        depositBonus: 0,
        referralBonus: 0,
        transferIn: 0,
        withdrawCrypto: 0,
        withdrawManual: 0,
        transferOut: 0,
        casinoBet: 0,
        casinoWin: 0,
        sportBet: 0,
        sportWin: 0,
        sportRollback: 0,
      });

      res1.push({
        wagered: 55000.62,
        userId: '00000818',
        depositCrypto: 0,
        depositManual: 0,
        depositBonus: 0,
        referralBonus: 0,
        transferIn: 0,
        withdrawCrypto: 0,
        withdrawManual: 0,
        transferOut: 0,
        casinoBet: 0,
        casinoWin: 0,
        sportBet: 0,
        sportWin: 0,
        sportRollback: 0,
      });
    }

    let res = res1
      .sort((a, b) => (a.wagered < b.wagered ? 1 : -1))
      .slice(0, 10)
      .map<PrizeUser>((e) => ({
        prizeId: prize.id,
        userId: e.userId,
        wagered: e.wagered,
        prize: 0,
      }));

    let sum = 0;
    res.forEach((e) => (sum += e.wagered));
    if (sum > 0) {
      res.forEach((e, i) => {
        res[i].prize = numberRound(
          (prize.prize * (9 - i)) / 100 +
            (prize.prize * 0.55 * e.wagered) / sum,
        );
      });
    }

    await this.prisma.prizeUser.deleteMany({
      where: {
        prizeId: prize.id,
      },
    });

    await this.prisma.prizeUser.createMany({
      data: res,
    });

    const now = new Date();
    if (prize.endedAt < now) {
      this.logger.debug("prize ended");
      await this.prisma.prize.update({
        data: {
          status: 1,
          updatedAt: now,
        },
        where: {
          id: prize.id,
        },
      });

      // update user balance
      for (let i = 0; i < res.length; i++) {
        const user1 = await this.prisma.$transaction(async (prismaClient) => {
          this.logger.debug('Storing transaction ... ');

          // add payment
          const txId1 = uuidv4();
          const tx1 = await prismaClient.transaction.create({
            data: {
              id: txId1,
              cash: res[i].prize,
              bonus: 0,
              locked: 0,
              io: 1,
              type: TransactionType.deposit,
              platform: TransactionPlatform.LeaderboardBonus,
              currency: 'USD',
              initiatedAt: now,
              createdAt: now,
              context: {},
              userId: res[i].userId,
              chainId: 0,
              tokenAmount: 0,
              isDeleted: 0,
              tokenName: '0',
            },
          });

          const user1 = await prismaClient.user.update({
            omit: {
              btcPk: true,
              solanaPk: true,
              ethPk: true,
              ltcPk: true,
              password: true,
              subscription: true,
            },
            where: {
              id: res[i].userId,
            },
            data: {
              cash: {
                increment: tx1.cash,
              },
              cash_0: {
                increment: tx1.cash,
              },
            },
          });

          return user1;
        });

        this.socketService.sendBalanceUpdated(user1.id, user1);
      }

      await this.prisma.prize.create({
        data: {
          status: 0,
          prize: 1000,
          startedAt: now,
          endedAt: new Date(now.getTime() + 14 * 86400 * 1000),
          updatedAt: now,
        },
      });
    }

    return res;
  }
}
