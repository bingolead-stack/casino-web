// push.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { User, UserRole } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import * as webPush from 'web-push';
import { PushPayloadDto } from './dto/PushPayloadDto';

@Injectable()
export class PushService {
  private readonly logger = new Logger(PushService.name);

  constructor(private readonly prisma: PrismaService) {
    webPush.setVapidDetails(
      'mailto:your-email@example.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY,
    );
  }

  async subscripbe(user: User, subscription: any) {
    await this.prisma.user.update({
      omit: {
        btcPk: true,
        ethPk: true,
        solanaPk: true,
        ltcPk: true,
        password: true,
      },
      data: {
        subscription: JSON.stringify(subscription),
      },
      where: {
        id: user.id,
      },
    });

    return true;
  }

  async sendNotification(subscription: string, payload: PushPayloadDto) {
    try {
      // send push notification
    } catch (error) {
      console.error('Error sending notification', error);
    }
  }

  async sendWithdrawRequestNotification(userId: string, amount: number) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        select: {
          userName: true,
        },
        where: { id: userId, isDeleted: false },
      });

      // send notification
      const adminIds = await this.prisma.user.findMany({
        select: { id: true, subscription: true },
        where: {
          role: UserRole.ADMIN,
        },
      });

      this.logger.debug("Admin length: " + adminIds.length);
      for (let i = 0; i < adminIds.length; i++) {
        if (!adminIds[i].subscription) {
          this.logger.debug("No subscription");
          continue;
        }

        // send push notification
      }
    } catch (ex) {
      this.logger.error(ex);
    }
  }

  async sendNotificationToUser(userId: string, payload: PushPayloadDto) {
    try {
      const user = await this.prisma.user.findUniqueOrThrow({
        select: {
          subscription: true,
          userName: true,
        },
        where: { id: userId, isDeleted: false },
      });

      if (!user.subscription) {
        return false;
      }

      // send push notification
    } catch (ex) {
      this.logger.error(ex);
    }
  }
}
