import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { generateBtcAddress } from 'src/blockchain/libBTC';
import { PrismaService } from 'src/prisma/prisma.service';
import { encrypt } from 'src/utils/encrypt';

@Injectable()
export class ReferralBackgroundService {
  private readonly logger = new Logger(ReferralBackgroundService.name);
  private intervalId: NodeJS.Timeout;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    this.logger.debug('BackgroundService has been initialized');
    // this.generateLTCAddresses();
    this.startBackgroundTask();
  }

  onModuleDestroy() {
    this.logger.debug('BackgroundService is being destroyed');
    this.stopBackgroundTask();
  }

  async startBackgroundTask() {
    await this.run();

    this.intervalId = setTimeout(() => this.startBackgroundTask(), 1 * 3600000);
  }

  stopBackgroundTask() {
    if (this.intervalId) {
      clearTimeout(this.intervalId);
    }
  }

  async calculateSummarizedBet() {
    const today = new Date();
    let curYear = today.getUTCFullYear();
    let curMonth = today.getUTCMonth() + 1;
    if (today.getUTCDate() < 8) {
      curYear = curMonth === 1 ? curYear - 1 : curYear;
      curMonth = curMonth === 1 ? 12 : curMonth - 1;
    }

    const lastYear = curMonth === 1 ? curYear - 1 : curYear;
    const lastMonth = curMonth === 1 ? 12 : curMonth - 1;

    // check if last month's report was finalized
    const bFinalized = await this.prisma.summarizedBetLog.findFirst({
      where: {
        yearMonth: lastYear * 100 + lastMonth,
      },
    });

    if (!bFinalized && lastYear !== 2024) {
      await this._calculateReferralReward(lastYear, lastMonth, false);
      await this.prisma.summarizedBetLog.create({
        data: {
          yearMonth: lastYear * 100 + lastMonth,
        },
      });
    }

    await this._calculateReferralReward(curYear, curMonth, false);
  }

  private async _calculateReferralReward(
    year: number,
    month: number,
    bFinalized: boolean,
  ) {
    const query = `SELECT
        "referers"."id" AS "refererId",
        "referers"."email" AS "refererEmail",
        "referers"."userName" AS "refererName",
        "analytics"."userId" AS "userId",
        "analytics"."year",
        "analytics"."month",
        "casinoWin" - "casinoBet" + "sportWin" - ("sportBet" - "sportRollback") as "profit",
        "users"."email",
        "users"."userName",
        "users"."createdAt"
      FROM
        "monthly_analytics_view_date" AS "analytics"
        LEFT JOIN "users" ON "users"."id" = "analytics"."userId"
        LEFT JOIN "users" AS "referers" ON "referers"."id" = "users"."refererId"
      WHERE
        "referers"."id" IS NOT NULL
        AND "analytics"."year" = '${year}'
        AND "analytics"."month" = '${month}';`;

    const rows: {
      refererId: string;
      refererEmail: string;
      refererName: string;
      userId: string;
      year: number;
      month: number;
      profit: number;
      email: string;
      userName: string;
      createdAt: Date;
    }[] = await this.prisma.$queryRawUnsafe(query);

    const countData: { [refererId: string]: number } = {};
    rows.forEach((r) => {
      if (!countData[r.refererId]) {
        countData[r.refererId] = 0;
      }

      countData[r.refererId] += 1;
    });

    await this.prisma.referralReward.deleteMany({
      where: {
        yearMonth: year * 100 + month,
      },
    });

    for (let refererId in countData) {
      const count = countData[refererId];

      let rate = 0;
      if (count <= 10) {
        rate = 0.1;
      } else if (count <= 24) {
        rate = 0.15;
      } else {
        rate = 0.2;
      }

      let reward = 0;
      rows
        .filter((r) => r.refererId === refererId)
        .forEach((r) => (reward += -r.profit * rate));

      if (reward < 0) {
        reward = 0;
      }
      
      await this.prisma.referralReward.create({
        data: {
          userId: refererId,
          yearMonth: year * 100 + month,
          reward: reward,
          bFinalized,
        },
      });
    }
  }

  // async generateLTCAddresses() {
  //   const users = await this.prisma.user.findMany({
  //     where: {
  //       ltcAddress: null,
  //     },
  //   });

  //   for (let i = 0; i < users.length; i++) {
  //     const ltc = generateBtcAddress('litecoin');
  //     await this.prisma.user.update({
  //       data: {
  //         ltcAddress: ltc.address,
  //         ltcPk: encrypt(ltc.privateKey),
  //       },
  //       where: { id: users[i].id },
  //     });
  //   }

  //   this.logger.debug('Finished LTC addresses ...');
  // }

  async run() {
    this.logger.debug('Calculating summarized bets ...');
    await this.calculateSummarizedBet();
    this.logger.debug('Ended calculating summarized bets');
  }
}
