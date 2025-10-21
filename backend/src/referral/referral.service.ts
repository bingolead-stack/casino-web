import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ReferralReward } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionPlatform } from 'src/utils/constants';
import { numberRound } from 'src/utils/numberRound';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async getReferredUsers(userId: string, offset: number, length: number) {
    const today = new Date();
    let curYear = today.getUTCFullYear();
    let curMonth = today.getUTCMonth() + 1;

    const query = `
      SELECT
        "id",
        "email",
        "userName",
        "cash",
        "createdAt",
        "s"."casinoWin" + "s"."sportWin" - "s"."casinoBet" - "s"."sportBet" + "s"."sportRollback" AS "profit"
      FROM
        "users"
        LEFT JOIN (
          SELECT
            *
          FROM
            "monthly_analytics_view_date"
          WHERE
            "year" = '${curYear}'
            AND "month"= '${curMonth}'
        ) AS "s" ON "s"."userId" = "users"."id"
      WHERE
        "refererId" = '${userId}'
      ORDER BY
        "createdAt" DESC
      OFFSET ${offset > 0 ? offset : 0}
      LIMIT ${length > 0 ? length : 0};`;

    const [total, data] = await Promise.all([
      this.prisma.user.count({
        where: {
          refererId: userId,
        },
      }),
      this.prisma.$queryRawUnsafe(query),
    ]);

    return {
      total,
      data,
    };
  }

  async getReferredUsersCount(userId: string) {
    const total = await this.prisma.user.count({
      where: {
        refererId: userId,
      },
    });

    return total;
  }

  async getCalculatedReward(userId: string) {
    const [pendingRow, totalRow, availableRow] = await Promise.all([
      this.prisma.$queryRawUnsafe(`
        SELECT
          SUM("referral_rewards"."reward") AS "reward"
        FROM
          "referral_rewards"
          LEFT JOIN "summarized_bet_logs" AS "logs" ON "logs"."yearMonth" = "referral_rewards"."yearMonth"
        WHERE
          "userId" = '${userId}'
          AND "referral_rewards"."bFinalized" = false
          AND "logs"."yearMonth" IS NULL;`),
      this.prisma.referralReward.aggregate({
        _sum: {
          reward: true,
        },
        where: {
          userId,
        },
      }),
      this.prisma.$queryRawUnsafe(`
        SELECT
          SUM("referral_rewards"."reward") AS "reward"
        FROM
          "referral_rewards"
          LEFT JOIN "summarized_bet_logs" AS "logs" ON "logs"."yearMonth" = "referral_rewards"."yearMonth"
        WHERE
          "userId" = '${userId}'
          AND "referral_rewards"."bFinalized" = false
          AND "logs"."yearMonth" IS NOT NULL;`),
    ]);

    return {
      pending: numberRound(pendingRow?.[0].reward || 0),
      available: numberRound(availableRow?.[0].reward || 0),
      total: numberRound(totalRow._sum.reward || 0),
    };
  }

  async withdrawReferral(userId: string) {
    const availableRow = await this.prisma.$queryRawUnsafe(`
      SELECT
        SUM("referral_rewards"."reward") AS "reward"
      FROM
        "referral_rewards"
        LEFT JOIN "summarized_bet_logs" AS "logs" ON "logs"."yearMonth" = "referral_rewards"."yearMonth"
      WHERE
        "userId" = '${userId}'
        AND "referral_rewards"."bFinalized" = false
        AND "logs"."yearMonth" IS NOT NULL;`);
    const available = numberRound(availableRow?.[0].reward || 0);

    if (available === 0) {
      return 'Available money is zero';
    }

    const user1 = await this.prisma.$transaction(async (prismaClient) => {
      const availableRows: ReferralReward[] =
        await prismaClient.$queryRawUnsafe(`
        SELECT
          "referral_rewards".*
        FROM
          "referral_rewards"
          LEFT JOIN "summarized_bet_logs" AS "logs" ON "logs"."yearMonth" = "referral_rewards"."yearMonth"
        WHERE
          "userId" = '${userId}'
          AND "referral_rewards"."bFinalized" = false
          AND "logs"."yearMonth" IS NOT NULL;`);

      const updatingYearMonths: number[] = [];
      for (let i = 0; i < availableRows.length; i++) {
        updatingYearMonths.push(availableRows[i].yearMonth);
      }

      await prismaClient.referralReward.updateMany({
        data: {
          bFinalized: true,
        },
        where: {
          userId,
          yearMonth: {
            in: updatingYearMonths,
          },
        },
      });

      // add payment
      const txId = uuidv4();
      const tx = await prismaClient.transaction.create({
        data: {
          id: txId,
          cash: available,
          bonus: 0,
          locked: 0,
          io: 1,
          type: 'deposit',
          platform: TransactionPlatform.ReferralBonus,
          currency: 'USD',
          initiatedAt: new Date(),
          createdAt: new Date(),
          context: JSON.stringify({
            yearMonths: updatingYearMonths,
          }),
          userId: userId,
          chainId: 0,
          tokenAmount: 0,
          isDeleted: 0,
          note: 'referral.bonus',
          tokenName: '0',
        },
      });

      const user1 = await prismaClient.user.update({
        omit: {
          btcPk: true,
          solanaPk: true,
          ethPk: true,
          password: true,
          ltcPk: true,
          subscription: true,
        },
        where: {
          id: userId,
        },
        data: {
          cash: {
            increment: tx.cash,
          },
          cash_0: {
            increment: tx.cash,
          },
        },
      });

      return user1;
    });

    return user1;
  }
}
