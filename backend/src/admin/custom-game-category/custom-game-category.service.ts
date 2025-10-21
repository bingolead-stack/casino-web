import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SetGameTypeDto } from './dto/SetGameTypeDto';
import { SetProviderStateDto } from './dto/SetProviderStateDto';
import { ConfigService } from '@nestjs/config';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { GR8Game, GR8Provider } from '@prisma/client';
import { S3_REGION, S3_BUCKET } from 'src/utils/constants';
import { UpdateOrderDto } from './dto/UpdateOrderDto';
import { Gr8CasinoService } from 'src/gr8_casino/gr8_casino.service';

@Injectable()
export class CustomGameCategoryService {
  private readonly logger = new Logger(CustomGameCategoryService.name);
  private baseUri = '';

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly gr8CasinoService: Gr8CasinoService,
  ) {
    this.baseUri = this.configService.get<string>('FUNGAMESS_BASEURI');
  }

  async findAll(gameType: string, offset: number, limit: number) {
    const total = await this.prisma.customGameCategory.count({
      where: {
        ...(!!gameType ? { category: gameType } : {}),
      },
    });

    const data = await this.prisma.customGameCategory.findMany({
      include: {
        GR8Game: true,
      },
      where: {
        ...(!!gameType ? { category: gameType } : {}),
      },
      orderBy: [
        { category: 'asc' },
        { order: 'asc' },
        {
          GR8Game: {
            id: 'asc',
          },
        },
        { id: 'asc' },
      ],
      skip: offset > 0 ? offset : 0,
      take: limit > 0 ? limit : 20,
    });

    return {
      total,
      data,
    };
  }

  async setGameType(data: SetGameTypeDto) {
    try {
      if (data.id) {
        if (data.category) {
          return await this.prisma.customGameCategory.update({
            include: {
              GR8Game: true,
            },
            data: {
              category: data.category,
            },
            where: {
              id: data.id,
            },
          });
        } else {
          return await this.prisma.customGameCategory.delete({
            where: {
              id: data.id,
            },
          });
        }
      } else {
        if (data.category) {
          const count = await this.prisma.customGameCategory.count({
            where: {
              gameId: data.gameId,
              category: data.category,
            },
          });

          if (count === 0) {
            const c = await this.prisma.customGameCategory.create({
              data: {
                gameId: data.gameId,
                category: data.category,
              },
            });

            return await this.prisma.customGameCategory.findUnique({
              include: {
                GR8Game: true,
              },
              where: {
                id: c.id,
              },
            });
          }

          return 'success';
        } else {
          return await this.prisma.customGameCategory.deleteMany({
            where: {
              gameId: data.gameId,
            },
          });
        }
      }
    } catch (ex) {
      this.logger.error(ex);
      throw ex;
    }
  }

  setProviderState(data: SetProviderStateDto) {
    return this.prisma.gR8Provider.update({
      data: {
        added_slot: data.added_slot,
      },
      where: {
        provider: data.provider,
      },
    });
  }

  async uploadImage(gameId: number, file: Express.Multer.File) {
    if (this.configService.get<string>('IFRAME_HOST')) {
      return false;
    }

    const filename = `custom-images/${gameId}.png`;

    const s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      region: S3_REGION,
    });

    // upload to s3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: S3_BUCKET,
        Key: filename,
        Body: file.buffer,
        ContentType: file.mimetype,
      }),
    );

    // get file path
    const customPath = `https://${S3_BUCKET}.s3.${S3_REGION}.amazonaws.com/${filename}`;

    // remove orinal file
    try {
      await this.deleteImage(gameId);
    } catch (ex) {
      this.logger.error(ex);
    }

    await this.prisma.fungamessGame.update({
      data: {
        img_custom: customPath,
      },
      where: {
        id: gameId,
      },
    });

    return customPath;
  }

  async deleteImage(gameId: number) {
    if (this.configService.get<string>('IFRAME_HOST')) {
      return false;
    }

    const game = await this.prisma.fungamessGame.findUniqueOrThrow({
      where: {
        id: gameId,
      },
    });

    const filename = game.img_custom;
    if (!filename) {
      return 'already removed';
    }

    const s3Client = new S3Client({
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get<string>(
          'AWS_SECRET_ACCESS_KEY',
        ),
      },
      region: S3_REGION,
    });

    try {
      await s3Client.send(
        new DeleteObjectCommand({
          Bucket: S3_BUCKET,
          Key: filename,
        }),
      );
    } catch (ex) {
      this.logger.error(ex);
    }

    await this.prisma.fungamessGame.update({
      data: {
        img_custom: null,
      },
      where: {
        id: gameId,
      },
    });

    return 'success';
  }

  async updateGames() {
    const { games, providers } = await this.gr8CasinoService.fetchGames();

    // store to recover the states
    const [
      oldGames,
      oldProviders,
      oldCustomGameCategories,
      oldFavorites,
      oldRecent,
    ] = await Promise.all([
      this.prisma.gR8Game.findMany({}),
      this.prisma.gR8Provider.findMany({}),
      this.prisma.customGameCategory.findMany(),
      this.prisma.favoriteGame.findMany(),
      this.prisma.recentGame.findMany(),
    ]);

    const oldGameMap: { [id: string]: GR8Game } = {};
    oldGames.forEach((p) => (oldGameMap[p.id] = p));

    // store to recover the states
    const oldProviderMap: { [id: string]: GR8Provider } = {};
    oldProviders.forEach((p) => (oldProviderMap[p.provider] = p));

    this.logger.debug(`Fetched game count: ${games.length}`);

    const newGames = games.map((e) => ({
      ...e,
      img_custom: oldGameMap[e.id]?.img_custom || null,
      isDeleted: oldGameMap[e.id]?.isDeleted || false,
    }));

    const customGameCategories = oldCustomGameCategories.filter(
      (c) => !!games.find((g) => g.id === c.gameId),
    );

    const favorites = oldFavorites.filter(
      (c) => !!games.find((g) => g.id === c.gameId),
    );

    const recent = oldRecent.filter(
      (c) => !!games.find((g) => g.id === c.gameId),
    );

    const newProviders = providers.map((e) => ({
      provider: e,
      added_slot: !!oldProviderMap[e]?.added_slot,
      count: games.filter((g) => g.gameProvider === e).length,
      order: oldProviderMap[e]?.order || 1000,
    }));

    await this.prisma.$transaction(async (prismaClient) => {
      await prismaClient.customGameCategory.deleteMany();
      await prismaClient.favoriteGame.deleteMany();
      await prismaClient.recentGame.deleteMany();
      await prismaClient.gR8Game.deleteMany();
      await prismaClient.gR8Provider.deleteMany();

      await prismaClient.gR8Provider.createMany({
        data: newProviders,
      });

      await prismaClient.gR8Game.createMany({
        data: newGames,
      });

      await prismaClient.customGameCategory.createMany({
        data: customGameCategories,
      });

      await prismaClient.favoriteGame.createMany({
        data: favorites,
      });

      await prismaClient.recentGame.createMany({
        data: recent,
      });
    });

    return {
      status: true,
    };
  }

  async updateOrder(customCategoryId: number, data: UpdateOrderDto) {
    return this.prisma.customGameCategory.update({
      data: {
        order: data.order,
      },
      where: {
        id: customCategoryId,
      },
    });
  }
}
