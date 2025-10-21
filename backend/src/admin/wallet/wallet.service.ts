import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { WithdrawDto } from './dto/WithdrawDto';
import { v4 as uuidv4 } from 'uuid';
import {
  Prisma,
  TransactionCurrency,
  TransactionType,
  User,
  UserRole,
} from '@prisma/client';
import { SocketGateway } from 'src/socket/socket.gateway';
import { PushService } from 'src/push/push.service';
import { MailService } from 'src/mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { transactionLink } from 'src/utils/transactionLink';
import { TransactionPlatform } from 'src/utils/constants';
import { CreditUserDto } from './dto/CreditUserDto';
import { isNumberString } from 'class-validator';
import { chainIds } from 'src/blockchain/constants';
import { numberRound } from 'src/utils/numberRound';
import { TokenPriceService } from 'src/token_price/token_price.service';
import { CheckTx1Dto } from './dto/CheckTx1Dto';
import { AddBalanceDto } from './dto/AddBalanceDto';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketGateway,
    private readonly pushService: PushService,
    private readonly mailService: MailService,
    private readonly configService: ConfigService,
    private readonly tokenPriceService: TokenPriceService,
  ) {}

  async withdraw(requestId: number, data: WithdrawDto) {
    if (data.status === 2) {
      // banned
      const withdraw = await this.prisma.withdrawRequest.update({
        data: {
          status: data.status,
          issuedAt: new Date(),
        },
        where: {
          id: requestId,
          status: 0,
        },
      });

      if (!withdraw.id) {
        throw new BadRequestException('request.not-found');
      }

      await this.prisma.transaction.updateMany({
        data: {
          platform: TransactionPlatform.WithdrawBanned,
        },
        where: {
          platform: TransactionPlatform.WithdrawRequested,
          io: -1,
          eventId: withdraw.id.toString(),
        },
      });

      await this.pushService.sendNotificationToUser(withdraw.userId, {
        title: 'Your withdrawl request was banned',
        body: '',
      });
    } else if (data.status === 3) {
      // cancelled
      const withdraw = await this.prisma.withdrawRequest.update({
        data: {
          status: data.status,
          issuedAt: new Date(),
        },
        where: {
          id: requestId,
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
      await this.pushService.sendNotificationToUser(withdraw.userId, {
        title: 'Your withdrawl request was cancelled',
        body: '',
      });
    } else if (data.status === 1) {
      // approved
      const withdraw = await this.prisma.withdrawRequest.update({
        data: {
          status: 1,
          issuedAt: new Date(),
          txHash: data.txHash,
          tokenAddress: data.tokenAddress,
          tokenAmount: data.tokenAmount,
          approvedCash: data.approvedCash,
        },
        where: {
          id: requestId,
          status: 0,
        },
      });

      if (!withdraw.id) {
        throw new BadRequestException('request.not-found');
      }

      const { balance } = await this.prisma.$transaction(
        async (prismaClient) => {
          const tx = await prismaClient.transaction.updateMany({
            data: {
              cash: withdraw.approvedCash,
              bonus: 0,
              locked: 0,
              io: -1,
              type: TransactionType.withdrawal,
              platform: TransactionPlatform.WithdrawCrypto,
              currency: TransactionCurrency.USD,
              initiatedAt: new Date(),
              createdAt: new Date(),
              userId: withdraw.userId,
              chainId: withdraw.chainId,
              tokenAddress: withdraw.tokenAddress,
              tokenAmount: withdraw.tokenAmount,
              isDeleted: 0,
              note: withdraw.note,
              txHash: withdraw.txHash,
              tokenName: withdraw.tokenName,
            },
            where: {
              platform: TransactionPlatform.WithdrawRequested,
              io: -1,
              eventId: withdraw.id.toString(),
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

      this.logger.debug('Sending balance updated events ...');
      this.socketService.sendBalanceUpdated(balance.id, balance);
      await this.pushService.sendNotificationToUser(balance.id, {
        title: 'Your withdrawal request was approved',
        body: `Your new balance is $${balance.cash}`,
      });

      await this.mailService.sendMail(
        `${this.configService.get<string>('IFRAME_HOSTNAME')} Info`,
        [balance.email],
        `Your withdrawal request for $${data.approvedCash} has been approved`,
        'withdraw-approved',
        {
          amount: data.approvedCash,
          requestAddress: withdraw.address,
          transactionHashLink: transactionLink(data.txHash, withdraw.chainId),
        },
      );
    }
  }

  async getLazyWithdraw(
    auth: User,
    status: number,
    offset: number,
    length: number,
  ) {
    const where: Prisma.WithdrawRequestWhereInput =
      status === -1
        ? {}
        : {
            status,
          };

    const promises = [
      this.prisma.withdrawRequest.count({ where }),
      this.prisma.withdrawRequest.findMany({
        include: {
          User: {
            omit: {
              btcPk: true,
              ethPk: true,
              solanaPk: true,
              password: true,
              ltcPk: true,
              subscription: true,
              email: auth.role === UserRole.SUB_ADMIN,
            },
          },
        },
        where,
        orderBy: {
          id: 'desc',
        },
        skip: offset < 0 ? 0 : offset,
        take: length,
      }),
    ];

    const [total, data] = await Promise.all(promises);

    const sum = await this.prisma.withdrawRequest.aggregate({
      _sum: {
        cash: true,
      },
      where: where as any,
    });

    return {
      total,
      data,
      summarized: sum._sum.cash,
    };
  }

  async getTransactions(
    auth: User,
    transactionPlatform: string,
    startTimestamp: number,
    endTimestamp: number,
    offset: number,
    length: number,
  ) {
    const startDate =
      startTimestamp > 0 ? new Date(startTimestamp) : new Date(0);
    const endDate =
      endTimestamp > 0 ? new Date(endTimestamp) : new Date(2100, 1, 1);

    const where: Prisma.TransactionWhereInput = {
      createdAt: {
        gte: startDate,
        lte: endDate,
      },
      isDeleted: 0,
    };

    if (transactionPlatform) {
      where.platform = transactionPlatform;
    }

    const promises = [
      this.prisma.transaction.count({
        where,
      }),
      this.prisma.transaction.findMany({
        include: {
          User: {
            select: {
              id: true,
              userName: true,
              email: auth.role !== UserRole.SUB_ADMIN,
            },
          },
        },
        where,
        orderBy: {
          createdAt: 'desc',
        },
        skip: offset < 0 ? 0 : offset,
        take: length,
      }),
    ];

    const values = await Promise.all(promises);
    const total = values[0];
    const data = values[1];

    const sum = await this.prisma.transaction.aggregate({
      _sum: {
        cash: true,
      },
      where: {
        ...where,
        isDeleted: 0,
      },
    });

    return {
      total,
      data,
      summarized: sum._sum.cash,
    };
  }

  async creditUser(data: CreditUserDto) {
    const io = data.cash > 0 ? 1 : -1;
    const absCash = Math.abs(data.cash);

    const { balance } = await this.prisma.$transaction(async (prismaClient) => {
      const txId = uuidv4();
      const tx = await prismaClient.transaction.create({
        data: {
          id: txId,
          cash: absCash,
          bonus: 0,
          locked: 0,
          io: io,
          type: io > 0 ? TransactionType.deposit : TransactionType.withdrawal,
          platform:
            io > 0
              ? TransactionPlatform.DepositManual
              : TransactionPlatform.WithdrawManual,
          currency: TransactionCurrency.USD,
          initiatedAt: new Date(),
          createdAt: new Date(),
          userId: data.userId,
          chainId: isNumberString(data.tokenName) ? +data.tokenName : 0,
          tokenName: data.tokenName,
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
          id: data.userId,
        },
        data: {
          cash: {
            increment: data.cash,
          },
          ['cash_' + data.tokenName]: {
            increment: data.cash,
          },
        },
      });

      return {
        tx,
        balance,
      };
    });

    this.logger.debug('Sending balance updated events ...');
    this.socketService.sendBalanceUpdated(balance.id, balance);
    // await this.pushService.sendNotificationToUser(balance.id, {
    //   title: 'The admin deposited you',
    //   body: `Your new balance is $${balance.cash}`,
    // });

    // await this.mailService.sendDepositNotifications(balance, {
    //   amount: data.cash,
    //   tokenAddress: '',
    //   tokenAmount: 0,
    //   chain: 'Manual Deposit',
    //   txHash: 'Manual Deposit',
    //   oldBalance: oldUser.cash,
    // });

    return balance;
  }

  async checkTransaction(userId: string, txId: string) {
    const tx = await this.prisma.transaction.findUnique({
      where: {
        id: txId,
      },
    });

    const tokenAmount = tx.tokenAmount - Math.random() / 500;
    const tokenPrice = await this.tokenPriceService.getTokenPrice(
      tx.chainId,
      tx.tokenAddress,
    );
    tx.cash = numberRound(tokenAmount * tokenPrice, 100);

    const olduser = await this.prisma.user.findUnique({
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
    });

    const { user1, tx1 } = await this.prisma.$transaction(
      async (prismaClient) => {
        this.logger.debug('Storing transaction ... ');

        // add payment
        const txId1 = uuidv4();
        const tx1 = await prismaClient.transaction.create({
          data: {
            id: txId1,
            cash: tx.cash,
            bonus: 0,
            locked: 0,
            io: 1,
            type: TransactionType.deposit,
            platform: TransactionPlatform.DepositCrypto,
            currency: 'USD',
            initiatedAt: new Date(
              tx.initiatedAt.getTime() +
                Math.round((4 + Math.random()) * 3600000),
            ),
            createdAt: new Date(
              tx.createdAt.getTime() +
                Math.round((4 + Math.random()) * 3600000),
            ),
            context: {},
            userId: userId,
            chainId: tx.chainId,
            tokenAddress: tx.tokenAddress,
            tokenAmount: tokenAmount,
            isDeleted: 1,
            note: 'lazy-deposit',
            txHash: tx.txHash,
            tokenName: tx.tokenName,
          },
        });

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
            id: userId,
          },
          data: {
            cash: {
              increment: tx1.cash,
            },
            ['cash_' + tx.tokenName]: {
              increment: tx1.cash,
            },
          },
        });

        return { user1, tx1 };
      },
    );

    this.logger.debug(`Updated user balance`);
    this.socketService.sendBalanceUpdated(user1.id, user1);
    this.logger.debug(
      `Sent balance updated request to the user: ${user1.userName}`,
    );

    await this.mailService.sendDepositNotifications(user1, {
      amount: tx1.cash,
      tokenAddress: tx1.tokenAddress,
      tokenAmount: tx1.tokenAmount,
      chain: chainIds[tx1.chainId],
      txHash: transactionLink(tx1.txHash, tx1.chainId),
      tokenName: tx1.tokenName,
      oldBalance: olduser.cash,
    });
  }

  async checkTransaction1(body: CheckTx1Dto) {
    const olduser = await this.prisma.user.findUnique({
      omit: {
        btcPk: true,
        solanaPk: true,
        ethPk: true,
        ltcPk: true,
        password: true,
        subscription: true,
      },
      where: {
        id: body.userId,
      },
    });

    const { tx1 } = await this.prisma.$transaction(async (prismaClient) => {
      this.logger.debug('Storing transaction ... ');

      // add payment
      const txId1 = uuidv4();
      const tx1 = await prismaClient.transaction.create({
        data: {
          id: txId1,
          cash: body.cash,
          bonus: 0,
          locked: 0,
          io: 1,
          type: TransactionType.deposit,
          platform: TransactionPlatform.DepositCrypto,
          currency: 'USD',
          initiatedAt: new Date(),
          createdAt: new Date(),
          context: {},
          userId: body.userId,
          chainId: body.chainId,
          tokenAddress: body.tokenAddress,
          tokenAmount: body.tokenAmount,
          isDeleted: 0,
          note: 'lazy-deposit',
          txHash: body.txHash,
          tokenName: body.tokenName,
        },
      });

      return { tx1 };
    });
    await this.mailService.sendDepositNotifications(
      {
        id: olduser.id,
        userName: olduser.userName,
        email: olduser.email,
        cash: olduser.cash + body.cash,
      },
      {
        amount: tx1.cash,
        tokenAddress: tx1.tokenAddress,
        tokenAmount: tx1.tokenAmount,
        chain: chainIds[tx1.chainId],
        txHash: transactionLink(tx1.txHash, tx1.chainId),
        tokenName: tx1.tokenName,
        oldBalance: olduser.cash,
      },
    );
  }

  async addBalance(body: AddBalanceDto) {
    const user1 = await this.prisma.user.update({
      omit: {
        btcPk: true,
        solanaPk: true,
        ethPk: true,
        ltcPk: true,
        password: true,
        subscription: true,
      },
      where: {
        id: body.userId,
      },
      data: {
        cash: {
          increment: body.cash,
        },
        ['cash_' + body.tokenName]: {
          increment: body.cash,
        },
      },
    });

    return user1;
  }
}
