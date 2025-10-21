import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { ReferralService as ClientReferralService } from 'src/referral/referral.service';

@Injectable()
export class ReferralService {
  private readonly logger = new Logger(ReferralService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly clientReferralService: ClientReferralService,
  ) {}

  async findReferers(keyword: string, offset: number, length: number) {
    this.logger.debug(`Find all referers: offset ${offset} length ${length}`);

    const today = new Date();
    let curYear = today.getUTCFullYear();
    let curMonth = today.getUTCMonth() + 1;

    const trimmed = keyword?.trim() || '';

    const queryCount = `SELECT
        COUNT(DISTINCT "u2"."id") AS "count"
      FROM
        "users" AS "u1"
        LEFT JOIN "users" AS "u2" ON "u1"."refererId" = "u2"."id"
      WHERE
        "u1"."refererId" IS NOT NULL
        AND (
          "u2"."userName" LIKE '%${trimmed}%'
          OR "u2"."email" LIKE '%${trimmed}%'
          OR "u2"."id" LIKE '%${trimmed}%'
        );`;

    const queryData = `SELECT
        "u2"."id",
        "u2"."email",
        "u2"."userName",
        "u2"."createdAt",
        "u2"."cash",
        "u2"."avatar",
        "u2"."vipLevel",
        COUNT("u1"."id") AS "referredCount",
        (
          SELECT
            SUM("reward")
          FROM
            "referral_rewards" AS "r1"
          LEFT JOIN "summarized_bet_logs" AS "logs" ON "logs"."yearMonth" = "r1"."yearMonth"
          WHERE
            "r1"."userId" = "u2"."id"
            AND "r1"."bFinalized"=false
	          AND "logs"."yearMonth" IS NULL
        ) AS "pending",
        (
          SELECT
            SUM("reward")
          FROM
            "referral_rewards" AS "r2"
          LEFT JOIN "summarized_bet_logs" AS "logs" ON "logs"."yearMonth" = "r2"."yearMonth"
          WHERE
            "r2"."userId" = "u2"."id"
	          AND "logs"."yearMonth" IS NOT NULL
            AND "r2"."bFinalized"=false
        ) AS "available",
        (
          SELECT
            SUM("reward")
          FROM
            "referral_rewards" AS "r3"
          WHERE
            "r3"."userId" = "u2"."id"
        ) AS "total",
        SUM("depositCrypto") AS "depositCrypto",
        SUM("depositManual") AS "depositManual",
        SUM("depositBonus") AS "depositBonus",
        SUM("referralBonus") AS "referralBonus",
        SUM("transferIn") AS "transferIn",
        SUM("withdrawCrypto") AS "withdrawCrypto",
        SUM("withdrawManual") AS "withdrawManual",
        SUM("transferOut") AS "transferOut",
        SUM("casinoBet") AS "casinoBet",
        SUM("casinoWin") AS "casinoWin",
        SUM("sportBet") AS "sportBet",
        SUM("sportWin") AS "sportWin",
        SUM("sportRollback") AS "sportRollback"
      FROM
        "users" AS "u1"
        LEFT JOIN "users" AS "u2" ON "u1"."refererId" = "u2"."id"
        LEFT JOIN "total_analytics_view" AS "analytics" ON "analytics"."userId"="u1"."id"
      WHERE
        "u1"."refererId" IS NOT NULL
        AND (
          "u2"."userName" LIKE '%${trimmed}%'
          OR "u2"."email" LIKE '%${trimmed}%'
          OR "u2"."id" LIKE '%${trimmed}%'
        )
      GROUP BY
        "u2"."id",
        "u2"."email",
        "u2"."userName",
        "u2"."createdAt"
      ORDER BY
        "u2"."userName",
        "u2"."id"
      OFFSET
        ${offset < 0 ? 0 : offset}
      LIMIT
        ${length > 0 ? length : 10};`;

    const [totalRows, dataRows] = await Promise.all([
      this.prisma.$queryRawUnsafe(queryCount),
      this.prisma.$queryRawUnsafe(queryData),
    ]);

    return {
      total: totalRows[0].count,
      data: dataRows,
    };
  }

  async findRefererDetail(
    userId: string,
    year: number,
    month: number,
    offset: number,
    length: number,
  ) {
    const queryCount = `
      SELECT
        COUNT("u1"."id") AS "count"
      FROM
        "users" AS "u1"
        LEFT JOIN "monthly_analytics_view_date" AS "analytics" ON "u1"."id" = "analytics"."userId"
      WHERE
        "u1"."refererId" = '${userId}'
        AND "analytics"."year"='${year}'
        AND "analytics"."month"='${month}';
    `;

    const query = `
      SELECT
        "u1"."id",
        "u1"."email",
        "u1"."userName",
        "u1"."cash",
        "u1"."createdAt",
        "u1"."vipLevel",
        "u1"."avatar",
        "analytics".*
      FROM
        "users" AS "u1"
        LEFT JOIN "monthly_analytics_view_date" AS "analytics" ON "u1"."id" = "analytics"."userId"
      WHERE
        "u1"."refererId" = '${userId}'
        AND "analytics"."year"='${year}'
        AND "analytics"."month"='${month}'
      ORDER BY
        "u1"."userName",
        "u1"."id"
      OFFSET
        ${offset < 0 ? 0 : offset}
      LIMIT
        ${length > 0 ? length : 10};`;

    const [total, data, summarized] = await Promise.all([
      this.prisma.$queryRawUnsafe(queryCount),
      this.prisma.$queryRawUnsafe(query),
      this.clientReferralService.getCalculatedReward(userId),
    ]);

    return { total: total[0].count, data, summarized };
  }
}
