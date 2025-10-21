import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as ip3country from 'ip3country';
import { Prisma, UserActivityType } from '@prisma/client';

@Injectable()
export class UserActivityService {
  private readonly logger = new Logger(UserActivityService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addActivity(data: {
    userId: string;
    ip: string;
    type: UserActivityType;
    gameId?: string;
    gameName?: string;
    provider?: string;
    cash?: number;
  }) {
    try {
      const countryCode = ip3country.lookupStr(data.ip) || '';
      await this.prisma.userActivity.create({
        data: { ...data, country: countryCode },
      });
    } catch (ex) {
      console.error(ex);
    }
  }

  async getActivities(
    userId: string,
    startTimestamp: number,
    endTimestamp: number,
    offset: number,
    length: number,
  ) {
    const startDate = new Date(startTimestamp || 0);
    const endDate = endTimestamp
      ? new Date(endTimestamp)
      : new Date(2100, 1, 1);

    this.logger.debug(`Start date: ${startDate.toISOString()}`);
    this.logger.debug(`End date: ${endDate.toISOString()}`);

    const where: Prisma.UserActivityWhereInput = {
      userId,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const promises = [
      this.prisma.userActivity.count({
        where,
      }),
      this.prisma.userActivity.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: length,
      }),
    ];

    const [total, data] = await Promise.all(promises);

    return {
      total,
      data,
    };
  }
}
