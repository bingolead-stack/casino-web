import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { MailService } from 'src/mail/mail.service';
import { ProcessPaymentDto } from './dto/ProcessPaymentDto';
import { v4 as uuidv4 } from 'uuid';
import { ProcessPaymentCallbackDto } from './dto/ProcessPaymentCallbackDto';
import { TransactionType } from '@prisma/client';
import { TransactionPlatform } from 'src/utils/constants';

@Injectable()
export class XswiftlyService {
  private readonly logger = new Logger(XswiftlyService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketGateway,
    private readonly configService: ConfigService,
    private readonly mailService: MailService,
  ) {}

  async processPayment(userId: string, body: ProcessPaymentDto) {
    const invoiceNumber = uuidv4();

    const response = await fetch(
      'https://secure.xswiftly.com/clients/xswiftly_001/process_payment.php',
      {
        method: 'POST',
        headers: {
          Authorization: 'Bearer 8e1fbd6f20ff0cfce4f40671a3bb2396',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: body.fullName,
          amount: body.amount,
          invoiceNumber: invoiceNumber,
          email: body.email,
          currency: 'USD',
          phone: body.phone,
          country: body.country,
          status_url:
            'https://api.casino.com/v1/xswiftly/process-payment-callback',
          return_url: body.redirectUrl,
        }),
      },
    );

    let xswiftlyRes;
    if (response.status === 200) {
      xswiftlyRes = await response.json();
    }

    const record = await this.prisma.xSwiftlyRequest.create({
      data: {
        userId,
        fullName: body.fullName,
        amount: body.amount,
        invoiceNumber: invoiceNumber,
        email: body.email,
        phone: body.phone,
        country: body.country,
        status: !xswiftlyRes ? 0 : 1,
      },
    });

    if (xswiftlyRes) {
      return xswiftlyRes;
    } else {
      throw new BadRequestException('process.payment.error');
    }
  }

  async processPaymentCallback(body: ProcessPaymentCallbackDto) {
    const request = await this.prisma.xSwiftlyRequest.update({
      where: {
        invoiceNumber: body.invoiceNumber,
      },
      data: {
        statusText: body.status,
        transactionId: body.transactionId,
        issuedAt: new Date(),
        message: body.message,
      },
    });

    if (body.status === 'Success') {
      const user = await this.prisma.user.findUnique({
        omit: {
          btcPk: true,
          solanaPk: true,
          ethPk: true,
          ltcPk: true,
          password: true,
          subscription: true,
        },
        where: {
          id: request.userId,
        },
      });

      // update user balance
      try {
        const bBonus = false;
        const bonus_sum = 0;

        const user1 = await this.prisma.$transaction(async (prismaClient) => {
          this.logger.debug('Storing transaction ... ');

          // add payment
          const txId1 = uuidv4();
          const tx1 = await prismaClient.transaction.create({
            data: {
              id: txId1,
              cash: body.amount,
              bonus: 0,
              locked: 0,
              io: 1,
              type: TransactionType.deposit,
              platform: TransactionPlatform.DepositVisa,
              currency: 'USD',
              initiatedAt: new Date(),
              createdAt: new Date(),
              context: {},
              userId: request.userId,
              chainId: 0,
              isDeleted: 0,
              txHash: body.transactionId,
              tokenName: '0',
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
              id: request.userId,
            },
            data: {
              cash: {
                increment: tx1.cash,
              },
              cash_0: {
                increment: tx1.cash,
              },
              ...(bBonus ? { bonus_sum } : {}),
            },
          });

          return user1;
        });

        this.logger.debug(`Updated user balance`);
        this.socketService.sendBalanceUpdated(request.userId, user1);
        this.logger.debug(
          `Sent balance updated request to the user: ${user1.userName}`,
        );

        await this.mailService.sendDepositNotifications(user1, {
          amount: body.amount,
          tokenAddress: '',
          tokenAmount: body.amount,
          chain: 'Visa',
          txHash: '',
          tokenName: 'visa',
          oldBalance: user.cash,
        });
      } catch (ex) {
        this.logger.error(ex);
      }
    }
  }
}
