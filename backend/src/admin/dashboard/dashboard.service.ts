import { Injectable, Logger } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { numberRound } from 'src/utils/numberRound';
import { tProviderAnalysis } from './dto/tProviderAnalysis';
import * as ExcelJS from 'exceljs';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly socketGateway: SocketGateway,
  ) {}

  async findAll(auth: User) {
    const promiseUserCount = this.prisma.user.count({
      where: {
        role: UserRole.NORMAL,
        isDeleted: false,
      },
    });

    const promiseAgentCount = this.prisma.agent.count({
      where: {
        isDeleted: false,
      },
    });

    const connectedUserIds = this.socketGateway.getConnectedUserIds();

    const [userCount, agentCount, connectedUsers] = await Promise.all([
      promiseUserCount,
      promiseAgentCount,
      this.prisma.user.findMany({
        select: {
          id: true,
          email: auth.role !== UserRole.SUB_ADMIN,
          userName: true,
          cash: true,
          createdAt: true,
          bonus_sum: true,
        },
        where: {
          id: {
            in: connectedUserIds,
          },
        },
      }),
    ]);

    return {
      userCount,
      agentCount,
      connectedUsers,
    };
  }

  async getAnalysisByProviders(
    startTimestamp: number,
    endTimestamp: number,
    userId: string,
  ) {
    const startDate =
      startTimestamp > 0 ? new Date(startTimestamp) : new Date(0);
    const endDate =
      endTimestamp > 0 ? new Date(endTimestamp) : new Date(2100, 1, 1);

    const query = `
      SELECT
        "platform",
        "providerId",
        "provider",
        "io",
        SUM("cash") AS "cash"
      FROM
        "transactions"
      WHERE
        ("platform" = 'fungamess.casino' OR "platform" = 'gr8.casino'
        OR "platform" = 'sport')
        AND "createdAt" >= '${startDate.toISOString()}'
        AND "createdAt" <= '${endDate.toISOString()}'
        ${userId ? `AND "userId" = '${userId}'` : ''}
      GROUP BY
        "platform",
        "providerId",
        "provider",
        "io"
      ORDER BY
        "platform",
        "providerId",
        "provider",
        "io";`;
    const result: {
      platform: string | null;
      providerId: number | null;
      provider: string | null;
      io: 1 | -1;
      cash: number;
    }[] = await this.prisma.$queryRawUnsafe(query);

    const res: tProviderAnalysis[] = [];
    result.forEach((e) => {
      const { platform, io, cash, provider, providerId } = e;
      const index = res.findIndex(
        (r) =>
          r.platform === platform &&
          r.provider === provider &&
          r.id === providerId,
      );

      if (index === -1) {
        res.push({
          id: providerId,
          platform,
          bet: io === -1 ? numberRound(cash) : 0,
          paid: io === 1 ? numberRound(cash) : 0,
          provider: provider,
        });
      } else {
        res[index][io === -1 ? 'bet' : 'paid'] = numberRound(cash);
      }
    });

    return res;
  }

  async getAnalysisByProvidersReal(
    startTimestamp: number,
    endTimestamp: number,
  ) {
    const startDate =
      startTimestamp > 0 ? new Date(startTimestamp) : new Date(0);
    const endDate =
      endTimestamp > 0 ? new Date(endTimestamp) : new Date(2100, 1, 1);

    const query = `
      SELECT
        "platform",
        "providerId",
        "provider",
        "io",
        SUM("cash") AS "cash"
      FROM
        "transactions"
      WHERE
        ("platform" = 'fungamess.casino' OR "platform" = 'gr8.casino'
        OR "platform" = 'sport')
        AND "createdAt" >= '${startDate.toISOString()}'
        AND "createdAt" <= '${endDate.toISOString()}'
        AND "userId" NOT IN (SELECT "id" FROM "streamers")
      GROUP BY
        "platform",
        "providerId",
        "provider",
        "io"
      ORDER BY
        "platform",
        "providerId",
        "provider",
        "io";`;

    const result: {
      platform: string | null;
      providerId: number | null;
      provider: string | null;
      io: 1 | -1;
      cash: number;
    }[] = await this.prisma.$queryRawUnsafe(query);

    const res: tProviderAnalysis[] = [];
    result.forEach((e) => {
      const { platform, io, cash, provider, providerId } = e;
      const index = res.findIndex(
        (r) =>
          r.platform === platform &&
          r.provider === provider &&
          r.id === providerId,
      );

      if (index === -1) {
        res.push({
          id: providerId,
          platform,
          bet: io === -1 ? numberRound(cash) : 0,
          paid: io === 1 ? numberRound(cash) : 0,
          provider: provider,
        });
      } else {
        res[index][io === -1 ? 'bet' : 'paid'] = numberRound(cash);
      }
    });

    return res;
  }

  async exportXLS(startTimestamp: number, endTimestamp: number) {
    const data = await this.getAnalysisByProviders(
      +startTimestamp,
      +endTimestamp,
      '',
    );

    const startDate =
      startTimestamp > 0 ? new Date(startTimestamp) : new Date(0);
    const endDate =
      endTimestamp > 0 ? new Date(endTimestamp) : new Date(2100, 1, 1);

    const providerFeeList = await this.prisma.providerFee.findMany({});
    const providerFees: { [id: number]: number } = {};
    providerFeeList.forEach((p) => (providerFees[p.id] = p.fee));

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(
      `${startDate.getFullYear()}-${startDate.getMonth() + 1}-${startDate.getDate()} ${endDate.getFullYear()}-${endDate.getMonth() + 1}-${endDate.getDate()}`,
    );

    worksheet.columns = [
      { header: 'Providers', key: 'provider' },
      { header: 'Total Bets', key: 'totalBet' },
      { header: 'Total Returns', key: 'totalReturn' },
      { header: 'Profit', key: 'profit' },
      { header: 'Provider Fee', key: 'providerFee' },
      { header: 'Provider Money', key: 'providerMoney' },
    ];

    const totalRow = {
      provider: 'TOTAL',
      profit: 0,
      providerMoney: 0,
    };

    data.forEach((r) => {
      if (r.platform === 'sport') {
        return;
      }

      const providerFee = providerFees[r.id] ?? 0;
      const profit = r.bet - r.paid;
      const providerMoney =
        profit > 0 ? numberRound((profit * providerFee) / 100, 100) : 0;
      totalRow.profit += profit;
      totalRow.providerMoney += providerMoney;
      worksheet.addRow({
        provider: r.provider
          ? r.provider
          : r.platform === 'sport'
            ? 'sport'
            : '',
        totalBet: r.bet,
        totalReturn: r.paid,
        profit: profit,
        providerFee: providerFee,
        providerMoney: providerMoney,
      });
    });

    worksheet.addRow({});
    worksheet.addRow(totalRow);

    return workbook;
  }

  async getFinanceAnalysis(
    startTimestamp: number,
    endTimestamp: number,
    timezoneOffsetInMinutes: number,
  ) {
    const startDate =
      startTimestamp > 0 ? new Date(startTimestamp) : new Date(0);
    const endDate =
      endTimestamp > 0 ? new Date(endTimestamp) : new Date(2100, 1, 1);

    const query = `SELECT
        "type",
        DATE("createdAt" AT TIME ZONE 'UTC' - (${timezoneOffsetInMinutes} || ' minutes')::interval) AS "date",
        ROUND(SUM("cash") * 100) / 100 AS "cash"
      FROM
        PUBLIC.TRANSACTIONS
      WHERE
        (
          "platform" = 'deposit.crypto'
          OR "platform" = 'withdraw.crypto'
        )
        AND "isDeleted" = '0'
        AND "createdAt" >= '${startDate.toISOString()}'
        AND "createdAt" <= '${endDate.toISOString()}'
      GROUP BY
        "type",
        DATE("createdAt" AT TIME ZONE 'UTC' - (${timezoneOffsetInMinutes} || ' minutes')::interval);`;
    const result = await this.prisma.$queryRawUnsafe(query);

    return result;
  }

  async getFinanceAnalysisSum(startTimestamp: number, endTimestamp: number) {
    const startDate =
      startTimestamp > 0 ? new Date(startTimestamp) : new Date(0);
    const endDate =
      endTimestamp > 0 ? new Date(endTimestamp) : new Date(2100, 1, 1);

    const result = await this.prisma.$queryRaw`SELECT
        "type",
        ROUND(SUM("cash") * 100) / 100 AS "cash"
      FROM
        PUBLIC.TRANSACTIONS
      WHERE
        (
          "platform" = 'deposit.crypto'
          OR "platform" = 'withdraw.crypto'
        )
        AND "isDeleted" = '0'
        AND "createdAt" >= ${startDate}
        AND "createdAt" <= ${endDate}
      GROUP BY
        "type";`;

    const res = {};
    (result as any[]).forEach((e) => (res[e.type] = e.cash));
    return res;
  }
}
