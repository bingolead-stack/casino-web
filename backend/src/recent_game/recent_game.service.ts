import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RecentGameService {
  private readonly logger = new Logger(RecentGameService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getRecentGames(userId: string, offset: number, limit: number) {
    const [total, data] = await Promise.all([
      this.prisma.recentGame.count({
        where: {
          userId,
        },
      }),
      this.prisma.recentGame.findMany({
        include: {
          GR8Game: true,
        },
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset > 0 ? offset : 0,
        take: limit > 0 ? limit : 100,
      }),
    ]);

    return {
      total,
      data: data.map((r) => r.GR8Game),
    };
  }

  async addToRecent(userId: string, gameId: string) {
    const bExist = await this.prisma.recentGame.findFirst({
      where: {
        userId,
        gameId,
      },
    });

    if (bExist) {
      await this.prisma.recentGame.update({
        data: {
          createdAt: new Date(),
        },
        where: {
          id: bExist.id,
        },
      });
    } else {
      // create recent game entry
      await this.prisma.recentGame.create({
        data: {
          userId: userId,
          gameId: gameId,
        },
      });
    }
  }
}
