import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AddFavoriteGameDto } from './dto/AddFavoriteGameDto';

@Injectable()
export class FavoriteGameService {
  private readonly logger = new Logger(FavoriteGameService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addFavoriteGame(userId: string, body: AddFavoriteGameDto) {
    const count = await this.prisma.favoriteGame.count({
      where: {
        userId,
        gameId: body.gameId,
      },
    });

    if (count > 0) {
      throw new BadRequestException('already.exist');
    }

    return this.prisma.favoriteGame.create({
      data: {
        userId,
        gameId: body.gameId,
      },
    });
  }

  deleteFavoriteGame(userId: string, gameId: string) {
    return this.prisma.favoriteGame.deleteMany({
      where: {
        userId,
        gameId,
      },
    });
  }

  async getFavoriteGames(
    userId: string,
    keyword: string,
    category: string,
    type: string,
    providerId: number,
    offset: number,
    limit: number,
  ) {
    const [total, data] = await Promise.all([
      this.prisma.favoriteGame.count({
        where: {
          userId,
        },
      }),
      this.prisma.favoriteGame.findMany({
        include: {
          GR8Game: true,
        },
        where: {
          userId,
        },
        orderBy: {
          createdAt: 'asc',
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
}
