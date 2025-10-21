import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { TransactionDto } from './dto/TransactionDto';
import {
  Prisma,
  Transaction,
  TransactionCurrency,
  TransactionType,
  User,
  UserActivityType,
} from '@prisma/client';
import { SocketGateway } from 'src/socket/socket.gateway';
import { InstantDepositDto } from './dto/InstantDepositDto';
import { verifyTypedData } from 'viem';

import { ethSignatureTypes } from './data';
import { BlockchainService } from 'src/blockchain/blockchain.service';
import { v4 as uuidv4 } from 'uuid';
import { numberRound } from 'src/utils/numberRound';
import { LazyWithdrawDto } from './dto/LazyWithdrawDto';
import { LazyDepositDto } from './dto/LazyDepositDto';
import {
  RAKEBACK_HOUSE_PERCENT,
  supportingChainIds,
  supportingTokenFields,
  TransactionPlatform,
} from 'src/utils/constants';
import { WalletBackgroundService } from './wallet.background.service';
import { TokenPriceService } from 'src/token_price/token_price.service';
import { TotalStatisticsDto } from './dto/TotalStatisticsDto';
import { PushService } from 'src/push/push.service';
import { MailService } from 'src/mail/mail.service';
import {
  BITCOIN_CHAIN_ID,
  chainIds,
  SOLANA_CHAIN_ID,
} from 'src/blockchain/constants';
import { transactionLink } from 'src/utils/transactionLink';
import { TransferBalanceDto } from './dto/TransferBalanceDto';
import { Request } from 'express';
import { UserActivityService } from 'src/user_activity/user_activity.service';
import * as ip3country from 'ip3country';
import { ConvertBalanceDto } from './dto/ConvertBalanceDto';
import { CheckBalanceDto } from './dto/CheckBalanceDto';
import { tSummarizedTransaction } from 'src/types/tSummarizedTransaction';

