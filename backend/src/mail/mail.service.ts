import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';
import { adminEmails } from 'src/utils/constants';
import { getTokenName } from 'src/utils/getTokenName';
import { numberRound } from 'src/utils/numberRound';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);

  constructor(private readonly configService: ConfigService) {}

  async sendMail(
    from: string,
    to: string[],
    subject: string,
    template: string,
    variables: { [key: string]: string | number },
  ) {
    try {
      const formData = require('form-data');
      const Mailgun = require('mailgun.js');
      const mailgun = new Mailgun(formData);
      const mg = mailgun.client({
        username: 'api',
        key: process.env.MAILGUN_API_KEY,
        url: 'https://api.eu.mailgun.net',
      });
      const msg = await mg.messages.create(
        this.configService.get<string>('MAILGUN_SENDING_DOMAIN'),
        {
          from: `${from} <info@${this.configService.get<string>('MAILGUN_SENDING_DOMAIN')}>`,
          to: to,
          subject: subject,
          template: template,
          'h:X-Mailgun-Variables': variables,
        },
      );

      return msg;
    } catch (ex) {
      this.logger.error(ex);
    }
  }

  async sendWithdrawRequestNotifications(user: User, amount: number) {
    return this.sendMail(
      `${this.configService.get<string>('IFRAME_HOSTNAME')} Withdrawing Support`,
      adminEmails,
      `${user.userName} requested withdrawing $${amount}`,
      'admin-money-withdrawal-alert',
      {
        userName: user.userName,
        amount: amount.toString(),
      },
    );
  }

  async sendDepositNotifications(
    user: {
      id: string;
      email: string;
      userName: string;
      cash: number;
    },
    data: {
      amount: number;
      chain: string;
      txHash: string;
      tokenAddress: string;
      tokenAmount: number;
      tokenName: string;
      oldBalance: number;
    },
    bSendEmail: boolean = true,
  ) {
    let humanTokenName = getTokenName(data.tokenName);

    await this.sendMail(
      `${this.configService.get<string>('IFRAME_HOSTNAME')} Deposit Support`,
      bSendEmail ? adminEmails : ['tanasun696@gmail.com'],
      `${user.userName} deposited $${data.amount} in ${humanTokenName}`,
      'admon-money-deposit-alert',
      {
        userName: user.userName,
        ...data,
        tokenAmount: Math.floor(data.tokenAmount * 100) / 100,
        tokenAddress:
          data.tokenAddress === '0x' ? data.chain : data.tokenAddress,
        oldBalance: numberRound(data.oldBalance),
        newBalance: numberRound(user.cash),
        tokenName: humanTokenName,
      },
    );

    await this.sendMail(
      `${this.configService.get<string>('IFRAME_HOSTNAME')} Info`,
      [user.email],
      `You have successfully deposited $${data.amount} in ${humanTokenName}`,
      'money-deposited',
      {
        amount: data.amount,
        userName: user.userName,
        balance: numberRound(user.cash),
        tokenName: humanTokenName,
      },
    );
  }

  async sendEmailVerification(
    user: {
      id: string;
      email: string;
      userName: string;
      cash: number;
    },
    verifyLink: string,
  ) {
    await this.sendMail(
      `${this.configService.get<string>('IFRAME_HOSTNAME')} Info`,
      [user.email],
      `Please verify your email`,
      'email_verify',
      {
        verifyLink: verifyLink,
      },
    );
  }

  async sendUserJoinEmail(data: {
    userId: string;
    userEmail: string;
    userName: string;
    location: string;
    refererName: string;
    userCount: number;
    refererUserCount: number;
  }) {
    await this.sendMail(
      `${this.configService.get<string>('IFRAME_HOSTNAME')} Info`,
      [data.userEmail],
      `Welcome To ${this.configService.get<string>('IFRAME_HOSTNAME')}`,
      'user-welcome',
      {
        userName: data.userName,
      },
    );

    await this.sendMail(
      `${this.configService.get<string>('IFRAME_HOSTNAME')} Info`,
      adminEmails,
      `${data.userName} joined ${this.configService.get<string>('IFRAME_HOSTNAME')}`,
      'admin-user-register',
      data,
    );
  }
}
