import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  GR8Game,
  Prisma,
  Transaction,
  TransactionType,
  User,
  UserActivityType,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { UserActivityService } from 'src/user_activity/user_activity.service';
import { StartGameDto } from './dto/StartGameDto';
import { v4 as uuidv4 } from 'uuid';
import { RecentGameService } from 'src/recent_game/recent_game.service';
import { GenerateSessionDto } from 'src/player/dto/GenerateSessionDto';
import { BetDto } from 'src/transaction/dto/BetDto';
import {
  iframeEndpoints,
  RAKEBACK_HOUSE_PERCENT,
  TransactionPlatform,
} from 'src/utils/constants';
import { Request } from 'express';
import { Base64 } from 'js-base64';
import { PromoWinDto } from 'src/transaction/dto/PromoWinDto';
import { TournamentWinDto } from 'src/transaction/dto/TournamentWinDto';

@Injectable()
export class Gr8CasinoService {
  private readonly logger = new Logger(Gr8CasinoService.name);
  private readonly API_URL: string;
  private readonly LAUNCH_URL: string;
  private readonly PARTNER_KEY: string;
  private readonly CLIENT_ID: string;
  private readonly CLIENT_SECRET: string;
  private readonly USERNAME: string;
  private readonly PASSWORD: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly socketService: SocketGateway,
    private readonly userActivityService: UserActivityService,
    private readonly recentGameService: RecentGameService,
  ) {
    this.API_URL = this.configService.get<string>('GR8_CASINO_API_URL');
    this.LAUNCH_URL = this.configService.get<string>('GR8_CASINO_LAUNCH_URL');
    this.PARTNER_KEY = this.configService.get<string>('GR8_CASINO_PARTNER_KEY');
    this.CLIENT_ID = this.configService.get<string>('GR8_CASINO_CLIENT_ID');
    this.CLIENT_SECRET = this.configService.get<string>(
      'GR8_CASINO_CLIENT_SECRET',
    );
    this.USERNAME = this.configService.get<string>('GR8_CASINO_USERNAME');
    this.PASSWORD = this.configService.get<string>('GR8_CASINO_PASSWORD');
  }

  private async _fetchAccessToken() {
    const myHeaders = new Headers();
    myHeaders.append('X-Partner-Key', this.PARTNER_KEY);
    myHeaders.append('Content-Type', 'application/x-www-form-urlencoded');

    const urlencoded = new URLSearchParams();
    urlencoded.append('grant_type', 'client_credentials');
    urlencoded.append('client_id', this.CLIENT_ID);
    urlencoded.append('client_secret', this.CLIENT_SECRET);

    const requestOptions: RequestInit = {
      method: 'POST',
      headers: myHeaders,
      body: urlencoded,
      redirect: 'follow',
    };

    const response = await fetch(
      `${this.API_URL}/v0/management/token`,
      requestOptions,
    );
    const result = await response.json();
    return result.access_token;
  }

  async fetchGames() {
    const myHeaders = new Headers();
    myHeaders.append('Content-Type', 'application/json');

    const requestOptions: RequestInit = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow',
    };

    const response = await fetch(
      `${iframeEndpoints['origin_name']}/v1/gr8-casino/load-game-data`,
      requestOptions,
    );

    if (response.status === 200) {
      return await response.json();
    }

    throw new BadRequestException(await response.json());
  }

  async findGames(
    keyword: string,
    type: string,
    provider: string,
    offset: number,
    limit: number,
  ) {
    const where: Prisma.GR8GameWhereInput = {};
    if (type) {
      if (type === 'roulette' || type === 'blackjack' || type === 'baccarat') {
        where.id = {
          contains: type,
          mode: 'insensitive',
        };
      } else {
        where.productType = {
          equals: type,
          mode: 'insensitive',
        };
      }
    }

    if (provider) {
      where.gameProvider = {
        equals: provider,
        mode: 'insensitive',
      };
    }

    if (keyword?.trim()) {
      where.translationKey = {
        contains: keyword.toLowerCase().trim(),
        mode: 'insensitive',
      };
    }

    const [total, data] = await Promise.all([
      this.prisma.gR8Game.count({
        where: where,
      }),

      this.prisma.gR8Game.findMany({
        where,
        orderBy: {
          id: 'asc',
        },
        skip: offset > 0 ? offset : 0,
        take: limit > 0 ? limit : 20,
      }),
    ]);

    const seenNames = new Set();
    const uniqueByName = data.filter((item) => {
      if (seenNames.has(item.translationKey)) {
        return false;
      } else {
        seenNames.add(item.translationKey);
        return true;
      }
    });

    return {
      total,
      data: uniqueByName,
    };
  }

  async fetchCustomGames(category: string, offset: number, limit: number) {
    const where = category ? { category } : {};

    const [total, data] = await Promise.all([
      this.prisma.customGameCategory.count({
        where,
      }),
      this.prisma.customGameCategory.findMany({
        where,
        include: { GR8Game: true },
        orderBy: [{ order: 'asc' }, { id: 'asc' }],
        skip: offset > 0 ? offset : 0,
        take: limit > 0 ? limit : 20,
      }),
    ]);

    return {
      total,
      data,
    };
  }

  async fetchProviders() {
    this.logger.debug('Getting providers ...');

    try {
      const providers = await this.prisma.gR8Provider.findMany({
        orderBy: [
          {
            order: 'asc',
          },
          {
            provider: 'asc',
          },
        ],
      });

      return providers;
    } catch (ex) {
      this.logger.error(ex);
    }
  }

  async fetchGameById(id: string) {
    return this.prisma.gR8Game.findUniqueOrThrow({
      where: { id },
    });
  }

  async startGame(user: User, data: StartGameDto, ip: string) {
    this.logger.debug(`Start game`);

    const game = await this.prisma.gR8Game.findUniqueOrThrow({
      where: { id: data.gameId },
    });

    const token = this._generateSessionToken({
      userId: user.id,
      tokenName: data.tokenName,
    });

    this.logger.debug(`token: ${token}`);

    await this.recentGameService.addToRecent(user.id, data.gameId);
    await this.userActivityService.addActivity({
      userId: user.id,
      ip: ip,
      type: UserActivityType.PLAYGAME,
      gameId: game.id,
      gameName: game.translationKey,
      provider: game.gameProvider,
    });

    return token;
  }

  async getPlayerFromId(playerId: string, providerId: string, req: Request) {
    this.logger.debug('getPlayerFromId');
    this._checkHeader(req);

    const user = await this.prisma.user.findUnique({
      where: {
        id: playerId,
      },
    });

    if (!user) {
      throw new HttpException(
        {
          at: new Date().toISOString(),
          errorCode: 'error.player.not-found',
          message: 'error.player.not-found',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }

    return {
      country: 'DE',
      currency: 'USD',
      displayName: user.userName,
      playerId: user.id,
    };
  }

  async getPlayerFromSession(
    sessionToken: string,
    providerId: string,
    req: Request,
  ) {
    this.logger.debug('getPlayerFromSession');
    this._checkHeader(req);

    try {
      const token = this._decodeSesionToken(sessionToken);
      const user = await this.prisma.user.findUnique({
        where: {
          id: token.userId,
        },
      });

      return {
        balance: {
          bonus: 0,
          locked: 0,
          main: Math.floor(user['cash_' + token.tokenName] * 100),
        },
        country: 'DE',
        currency: 'USD',
        displayName: user.userName,
        playerId: user.id,
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          at: new Date().toISOString(),
          errorCode: 'error.player.not-found',
          message: 'error.player.not-found',
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async generateSession(
    providerId: string,
    body: GenerateSessionDto,
    req: Request,
  ) {
    this.logger.debug('generateSession');
    this._checkHeader(req);

    const token = this._generateSessionToken({
      userId: body.playerId,
      tokenName: '0',
    });

    this.logger.debug(token);
    return {
      sessionToken: token,
    };
  }

  async bet(
    betType: 'bet' | 'win' | 'refund' | 'promo_win' | 'tournament_win',
    body: BetDto,
    req: Request,
  ) {
    this.logger.debug('bet ' + betType);
    this.logger.debug(body);
    this._checkHeader(req);

    try {
      let tokenName = '0';
      if (betType === 'bet') {
        const {
          userId,
          tokenName: tokenName1,
          expiredAt,
        } = this._decodeSesionToken(body.sessionToken);

        this.logger.debug(userId);
        this.logger.debug(tokenName1);
        tokenName = tokenName1;
        if (tokenName === 'USD') {
          tokenName = '0';
        }

        if (userId !== body.playerId) {
          throw new HttpException(
            {
              at: new Date().toISOString(),
              errorCode: 'error.player.session-expired',
              message: 'error.player.session-expired',
            },
            HttpStatus.UNPROCESSABLE_ENTITY,
          );
        }
      }

      const userId = body.playerId;
      const user1 = await this.prisma.user.findUnique({
        omit: {
          btcPk: true,
          ethPk: true,
          solanaPk: true,
          ltcPk: true,
          password: true,
        },
        where: {
          id: userId,
        },
      });

      if (!user1) {
        this.logger.error('player not found in bet transaction');
        throw new HttpException(
          {
            at: new Date().toISOString(),
            errorCode: 'error.player.not-found',
            message: 'error.player.not-found',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      const vipRecord = await this.prisma.vIPLevel.findUnique({
        where: {
          id: user1.vipLevel,
        },
      });

      let betTx: Transaction | null = null;
      if (betType === 'refund' || betType === 'win') {
        if (betType === 'refund') {
          betTx = await this.prisma.transaction.findFirst({
            where: {
              type: TransactionType.bet,
              txHash: body.betTxId,
            },
          });

          if (!betTx) {
            throw new HttpException(
              {
                at: new Date().toISOString(),
                errorCode: 'error.transaction.target-tx-not-found',
                message: 'BetTx does not exist',
              },
              422,
            );
          }

          const winTx = await this.prisma.transaction.findFirst({
            where: {
              type: TransactionType.win,
              gameId: body.gameId,
              userId: body.playerId,
              eventId: body.roundId,
              provider: body.provider,
            },
          });

          if (winTx) {
            throw new HttpException(
              {
                at: new Date().toISOString(),
                errorCode: 'error.transaction.casino-logic-validation-failed',
                message: 'Win Transaction already exists',
              },
              422,
            );
          }
        } else if (betType === 'win') {
          betTx = await this.prisma.transaction.findFirst({
            where: {
              type: TransactionType.bet,
              gameId: body.gameId,
              userId: body.playerId,
              eventId: body.roundId,
              provider: body.provider,
            },
          });

          const refundTx = await this.prisma.transaction.findFirst({
            where: {
              type: TransactionType.refund,
              gameId: body.gameId,
              userId: body.playerId,
              eventId: body.roundId,
              provider: body.provider,
            },
          });

          if (refundTx) {
            throw new HttpException(
              {
                at: new Date().toISOString(),
                errorCode: 'error.transaction.casino-logic-validation-failed',
                message: 'refundTx already exists',
              },
              422,
            );
          }
        }

        tokenName = betTx?.tokenName || '0';
      }

      const userCash = user1['cash_' + tokenName];
      this.logger.debug(userCash);

      if (betType === 'bet' && userCash < body.amount / 100) {
        throw new HttpException(
          {
            at: new Date().toISOString(),
            errorCode: 'error.player.insufficient-balance',
            message: 'error.player.insufficient-balance',
          },
          HttpStatus.UNPROCESSABLE_ENTITY,
        );
      }

      // check currency type
      if (body.currency.toLowerCase() !== 'usd') {
        throw new HttpException(
          {
            at: new Date().toISOString(),
            errorCode: 'error.player.incorrect-currency',
            message: 'Currency is not USD',
          },
          422,
        );
      }

      // check provider
      const existProvider = await this.prisma.gR8Provider.findFirst({
        where: {
          provider: body.provider,
        },
      });
      if (!existProvider) {
        throw new HttpException(
          {
            at: new Date().toISOString(),
            errorCode: 'error.request.validation-failed',
            message: 'Provider does not exist: ' + body.provider,
          },
          400,
        );
      }

      // check duplicating tx
      const txHash = betType === 'refund' ? body.refundTxId : body.txId;
      const duplicateTx = await this.prisma.transaction.findFirst({
        where: {
          provider: body.provider,
          gameId: body.gameId,
          userId: body.playerId,
          txHash: txHash,
        },
      });
      if (duplicateTx) {
        return {
          at: new Date().toISOString(),
          balance: {
            bonus: 0,
            locked: 0,
            main: Math.floor(user1['cash_' + tokenName] * 100),
          },
          currency: 'USD',
          tx: {
            at: duplicateTx.createdAt.toISOString(),
            id: txHash,
            processed: true,
            processedTxId: duplicateTx.id,
            txAmountDetails: {
              bonus: 0,
              locked: 0,
              main: Math.floor(duplicateTx.cash * 100),
            },
          },
        };
      }

      const game = await this.prisma.gR8Game.findFirst({
        where: {
          gameProvider: body.provider,
          walletId: body.gameId,
        },
      });

      const { tx, user } = await this.prisma.$transaction(
        async (prismaClient) => {
          const io = betType === 'bet' ? -1 : 1;
          let cashChange = 0;

          const txId = uuidv4();
          const data1: Prisma.TransactionUncheckedCreateInput = {
            id: txId,
            cash: betType === 'refund' ? betTx.cash : +body.amount / 100,
            bonus: 0,
            locked: 0,
            io,
            type: betType,
            platform: TransactionPlatform.Gr8Casino,
            context: {
              sideSplit: body.sideSplit,
              game: {
                walletId: body.gameId,
                id: game?.id,
                name: game?.translationKey,
              },
            },
            initiatedAt: new Date(),
            createdAt: new Date(),
            userId: body.playerId,
            chainId: 0,
            tokenAmount: 0,
            isDeleted: 0,
            gameId: body.gameId,
            txHash: txHash,
            tokenName: tokenName,
            provider: body.provider,
            eventId: body.roundId,
            eventType: body.reason,
          };

          const tx = await prismaClient.transaction.create({
            data: {
              ...data1,
              id: txId,
              io,
            },
          });
          cashChange += tx.io * tx.cash;

          let txRakeback;
          if (betType === 'bet') {
            const rakebackAmount =
              (+body.amount * vipRecord.rakeback * RAKEBACK_HOUSE_PERCENT) /
              10000;
            if (rakebackAmount > 0) {
              const txIdRakeback = uuidv4();
              txRakeback = await prismaClient.transaction.create({
                data: {
                  ...data1,
                  id: txIdRakeback,
                  cash:
                    (+body.amount *
                      vipRecord.rakeback *
                      RAKEBACK_HOUSE_PERCENT) /
                    10000,
                  io: 1,
                  type: TransactionType.deposit,
                  platform: TransactionPlatform.Rakeback,
                },
              });
              cashChange += txRakeback.cash;
            }
          } else if (betType === 'refund') {
            txRakeback = await prismaClient.transaction.findFirst({
              where: {
                txHash: betTx.id,
                io: 1,
                type: TransactionType.deposit,
                platform: TransactionPlatform.Rakeback,
              },
            });

            if (txRakeback) {
              cashChange -= txRakeback.cash;
              await prismaClient.transaction.delete({
                where: { id: txRakeback.id },
              });
            }
          }

          const user = await prismaClient.user.update({
            omit: {
              btcPk: true,
              ethPk: true,
              solanaPk: true,
              ltcPk: true,
              subscription: true,
              password: true,
            },
            data: {
              cash: {
                increment: cashChange,
              },
              ['cash_' + tokenName]: {
                increment: cashChange,
              },
            },
            where: {
              id: body.playerId,
            },
          });

          return { tx, user };
        },
      );

      this.socketService.sendBalanceUpdated(user.id, user);

      return {
        at: tx.createdAt.toISOString(),
        balance: {
          bonus: 0,
          locked: 0,
          main: Math.floor(user['cash_' + tokenName] * 100),
        },
        currency: 'USD',
        tx: {
          at: tx.createdAt.toISOString(),
          id: txHash,
          processed: false,
          processedTxId: tx.id,
          txAmountDetails: {
            bonus: 0,
            locked: 0,
            main: Math.floor(tx.cash * 100),
          },
        },
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        {
          at: new Date().toISOString(),
          errorCode: 'error.system.unexpected',
          message: 'error.system.unexpected',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async promoWin(body: PromoWinDto, req: Request) {
    this.logger.debug('promoWin');
    this.logger.debug(body);
    this._checkHeader(req);

    // try {
    //   let tokenName = '0';
    //   const userId = body.playerId;
    //   const user1 = await this.prisma.user.findUnique({
    //     omit: {
    //       btcPk: true,
    //       ethPk: true,
    //       solanaPk: true,
    //       ltcPk: true,
    //       password: true,
    //     },
    //     where: {
    //       id: userId,
    //     },
    //   });

    //   if (!user1) {
    //     this.logger.error('player not found in bet transaction');
    //     throw new HttpException(
    //       {
    //         at: new Date().toISOString(),
    //         errorCode: 'error.player.not-found',
    //         message: 'error.player.not-found',
    //       },
    //       HttpStatus.UNPROCESSABLE_ENTITY,
    //     );
    //   }

    //   const userCash = user1['cash_' + tokenName];
    //   this.logger.debug(userCash);

    //   // check currency type
    //   if (body.currency !== 'USD') {
    //     throw new HttpException(
    //       {
    //         at: new Date().toISOString(),
    //         errorCode: 'error.player.incorrect-currency',
    //         message: 'error.player.incorrect-currency',
    //       },
    //       422,
    //     );
    //   }

    //   // check provider
    //   const existProvider = await this.prisma.gR8Provider.findFirst({
    //     where: {
    //       provider: body.provider,
    //     },
    //   });
    //   if (!existProvider) {
    //     throw new HttpException(
    //       {
    //         at: new Date().toISOString(),
    //         errorCode: 'error.request.validation-failed',
    //         message: 'Provider does not exist: ' + body.provider,
    //       },
    //       400,
    //     );
    //   }

    //   // check duplicating tx
    //   const txHash = body.txId;
    //   const duplicateTx = await this.prisma.transaction.findFirst({
    //     where: {
    //       txHash: txHash,
    //       type: TransactionType.promo_win,
    //       userId: body.playerId,
    //       provider: body.provider,
    //     },
    //   });
    //   if (duplicateTx) {
    //     return {
    //       at: duplicateTx.createdAt.toISOString(),
    //       balance: {
    //         bonus: 0,
    //         locked: 0,
    //         main: Math.floor(user1['cash_' + tokenName] * 100),
    //       },
    //       currency: 'USD',
    //       tx: {
    //         at: duplicateTx.createdAt.toISOString(),
    //         id: body.txId,
    //         processed: true,
    //         processedTxId: duplicateTx.id,
    //         txAmountDetails: {
    //           bonus: 0,
    //           locked: 0,
    //           main: Math.floor(duplicateTx.cash * 100),
    //         },
    //       },
    //     };
    //   }

    //   const { tx, user } = await this.prisma.$transaction(
    //     async (prismaClient) => {
    //       let cashChange = 0;

    //       const txId = uuidv4();
    //       const data1: Prisma.TransactionUncheckedCreateInput = {
    //         id: txId,
    //         cash: +body.amount / 100,
    //         bonus: 0,
    //         locked: 0,
    //         io: 1,
    //         type: TransactionType.promo_win,
    //         platform: TransactionPlatform.Gr8Casino,
    //         initiatedAt: new Date(),
    //         createdAt: new Date(),
    //         userId: body.playerId,
    //         chainId: 0,
    //         tokenAmount: 0,
    //         isDeleted: 0,
    //         gameId: null,
    //         txHash: txHash,
    //         tokenName: tokenName,
    //         provider: body.provider,
    //         eventType: body.reason,
    //       };

    //       const tx = await prismaClient.transaction.create({
    //         data: {
    //           ...data1,
    //           id: txId,
    //           cash: +body.amount / 100,
    //           io: 1,
    //         },
    //       });
    //       cashChange += tx.io * tx.cash;

    //       const user = await this.prisma.user.update({
    //         omit: {
    //           btcPk: true,
    //           ethPk: true,
    //           solanaPk: true,
    //           ltcPk: true,
    //           subscription: true,
    //           password: true,
    //         },
    //         data: {
    //           cash: {
    //             increment: cashChange,
    //           },
    //           ['cash_' + tokenName]: {
    //             increment: cashChange,
    //           },
    //         },
    //         where: {
    //           id: body.playerId,
    //         },
    //       });

    //       return { tx, user };
    //     },
    //   );

    //   this.socketService.sendBalanceUpdated(user.id, user);

    //   return {
    //     at: tx.createdAt.toISOString(),
    //     balance: {
    //       bonus: 0,
    //       locked: 0,
    //       main: Math.floor(user['cash_' + tokenName] * 100),
    //     },
    //     currency: 'USD',
    //     tx: {
    //       at: tx.createdAt.toISOString(),
    //       id: body.txId,
    //       processed: false,
    //       processedTxId: tx.id,
    //       txAmountDetails: {
    //         bonus: 0,
    //         locked: 0,
    //         main: Math.floor(tx.cash * 100),
    //       },
    //     },
    //   };
    // } catch (error) {
    //   this.logger.error(error);
    //   if (error instanceof HttpException) {
    //     throw error;
    //   }

    //   throw new HttpException(
    //     {
    //       at: new Date().toISOString(),
    //       errorCode: 'error.system.unexpected',
    //       message: 'error.system.unexpected',
    //     },
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  async tournamentWin(body: TournamentWinDto, req: Request) {
    this.logger.debug('tournamentWin');
    this.logger.debug(body);
    this._checkHeader(req);

    this.logger.debug('promoWin');
    this.logger.debug(body);
    this._checkHeader(req);

    // try {
    //   let tokenName = '0';
    //   const userId = body.playerId;
    //   const user1 = await this.prisma.user.findUnique({
    //     omit: {
    //       btcPk: true,
    //       ethPk: true,
    //       solanaPk: true,
    //       ltcPk: true,
    //       password: true,
    //     },
    //     where: {
    //       id: userId,
    //     },
    //   });

    //   if (!user1) {
    //     this.logger.error('player not found in bet transaction');
    //     throw new HttpException(
    //       {
    //         at: new Date().toISOString(),
    //         errorCode: 'error.player.not-found',
    //         message: 'error.player.not-found',
    //       },
    //       HttpStatus.UNPROCESSABLE_ENTITY,
    //     );
    //   }

    //   const userCash = user1['cash_' + tokenName];
    //   this.logger.debug(userCash);

    //   // check currency type
    //   if (body.currency !== 'USD') {
    //     throw new HttpException(
    //       {
    //         at: new Date().toISOString(),
    //         errorCode: 'error.player.incorrect-currency',
    //         message: 'error.player.incorrect-currency',
    //       },
    //       422,
    //     );
    //   }

    //   // check provider
    //   const existProvider = await this.prisma.gR8Provider.findFirst({
    //     where: {
    //       provider: body.provider,
    //     },
    //   });
    //   if (!existProvider) {
    //     throw new HttpException(
    //       {
    //         at: new Date().toISOString(),
    //         errorCode: 'error.request.validation-failed',
    //         message: 'Provider does not exist: ' + body.provider,
    //       },
    //       400,
    //     );
    //   }

    //   // check duplicating tx
    //   const txHash = body.txId;
    //   const duplicateTx = await this.prisma.transaction.findFirst({
    //     where: {
    //       txHash: txHash,
    //       provider: body.provider,
    //       userId: body.playerId,
    //       type: TransactionType.tournament_win,
    //     },
    //   });
    //   if (duplicateTx) {
    //     return {
    //       at: duplicateTx.createdAt.toISOString(),
    //       balance: {
    //         bonus: 0,
    //         locked: 0,
    //         main: Math.floor(user1['cash_' + tokenName] * 100),
    //       },
    //       currency: 'USD',
    //       tx: {
    //         at: duplicateTx.createdAt.toISOString(),
    //         id: body.txId,
    //         processed: true,
    //         processedTxId: duplicateTx.id,
    //         txAmountDetails: {
    //           bonus: 0,
    //           locked: 0,
    //           main: Math.floor(duplicateTx.cash * 100),
    //         },
    //       },
    //     };
    //   }

    //   const { tx, user } = await this.prisma.$transaction(
    //     async (prismaClient) => {
    //       let cashChange = 0;

    //       const txId = uuidv4();
    //       const data1: Prisma.TransactionUncheckedCreateInput = {
    //         id: txId,
    //         cash: +body.amount / 100,
    //         bonus: 0,
    //         locked: 0,
    //         io: 1,
    //         type: TransactionType.tournament_win,
    //         platform: TransactionPlatform.Gr8Casino,
    //         context: {
    //           tournamentId: body.tournamentId,
    //         },
    //         initiatedAt: new Date(),
    //         createdAt: new Date(),
    //         userId: body.playerId,
    //         chainId: 0,
    //         tokenAmount: 0,
    //         isDeleted: 0,
    //         gameId: null,
    //         txHash: txHash,
    //         tokenName: tokenName,
    //         provider: body.provider,
    //         eventType: body.reason,
    //       };

    //       const tx = await prismaClient.transaction.create({
    //         data: {
    //           ...data1,
    //           id: txId,
    //           cash: +body.amount / 100,
    //           io: 1,
    //         },
    //       });
    //       cashChange += tx.io * tx.cash;
    //       this.logger.debug(cashChange);

    //       const user = await this.prisma.user.update({
    //         omit: {
    //           btcPk: true,
    //           ethPk: true,
    //           solanaPk: true,
    //           ltcPk: true,
    //           subscription: true,
    //           password: true,
    //         },
    //         data: {
    //           cash: {
    //             increment: cashChange,
    //           },
    //           ['cash_' + tokenName]: {
    //             increment: cashChange,
    //           },
    //         },
    //         where: {
    //           id: body.playerId,
    //         },
    //       });

    //       return { tx, user };
    //     },
    //   );

    //   this.socketService.sendBalanceUpdated(user.id, user);

    //   return {
    //     at: tx.createdAt.toISOString(),
    //     balance: {
    //       bonus: 0,
    //       locked: 0,
    //       main: Math.floor(user['cash_' + tokenName] * 100),
    //     },
    //     currency: 'USD',
    //     tx: {
    //       at: tx.createdAt.toISOString(),
    //       id: body.txId,
    //       processed: false,
    //       processedTxId: tx.id,
    //       txAmountDetails: {
    //         bonus: 0,
    //         locked: 0,
    //         main: Math.floor(tx.cash * 100),
    //       },
    //     },
    //   };
    // } catch (error) {
    //   this.logger.error(error);
    //   if (error instanceof HttpException) {
    //     throw error;
    //   }

    //   throw new HttpException(
    //     {
    //       at: new Date().toISOString(),
    //       errorCode: 'error.system.unexpected',
    //       message: 'error.system.unexpected',
    //     },
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  private _encrypt(str: string) {
    this.logger.debug('_encrypt ' + str);
    let res = str.substring(6) + str.substring(0, 6);
    return res.replaceAll('0', 'Z').replaceAll('1', 'X').replaceAll('2', 'W');
  }

  private _decrypt(str: string) {
    this.logger.debug('_decrypt ' + str);
    let res = str
      .replaceAll('Z', '0')
      .replaceAll('X', '1')
      .replaceAll('W', '2');
    return res.substring(res.length - 6) + res.substring(0, res.length - 6);
  }

  private _generateSessionToken(data: { userId: string; tokenName: string }) {
    return this._encrypt(
      `${data.userId}__${data.tokenName}__${Math.round(new Date().getTime() / 1000) + 7200}`,
    );
  }

  private _decodeSesionToken(token: string) {
    this.logger.debug('_decodeSesionToken ' + token);
    const str = this._decrypt(token);
    const temp = str.split('__');
    return {
      userId: temp[0],
      tokenName: temp[1],
      expiredAt: +temp[2],
    };
  }

  private _checkHeader(req: Request) {
    const partnerKey = (req.headers['x-partner-key'] as string) || '';
    const authHeader = (req.headers['authorization'] as string) || '';

    if (partnerKey !== this.PARTNER_KEY) {
      throw new UnauthorizedException();
    }

    if (!authHeader || !authHeader.startsWith('Basic ')) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    const encodedValue = authHeader.split(' ')[1];

    try {
      // Decode and split username:password
      const decodedValue = Base64.decode(encodedValue);
      const [username, password] = decodedValue.split(':');

      if (username === this.USERNAME && password === this.PASSWORD) {
        return true;
      } else {
        throw new UnauthorizedException('Invalid credentials');
      }
    } catch (error) {
      throw new UnauthorizedException('Invalid Authorization format');
    }
  }
}

type tFetchGameListResponse = {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  items: {
    gameId: string;
    walletId: string;
    productType: string;
    translationKey: string;
    gameProvider: string;
    channel: string;
    dealerLanguage: string;
    imageUrl: string;
    isDemoModeAvailable: boolean;
    isFreeSpinsAvailable: boolean;
    isActive: boolean;
  }[];
};