const originName = 'origin_name';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketGateway,
    private readonly blockchainService: BlockchainService,
    private readonly configService: ConfigService,
    private readonly tokenPriceService: TokenPriceService,
    private readonly pushService: PushService,
    private readonly mailService: MailService,
    private readonly walletBackgroundService: WalletBackgroundService,
    private readonly userActivityService: UserActivityService,
  ) {}

  async _getUserBalance(
    brand: string,
    operatorId: string,
    userId: string,
    currencies: string,
  ) {
    const user = await this.prisma.user.findUniqueOrThrow({
      select: {
        cash: true,
        bonus: true,
        locked: true,
      },
      where: { id: userId },
    });
    return {
      sport: {
        sportsbook: {
          USD: {
            cash: numberRound(user.cash),
            bonus: 0, // user.bonus,
            locked: 0, // user.locked,
          },
        },
      },
    };
  }

  async getUserBalance(
    brand: string,
    operatorId: string,
    userId: string,
    currencies: string,
  ) {
    this.logger.debug('Requested user balance: ' + userId);
    try {
      const res = await this._getUserBalance(
        brand,
        operatorId,
        userId,
        currencies,
      );
      return res;
    } catch (ex) {
      this.logger.error('error.user.not-found');
      throw new HttpException(
        {
          error: {
            code: 'error.user.not-found',
            message: 'User with specified Id was not found',
            origin: originName,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async performTransaction(
    brand: string,
    operatorId: string,
    userId: string,
    data: TransactionDto,
  ) {
    this.logger.debug(`Requested perform transaction: ${userId}`);
    this.logger.debug(data);

    const user1 = await this.prisma.user.findUniqueOrThrow({
      omit: {
        ethPk: true,
        btcPk: true,
        ltcPk: true,
        solanaPk: true,
        password: true,
        subscription: true,
      },
      where: { id: userId },
    });

    const balances = {
      sport: {
        sportsbook: {
          USD: {
            cash: numberRound(user1.cash),
            bonus: 0, // user.bonus,
            locked: 0, // user.locked,
          },
        },
      },
    };

    const vipRecord = await this.prisma.vIPLevel.findUnique({
      where: {
        id: user1.vipLevel,
      },
    });

    // check if the transaction has been already processed
    this.logger.debug(
      'Checking if the transaction has been already processed ...',
    );
    const existingTx = await this.prisma.transaction.findUnique({
      where: { id: data.id },
    });

    if (existingTx) {
      this.logger.debug('Transaction has been already processed ...');
      return this._convertTransactionFormat(existingTx, balances, true);
    }

    let io = 0;
    if (data.type === 'withdrawal') {
      io = -1;
    } else if (data.type === 'deposit') {
      io = 1;
    }

    // rollback logic
    if (data.type === 'rollback') {
      const parentId = data.context.parentId;
      if (!parentId) {
        this.logger.error('ParentId was not provided');
        throw new HttpException(
          {
            error: {
              code: 'decline.parent.notfound',
              message: 'ROLLBACK_NO_BET_FOUND - Transaction not found',
              origin: originName,
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      const parentTx = await this.prisma.transaction.findUnique({
        where: { id: parentId },
      });

      if (!parentTx) {
        this.logger.error('Parent transaction was not found');
        throw new HttpException(
          {
            error: {
              code: 'decline.parent.notfound',
              message: 'ROLLBACK_NO_BET_FOUND - Transaction not found',
              origin: originName,
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }

      io = -parentTx.io;
    }

    // balance checking
    const keys = ['cash', 'bonus', 'locked'];
    for (let key of keys) {
      if (
        balances.sport.sportsbook.USD[key] +
          (data.amountBreakdown[key] ?? 0) * io <
        0
      ) {
        this.logger.error('Low balance ' + key);
        throw new HttpException(
          {
            error: {
              code: 'decline.lowbalance',
              message: 'Not enough fund for performing transaction',
              origin: originName,
            },
          },
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    try {
      const { tx, newUser } = await this.prisma.$transaction(
        async (prismaClient) => {
          this.logger.debug('Storing transaction ... ' + userId);

          let betId;
          try {
            betId = data.context?.betId;
          } catch (ex1) {}

          const data1: Prisma.TransactionUncheckedCreateInput = {
            id: data.id,
            cash: numberRound(+(data.amountBreakdown.cash ?? 0)),
            bonus: numberRound(+(data.amountBreakdown.bonus ?? 0)),
            locked: numberRound(+(data.amountBreakdown.locked ?? 0)),
            io,
            type: data.type,
            platform: data.platform,
            currency: data.currency as TransactionCurrency,
            initiatedAt: new Date(data.initiatedAt),
            createdAt: new Date(data.createdAt),
            context: data.context,
            userId,
            chainId: 0,
            tokenAddress: null,
            tokenAmount: 0,
            isDeleted: 0,
            eventId: betId || null,
            gameId: null,
            note: null,
          };

          const tx = await prismaClient.transaction.create({
            data: {
              ...data1,
            },
          });

          // rakeback
          let txRakeback;
          if (io === -1) {
            const txIdRakeback = uuidv4();
            txRakeback = await prismaClient.transaction.create({
              data: {
                ...data1,
                id: txIdRakeback,
                cash:
                  (+(data.amountBreakdown.cash ?? 0) *
                    vipRecord.rakeback *
                    RAKEBACK_HOUSE_PERCENT) /
                  100,
                io: 1,
                type: TransactionType.deposit,
                platform: TransactionPlatform.Rakeback,
              },
            });
          }

          this.logger.debug('Stored transaction. Updating user balance ...');
          const user3 = await prismaClient.user.findUnique({
            where: {
              id: userId,
            },
          });

          const amount1 =
            +(data.amountBreakdown.cash ?? 0) * io + (txRakeback?.cash || 0);
          const updatingFields: any = {};
          if (amount1 < 0) {
            let amount = -amount1;
            const temp = [...supportingTokenFields, '0'];
            for (let i = 0; i < temp.length; i++) {
              const iTokenName = temp[i];
              if (amount <= user3['cash_' + iTokenName]) {
                updatingFields['cash_' + iTokenName] = {
                  increment: -amount,
                };
                break;
              }

              amount -= user3['cash_' + iTokenName];
              updatingFields['cash_' + iTokenName] = {
                increment: -user3['cash_' + iTokenName],
              };
            }
          } else {
            updatingFields['cash_900'] = {
              increment: amount1,
            };
          }

          this.logger.debug(updatingFields);

          const newUser = await prismaClient.user.update({
            omit: {
              btcPk: true,
              solanaPk: true,
              ethPk: true,
              ltcPk: true,
              password: true,
              subscription: true,
            },
            where: {
              id: userId,
            },
            data: {
              cash: {
                increment: amount1,
              },
              ...updatingFields,
            },
          });

          return { tx, newUser };
        },
      );

      this.logger.debug('Getting new balance ...');
      const balances1 = {
        sport: {
          sportsbook: {
            USD: {
              cash: numberRound(newUser.cash),
              bonus: 0, // newUser.bonus,
              locked: 0, // newUser.locked,
            },
          },
        },
      };

      this.logger.debug('Sending balance updated events ...');
      this.socketService.sendBalanceUpdated(userId, newUser);

      this.logger.debug('Done! Sending response ...');
      const txRes = this._convertTransactionFormat(tx, balances1, false);
      delete txRes.status;
      txRes.context = data.context;
      return txRes;
    } catch (ex) {
      this.logger.error(ex);
      throw new HttpException(
        {
          error: {
            code: 'error.general',
            message: 'Unknown error',
            origin: originName,
          },
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async getTransactionById(
    brand: string,
    operatorId: string,
    userId: string,
    transactionId: string,
  ) {
    this.logger.debug(
      `Requested transaction, userId:${userId}, transactionId: ${transactionId}`,
    );

    const balances = await this._getUserBalance(
      brand,
      operatorId,
      userId,
      'USD',
    );

    const tx = await this.prisma.transaction.findMany({
      where: { id: transactionId, userId },
    });

    if (tx.length === 0) {
      this.logger.debug('No transaction');
      throw new HttpException('', HttpStatus.NO_CONTENT);
    }

    return this._convertTransactionFormat(tx[0], balances, true);
  }

  _convertTransactionFormat(
    tx: Transaction,
    balances,
    alreadyProcessed: boolean,
  ) {
    return {
      currency: tx.currency,
      platform: tx.platform,
      id: tx.id,
      type: tx.type,
      initiatedAt: tx.initiatedAt.toISOString(),
      createdAt: tx.createdAt.toISOString(),
      context: tx.context,
      amountBreakdown: {
        cash: tx.cash,
        bonus: tx.bonus,
        locked: tx.locked,
      },
      balances: balances,
      status: 'success',
      alreadyProcessed,
    };
  }

  async instantDeposit(user: User, data: InstantDepositDto) {
    try {
      if (!supportingChainIds.includes(data.chainId)) {
        throw new BadRequestException('Invalid token');
      }

      if (data.tokenAddress !== '0x') {
        throw new BadRequestException('Invalid token');
      }

      await this.verifySignature(user, data);

      const dbToken = await this.prisma.tokenPrice.findFirst({
        where: {
          chainId: data.chainId,
          tokenAddress: data.tokenAddress,
        },
      });
      const tokenPrice = await this.tokenPriceService.getTokenPrice(
        data.chainId,
        data.tokenAddress,
      );
      this.logger.debug('tokenPrice: ', tokenPrice);

      if (data.chainId === BITCOIN_CHAIN_ID) {
        // ignore
      } else if (data.chainId === SOLANA_CHAIN_ID) {
        const txDetails =
          await this.blockchainService.getSolanaTransactionDetails(
            data.transactionHash,
          );
        this.logger.debug('txDetails', txDetails);

        if (
          data.tokenAddress !== txDetails.tokenAddress ||
          data.tokenAmount !== txDetails.tokenAmount ||
          data.address !== txDetails.sender ||
          txDetails.receiver !==
            this.configService.get<string>('ADMIN_SOL_WALLET')
        ) {
          throw new BadRequestException('Transaction invalid');
        }
      } else {
        const token = await this.blockchainService.getEthereumTransaction(
          data.chainId,
          data.transactionHash,
        );

        this.logger.debug(token);

        if (token.from.toLowerCase() !== data.address.toLowerCase()) {
          this.logger.error(
            'Transaction sender and request address are not matched',
          );
          throw new BadRequestException(
            'Transaction sender and request address are not matched',
          );
        }

        if (token.address.toLowerCase() !== data.tokenAddress.toLowerCase()) {
          this.logger.error('Token address does not match');
          throw new BadRequestException('Token address does not match');
        }

        if (
          token.to.toLowerCase() !==
          this.configService.get<string>('ADMIN_ETH_WALLET').toLowerCase()
        ) {
          this.logger.error('To address is not admin address');
          throw new BadRequestException('To address is not admin address');
        }

        // Check if the transaction is transfer tx
        if (token.amount !== data.tokenAmount) {
          this.logger.error('Token amount does not match');
          throw new BadRequestException('Token amount does not match');
        }
      }

      const usd = Math.round(tokenPrice * data.tokenAmount * 1000) / 1000;
      if (usd <= 0) {
        throw new BadRequestException('Deposit amount should not be zero');
      }

      const bExist = await this.prisma.transaction.findFirst({
        where: {
          platform: TransactionPlatform.DepositCrypto,
          io: 1,
          cash: {
            gt: 0,
          },
          userId: user.id,
          createdAt: {
            gt: new Date(1735603920000),
          },
        },
      });

      const bBonus = !bExist && user.wantBonus;
      const bonus_sum = bBonus ? (usd < 3000 ? usd : 3000) : 0;

      const user1 = await this.prisma.$transaction(async (prismaClient) => {
        this.logger.debug('Storing transaction ... ' + user.id);
        // add payment
        const txId1 = uuidv4();
        const tx1 = await prismaClient.transaction.create({
          data: {
            id: txId1,
            cash: usd,
            bonus: 0,
            locked: 0,
            io: 1,
            type: 'deposit',
            platform: TransactionPlatform.DepositCrypto,
            currency: 'USD',
            initiatedAt: new Date(),
            createdAt: new Date(),
            context: {},
            userId: user.id,
            chainId: data.chainId,
            tokenAddress: data.tokenAddress,
            tokenAmount: data.tokenAmount,
            isDeleted: 0,
            note: 'instant-deposit' + (bBonus ? ',bonus' : ''),
            txHash: data.transactionHash,
          },
        });

        let tx2: Transaction | null = null;
        if (bonus_sum > 0) {
          const txId2 = uuidv4();
          tx2 = await prismaClient.transaction.create({
            data: {
              id: txId2,
              cash: bonus_sum,
              bonus: 0,
              locked: 0,
              io: 1,
              type: TransactionType.deposit,
              platform: TransactionPlatform.DepositBonus,
              currency: 'USD',
              initiatedAt: new Date(),
              createdAt: new Date(),
              context: { refTxId: tx1.id },
              userId: user.id,
              chainId: data.chainId,
              tokenAddress: data.tokenAddress,
              tokenAmount: data.tokenAmount,
              isDeleted: 0,
              note: 'bonus',
              txHash: data.transactionHash,
            },
          });
        }

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
            id: user.id,
          },
          data: {
            cash: {
              increment: tx1.cash + (tx2?.cash || 0),
            },
            ['cash_' + data.chainId]: {
              increment: tx1.cash + (tx2?.cash || 0),
            },
            ...(bBonus ? { bonus_sum } : {}),
          },
        });

        return user1;
      });

      this.socketService.sendBalanceUpdated(user.id, user1);

      await this.mailService.sendDepositNotifications(user1, {
        amount: usd,
        tokenAddress: data.tokenAddress,
        tokenAmount: data.tokenAmount,
        chain: chainIds[data.chainId],
        txHash: transactionLink(data.transactionHash, data.chainId),
        oldBalance: user.cash,
        tokenName: dbToken.dbField,
      });
    } catch (ex2) {
      await this.prisma.failedTransaction.create({
        data: {
          userId: user.id,
          chainId: data.chainId,
          tokenAddress: data.tokenAddress,
          tokenAmount: data.tokenAmount,
          txHash: data.transactionHash,
          signature: JSON.stringify(data.signature),
          address: data.address,
          reason: JSON.stringify(ex2),
          createdAt: new Date(),
        },
      });
      throw ex2;
    }
  }

  async lazyDeposit(user: User, data: LazyDepositDto) {
    this.logger.debug('lazyDeposit-manual');
    await this.walletBackgroundService.checkUserToken(
      user.id,
      data.chainId,
      data.tokenAddress,
    );
    return {
      status: 'success',
    };
  }

  async lazyWithdraw(user: User, data: LazyWithdrawDto, ipv4: string) {
    const userCash = user['cash_' + data.tokenName];

    if (data.chainId === 0) {
      throw new BadRequestException('unsupported.token');
    }

    if (userCash < data.cash) {
      throw new BadRequestException('low.balance');
    }

    if (data.cash < 1) {
      throw new BadRequestException('low.request');
    }

    await this.userActivityService.addActivity({
      userId: user.id,
      type: UserActivityType.WITHDRAW,
      cash: data.cash,
      ip: ipv4,
    });

    // check the bonus withdrawing
    if (!user.bonusWithdrawPassed) {
      const financialActivity = await this.getFinancialActivity(user.id, 0, 0);

      if (
        financialActivity.totalResult.casinoBet >=
          40 * financialActivity.bonusDepositMoney ||
        financialActivity.totalResult.sportBet -
          financialActivity.totalResult.sportRollback >=
          8 * (financialActivity.bonusDepositMoney + user.bonus_sum)
      ) {
        await this.prisma.user.update({
          data: {
            bonusWithdrawPassed: true,
          },
          where: {
            id: user.id,
          },
        });
      } else {
        throw new BadRequestException('low.bet.bonus');
      }
    }

    const countryCode = ip3country.lookupStr(ipv4) || '';
    const { withdraw, balance } = await this.prisma.$transaction(
      async (prismaClient) => {
        const withdraw = await prismaClient.withdrawRequest.create({
          data: {
            userId: user.id,
            cash: data.cash,
            chainId: data.chainId,
            note: data.note,
            address: data.address,
            tokenName: data.tokenName,
            ip: ipv4,
            country: countryCode,
          },
        });

        const txId = uuidv4();
        const tx = await prismaClient.transaction.create({
          data: {
            id: txId,
            cash: withdraw.cash,
            io: -1,
            type: TransactionType.withdrawal,
            platform: TransactionPlatform.WithdrawRequested,
            context: {},
            userId: user.id,
            chainId: data.chainId,
            isDeleted: 0,
            eventId: withdraw.id.toString(),
            initiatedAt: new Date(),
            createdAt: new Date(),
            tokenName: data.tokenName,
          },
        });

        // update user balance
        const balance = await prismaClient.user.update({
          omit: {
            btcPk: true,
            solanaPk: true,
            ethPk: true,
            ltcPk: true,
            password: true,
            subscription: true,
          },
          where: {
            id: user.id,
          },
          data: {
            cash: {
              decrement: withdraw.cash,
            },
            ['cash_' + data.tokenName]: {
              decrement: withdraw.cash,
            },
          },
        });

        return {
          withdraw,
          balance,
        };
      },
    );

    this.socketService.sendBalanceUpdated(balance.id, balance);
    this.socketService.sendWithdrawRequest(withdraw);
    // this.pushService.sendWithdrawRequestNotification(user.id, data.cash);
    this.mailService.sendWithdrawRequestNotifications(user, data.cash);

    return withdraw;
  }

  async getLazyWithdraw(user: User, offset: number, length: number) {
    const total = await this.prisma.withdrawRequest.count({
      where: {
        userId: user.id,
      },
    });

    const data = await this.prisma.withdrawRequest.findMany({
      where: {
        userId: user.id,
      },
      orderBy: {
        id: 'desc',
      },
      skip: offset < 0 ? 0 : offset,
      take: length,
    });

    return {
      total,
      data,
    };
  }

  private async verifySignature(user: User, data: InstantDepositDto) {
    if (data.chainId === BITCOIN_CHAIN_ID) {
      return true;
    } else if (data.chainId === SOLANA_CHAIN_ID) {
      const message = JSON.stringify({
        address: data.address,
        to: this.configService.get<string>('ADMIN_SOL_WALLET'),
        tokenAmount: data.tokenAmount,
        tokenAddress: data.tokenAddress,
        chainId: data.chainId,
        transaction: data.transactionHash,
      });

      const valid = this.blockchainService.verifySolanaSignature(
        message,
        data.signature,
        data.address,
      );

      if (!valid) {
        throw new BadRequestException(
          'Signature: Your transaction is not valid',
        );
      }

      return true;
    } else {
      // make signature message
      const message = {
        from: {
          name: user.email,
          wallet: data.address,
        },
        to: {
          name: 'Admin',
          wallet: this.configService.get<string>('ADMIN_ETH_WALLET'),
        },
        chainId: data.chainId.toString(),
        transaction: data.transactionHash,
        tokenAddress: data.tokenAddress,
        tokenAmount: data.tokenAmount.toString(),
      };

      try {
        // check verification
        const valid = await verifyTypedData({
          address: data.address as `0x${string}`,
          types: ethSignatureTypes,
          primaryType: 'Transaction',
          message,
          signature: data.signature as `0x${string}`,
        });

        this.logger.debug(valid);
        if (!valid) {
          throw new BadRequestException(
            'Signature: Your transaction is not valid',
          );
        }

        return true;
      } catch (ex) {
        throw new BadRequestException(
          'Signature: Your transaction is not valid',
        );
      }
    }
  }

  async getCasinoHistory(
    userId: string,
    startTimestamp: number,
    endTimestamp: number,
    offset: number,
    length: number,
  ) {
    this.logger.debug(
      `Getting casino history (offset: ${offset}, length: ${length}) ...`,
    );

    const startDate = new Date(startTimestamp || 0);
    const endDate = endTimestamp
      ? new Date(endTimestamp)
      : new Date(2100, 1, 1);

    const where: Prisma.TransactionWhereInput = {
      userId,
      platform: {
        in: [TransactionPlatform.Fungamess, TransactionPlatform.Gr8Casino],
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    };

    const promises = [
      this.prisma.transaction.count({
        where: where,
      }),
      this.prisma.transaction.findMany({
        where: where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: length,
      }),
    ];

    const [total, data] = await Promise.all(promises);

    this.logger.debug(
      `Returned casino history (offset: ${offset}, length: ${length}) ...`,
    );

    return {
      total,
      data,
    };
  }

  async getSportsbookHistory(
    userId: string,
    startTimestamp: number,
    endTimestamp: number,
    offset: number,
    length: number,
  ) {
    this.logger.debug(
      `Getting sportsbook history (offset: ${offset}, length: ${length}, startTimestamp: ${startTimestamp}, endTimestamp: ${endTimestamp}) ...`,
    );

    const startDate = new Date(startTimestamp || 0);
    const endDate = endTimestamp
      ? new Date(endTimestamp)
      : new Date(2100, 1, 1);

    this.logger.debug(`Start date: ${startDate.toISOString()}`);
    this.logger.debug(`End date: ${endDate.toISOString()}`);

    const where = {
      userId,
      platform: TransactionPlatform.Sportsbook,
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
    } as any;

    const promises = [
      this.prisma.transaction.count({
        where: where,
      }),
      this.prisma.transaction.findMany({
        where: where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: length,
      }),
    ];

    const [total, data] = await Promise.all(promises);

    this.logger.debug(
      `Returned sportsbook history (offset: ${offset}, length: ${length}) ...`,
    );

    return {
      total,
      data,
    };
  }

  async getPaymentHistory(
    userId: string,
    startTimestamp: number,
    endTimestamp: number,
    offset: number,
    length: number,
    type?: string,
    showRakeback?: string,
  ) {
    this.logger.debug(
      `Getting payment history (offset: ${offset}, length: ${length}) ...`,
    );

    const startDate = new Date(startTimestamp || 0);
    const endDate = endTimestamp
      ? new Date(endTimestamp)
      : new Date(2100, 1, 1);

    this.logger.debug(`Start date: ${startDate.toISOString()}`);
    this.logger.debug(`End date: ${endDate.toISOString()}`);

    let platforms = [];
    if (type === 'deposit') {
      platforms = [TransactionPlatform.DepositCrypto];
    } else if (type === 'withdrawal') {
      platforms = [TransactionPlatform.WithdrawCrypto];
    } else if (type === 'other') {
      platforms = [
        TransactionPlatform.DepositAgent,
        TransactionPlatform.DepositManual,
        TransactionPlatform.DepositBonus,
        TransactionPlatform.WithdrawManual,
        TransactionPlatform.Transfer,
        TransactionPlatform.ReferralBonus,
        TransactionPlatform.Rakeback,
        TransactionPlatform.Cashback,
        TransactionPlatform.LevelUpBonus,
        TransactionPlatform.LeaderboardBonus,
      ];
    } else {
      if (showRakeback == 'true') {
        platforms = [
          TransactionPlatform.DepositCrypto,
          TransactionPlatform.DepositAgent,
          TransactionPlatform.WithdrawCrypto,
          TransactionPlatform.DepositManual,
          TransactionPlatform.DepositBonus,
          TransactionPlatform.WithdrawManual,
          TransactionPlatform.Transfer,
          TransactionPlatform.ReferralBonus,
          TransactionPlatform.Rakeback,
          TransactionPlatform.Cashback,
          TransactionPlatform.LevelUpBonus,
          TransactionPlatform.LeaderboardBonus,
        ];
      } else {
        platforms = [
          TransactionPlatform.DepositCrypto,
          TransactionPlatform.DepositAgent,
          TransactionPlatform.WithdrawCrypto,
          TransactionPlatform.DepositManual,
          TransactionPlatform.DepositBonus,
          TransactionPlatform.WithdrawManual,
          TransactionPlatform.Transfer,
          TransactionPlatform.ReferralBonus,
          TransactionPlatform.Cashback,
          TransactionPlatform.LevelUpBonus,
          TransactionPlatform.LeaderboardBonus,
        ];
      }
    }

    const where: Prisma.TransactionWhereInput = {
      userId,
      platform: {
        in: platforms,
      },
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      isDeleted: 0,
    };

    const promises = [
      this.prisma.transaction.count({
        where,
      }),
      this.prisma.transaction.findMany({
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset,
        take: length,
      }),
    ];

    const [total, data] = await Promise.all(promises);
    this.logger.debug(
      `Returned payment history (offset: ${offset}, length: ${length}) ...`,
    );

    return {
      total,
      data,
    };
  }

  async getUserPaymentStatistics(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const result = await this.prisma.transaction.groupBy({
      by: ['type'],
      where: {
        userId,
        platform: {
          in: [
            TransactionPlatform.DepositCrypto,
            TransactionPlatform.DepositAgent,
            TransactionPlatform.WithdrawCrypto,
            TransactionPlatform.DepositManual,
            TransactionPlatform.WithdrawManual,
          ],
        },
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
      _sum: {
        cash: true,
      },
    });

    const res: { [key: string]: number } = {};
    for (let i = 0; i < result.length; i++) {
      res[result[i].type] = +result[i]._sum.cash;
    }

    return {
      totalDeposit: res.deposit ?? 0,
      totalWithdraw: res.withdrawal ?? 0,
    } as TotalStatisticsDto;
  }

  async getPaymentSum(
    userId: string,
    startTimestamp: number,
    endTimestamp: number,
  ) {
    const startDate = new Date(startTimestamp || 0);
    const endDate = endTimestamp
      ? new Date(endTimestamp)
      : new Date(2100, 1, 1);
    const statistics = await this.getUserPaymentStatistics(
      userId,
      startDate,
      endDate,
    );
    return statistics;
  }

  async getLastDepositTransaction(userId: string) {
    this.logger.debug(userId);
    const res = await this.prisma.transaction.findFirstOrThrow({
      where: {
        userId,
        io: 1,
        type: TransactionType.deposit,
        chainId: {
          gt: 0,
        },
        platform: TransactionPlatform.DepositCrypto,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    return res;
  }

  async cancelWithdraw(user: User, requestId: number) {
    const withdraw = await this.prisma.withdrawRequest.update({
      data: {
        status: 3, // canceled
        issuedAt: new Date(),
      },
      where: {
        id: requestId,
        userId: user.id,
        status: 0,
      },
    });

    if (!withdraw.id) {
      throw new BadRequestException('request.not-found');
    }

    const { balance } = await this.prisma.$transaction(
      async (prismaClient) => {
        const txId = uuidv4();
        const tx = await prismaClient.transaction.create({
          data: {
            id: txId,
            cash: withdraw.cash,
            io: 1,
            type: TransactionType.deposit,
            platform: TransactionPlatform.WithdrawCancelled,
            currency: TransactionCurrency.USD,
            initiatedAt: new Date(),
            createdAt: new Date(),
            userId: withdraw.userId,
            chainId: withdraw.chainId,
            eventId: withdraw.id.toString(),
            tokenName: withdraw.tokenName,
          },
        });

        // update user balance
        const balance = await prismaClient.user.update({
          omit: {
            btcPk: true,
            ethPk: true,
            solanaPk: true,
            ltcPk: true,
            subscription: true,
            password: true,
          },
          where: {
            id: withdraw.userId,
          },
          data: {
            cash: {
              increment: withdraw.cash - withdraw.approvedCash,
            },
            ['cash_' + withdraw.tokenName]: {
              increment: withdraw.cash - withdraw.approvedCash,
            },
          },
        });

        return {
          balance,
        };
      },
    );

    this.socketService.sendBalanceUpdated(balance.id, balance);
    return balance;
  }

  private async _getSummarizedValues(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const query = `
      SELECT
        "userId",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'deposit.visa'::text THEN cash
                ELSE 0::double precision
            END) AS "depositVisa",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'deposit.crypto'::text THEN cash
                ELSE 0::double precision
            END) AS "depositCrypto",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'deposit.manual'::text THEN cash
                ELSE 0::double precision
            END) AS "depositManual",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'deposit.agent'::text THEN cash
                ELSE 0::double precision
            END) AS "depositAgent",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'deposit.bonus'::text THEN cash
                ELSE 0::double precision
            END) AS "depositBonus",
        sum(
            CASE
                WHEN type = 'withdrawal'::"TransactionType" AND io = '-1'::integer AND platform = 'withdraw.crypto'::text THEN cash
                ELSE 0::double precision
            END) AS "withdrawCrypto",
        sum(
            CASE
                WHEN type = 'withdrawal'::"TransactionType" AND io = '-1'::integer AND platform = 'withdraw.manual'::text THEN cash
                ELSE 0::double precision
            END) AS "withdrawManual",
        sum(
            CASE
                WHEN type = 'withdrawal'::"TransactionType" AND io = '-1'::integer AND platform = 'withdraw.banned'::text THEN cash
                ELSE 0::double precision
            END) AS "withdrawBanned",
        sum(
            CASE
                WHEN type = 'withdrawal'::"TransactionType" AND io = '-1'::integer AND platform = 'withdraw.requested'::text THEN cash
                ELSE 0::double precision
            END) AS "withdrawRequested",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = '1'::integer AND platform = 'withdraw.cancelled'::text THEN cash
                ELSE 0::double precision
            END) AS "withdrawCancelled",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'levelup.bonus'::text THEN cash
                ELSE 0::double precision
            END) AS "levelupBonus",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'referral.bonus'::text THEN cash
                ELSE 0::double precision
            END) AS "referralBonus",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'leaderboard.bonus'::text THEN cash
                ELSE 0::double precision
            END) AS "leaderboardBonus",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'rakeback'::text THEN cash
                ELSE 0::double precision
            END) AS rakeback,
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'transfer'::text THEN cash
                ELSE 0::double precision
            END) AS "transferIn",
        sum(
            CASE
                WHEN type = 'withdrawal'::"TransactionType" AND io = '-1'::integer AND platform = 'transfer'::text THEN cash
                ELSE 0::double precision
            END) AS "transferOut",
        sum(
            CASE
                WHEN (type = 'withdrawal'::"TransactionType" AND platform = 'fungamess.casino'::text OR type = 'bet'::"TransactionType" AND platform = 'gr8.casino'::text) AND io = '-1'::integer THEN cash
                WHEN type = 'refund'::"TransactionType" AND platform = 'gr8.casino'::text THEN cash * io::double precision * '-1'::integer::double precision
                ELSE 0::double precision
            END) AS "casinoBet",
        sum(
            CASE
                WHEN (type = 'deposit'::"TransactionType" AND platform = 'fungamess.casino'::text OR type = 'win'::"TransactionType" AND platform = 'gr8.casino'::text) AND io = 1 THEN cash
                ELSE 0::double precision
            END) AS "casinoWin",
        sum(
            CASE
                WHEN type = 'withdrawal'::"TransactionType" AND io = '-1'::integer AND platform = 'sport'::text THEN cash
                ELSE 0::double precision
            END) AS "sportBet",
        sum(
            CASE
                WHEN type = 'deposit'::"TransactionType" AND io = 1 AND platform = 'sport'::text THEN cash
                ELSE 0::double precision
            END) AS "sportWin",
        sum(
            CASE
                WHEN type = 'rollback'::"TransactionType" AND platform = 'sport'::text THEN cash * io::double precision
                ELSE 0::double precision
            END) AS "sportRollback"
      FROM transactions
      WHERE "userId"='${userId}' AND "createdAt">='${startDate.toISOString()}' AND "createdAt"<='${endDate.toISOString()}'
      GROUP BY "userId";`;

    const result: tSummarizedTransaction[] =
      await this.prisma.$queryRawUnsafe(query);
    return {
      userId: userId,
      depositCrypto: result[0]?.depositCrypto || 0,
      depositManual: result[0]?.depositManual || 0,
      depositVisa: result[0]?.depositVisa || 0,
      depositAgent: result[0]?.depositAgent || 0,
      depositBonus: result[0]?.depositBonus || 0,
      referralBonus: result[0]?.referralBonus || 0,
      levelupBonus: result[0]?.levelupBonus || 0,
      leaderboardBonus: result[0]?.leaderboardBonus || 0,
      rakeback: result[0]?.rakeback || 0,
      transferIn: result[0]?.transferIn || 0,
      withdrawCrypto: result[0]?.withdrawCrypto || 0,
      withdrawManual: result[0]?.withdrawManual || 0,
      withdrawBanned: result[0]?.withdrawBanned || 0,
      withdrawCancelled: result[0]?.withdrawCancelled || 0,
      withdrawRequested: result[0]?.withdrawRequested || 0,
      transferOut: result[0]?.transferOut || 0,
      casinoBet: result[0]?.casinoBet || 0,
      casinoWin: result[0]?.casinoWin || 0,
      sportBet: result[0]?.sportBet || 0,
      sportWin: result[0]?.sportWin || 0,
      sportRollback: result[0]?.sportRollback || 0,
    };
  }

  private async _getTotalUserTransactionStatistics(
    userId: string,
    startDate: Date,
    endDate: Date,
  ) {
    const [totalResult, monthlyResult, weeklyResult] = await Promise.all([
      this._getSummarizedValues(userId, startDate, endDate),
      this._getSummarizedValues(
        userId,
        new Date(new Date().getTime() - 30 * 24 * 3600 * 1000),
        new Date(),
      ),
      this._getSummarizedValues(
        userId,
        new Date(new Date().getTime() - 7 * 24 * 3600 * 1000),
        new Date(),
      ),
    ]);

    return { totalResult, monthlyResult, weeklyResult };
  }

  async getFinancialActivity(
    userId: string,
    beginTimestamp: number,
    endTimestamp: number,
  ) {
    this.logger.debug(`Getting financial activity ...`);

    const startDate = new Date(beginTimestamp || 0);
    const endDate = endTimestamp
      ? new Date(endTimestamp)
      : new Date(2100, 1, 1);

    const [user, statistics, bonusDepositTransaction, bonusTransaction] =
      await Promise.all([
        this.prisma.user.findUnique({ where: { id: userId } }),
        this._getTotalUserTransactionStatistics(userId, startDate, endDate),
        this.prisma.transaction.findFirst({
          where: {
            platform: TransactionPlatform.DepositCrypto,
            type: 'deposit',
            userId,
            note: {
              contains: ',bonus',
            },
          },
          orderBy: {
            createdAt: 'asc',
          },
        }),
        this.prisma.transaction.aggregate({
          _sum: {
            cash: true,
          },
          where: {
            platform: TransactionPlatform.DepositBonus,
            type: 'deposit',
            userId,
          },
        }),
      ]);

    let depositMoney = bonusDepositTransaction?.cash || 0;
    if (!bonusTransaction) {
      depositMoney -= user.bonus_sum;
    }

    this.logger.debug(`Returned financial activity ...`);
    return {
      ...statistics,
      bonusMoney: bonusTransaction._sum.cash || 0,
      bonusDepositMoney: depositMoney,
    };
  }

  async transferBalance(user: User, data: TransferBalanceDto) {
    if (data.balance < 1) {
      this.logger.error('Balance error');
      throw new BadRequestException('balance.error');
    }

    if (data.balance > user['cash_' + data.tokenName]) {
      this.logger.error('Low balance error');
      throw new BadRequestException('low.balance.error');
    }

    const dest = await this.prisma.user.findFirst({
      omit: {
        btcPk: true,
        ethPk: true,
        solanaPk: true,
        ltcPk: true,
      },
      where: {
        OR: [
          {
            email: data.emailOrUsername,
          },
          {
            userName: data.emailOrUsername,
          },
        ],
        isDeleted: false,
      },
    });

    // user not found
    if (!dest) {
      this.logger.error('User not found');
      throw new BadRequestException('user.not-found');
    }

    const { tx1, tx2, sender, recipient } = await this.prisma.$transaction(
      async (prismaClient) => {
        this.logger.debug('Storing transfer transaction ... ');
        const txId1 = uuidv4();
        const txId2 = uuidv4();
        const [tx1, tx2, sender, recipient] = await Promise.all([
          prismaClient.transaction.create({
            data: {
              id: txId1,
              cash: data.balance,
              bonus: 0,
              locked: 0,
              io: -1,
              type: 'withdrawal',
              platform: TransactionPlatform.Transfer,
              initiatedAt: new Date(),
              createdAt: new Date(),
              context: {
                senderId: user.id,
                recipientId: dest.id,
              },
              userId: user.id,
              chainId: Number(data.tokenName) || 0,
              tokenAddress: null,
              tokenAmount: 0,
              isDeleted: 0,
              note: dest.id,
              tokenName: data.tokenName,
            },
          }),
          prismaClient.transaction.create({
            data: {
              id: txId2,
              cash: data.balance,
              bonus: 0,
              locked: 0,
              io: 1,
              type: 'deposit',
              platform: TransactionPlatform.Transfer,
              initiatedAt: new Date(),
              createdAt: new Date(),
              context: {
                senderId: user.id,
                recipientId: dest.id,
              },
              userId: dest.id,
              chainId: Number(data.tokenName) || 0,
              tokenAddress: null,
              tokenAmount: 0,
              isDeleted: 0,
              note: user.id,
              tokenName: data.tokenName,
            },
          }),
          prismaClient.user.update({
            omit: {
              btcPk: true,
              ethPk: true,
              solanaPk: true,
              ltcPk: true,
              subscription: true,
              password: true,
            },
            where: {
              id: user.id,
            },
            data: {
              cash: {
                decrement: data.balance,
              },
              ['cash_' + data.tokenName]: {
                decrement: data.balance,
              },
            },
          }),
          prismaClient.user.update({
            omit: {
              btcPk: true,
              ethPk: true,
              solanaPk: true,
              ltcPk: true,
              subscription: true,
              password: true,
            },
            where: {
              id: dest.id,
            },
            data: {
              cash: {
                increment: data.balance,
              },
              ['cash_' + data.tokenName]: {
                increment: data.balance,
              },
            },
          }),
        ]);

        this.logger.debug(
          'Stored transfer transaction. Updating user balance ...',
        );

        return { tx1, tx2, sender, recipient };
      },
    );

    this.logger.debug('Getting new balance ...');

    this.logger.debug('Sending balance updated events ...');
    this.socketService.sendBalanceUpdated(sender.id, sender);
    this.socketService.sendBalanceUpdated(recipient.id, recipient);

    return true;
  }

  async convertBalance(user: User, data: ConvertBalanceDto) {
    const sourceBalance = user['cash_' + data.sourceToken];
    if (data.balance > sourceBalance) {
      throw new BadRequestException('balance.exceed');
    }

    const res = await this.prisma.user.update({
      omit: {
        btcPk: true,
        ltcPk: true,
        ethPk: true,
        solanaPk: true,
        password: true,
        subscription: true,
      },
      where: {
        id: user.id,
      },
      data: {
        ['cash_' + data.sourceToken]: {
          decrement: data.balance,
        },
        ['cash_' + data.destToken]: {
          increment: data.balance,
        },
      },
    });

    this.socketService.sendBalanceUpdated(user.id, res);
    return res;
  }

  async checkBalance(user: User, body: CheckBalanceDto) {
    await this.walletBackgroundService.checkUserToken(
      body.userId,
      body.chainId,
      body.tokenAddress,
      true,
    );
    return true;
  }
}
