import { Injectable, Logger } from '@nestjs/common';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { SupportMessageUserDto } from './dto/SupportMessageUserDto';
import { SupportMessageAdminDto } from './dto/SupportMessageAdminDto';

@Injectable()
export class LiveSupportService {
  private readonly logger = new Logger();

  constructor(
    private readonly prisma: PrismaService,
    private readonly socketService: SocketGateway,
  ) {}

  async getSupportMessages(lastId: number, userId: string) {
    const supportMessages = await this.prisma.supportMessage.findMany({
      include: {
        User: {
          select: {
            id: true,
            userName: true,
            email: true,
            avatar: true,
          },
        },
      },
      where: {
        id: lastId
          ? {
              gt: lastId,
            }
          : { gt: 0 },
        userId: userId,
      },
      orderBy: { id: 'asc' },
    });

    return supportMessages;
  }

  async sendSupportMessageUser(user: User, data: SupportMessageUserDto) {
    this.logger.debug(`Handling massage from user: ${user.userName}...`);

    const supportMessage = await this.prisma.supportMessage.create({
      include: {
        User: {
          select: {
            id: true,
            userName: true,
            email: true,
            avatar: true,
          },
        },
      },
      data: {
        userId: user.id,
        message: data.message,
        filepaths: data.filepaths,
        filenames: data.filenames,
        replyId: data.replyId || null,
        isEdited: false,
        isDeleted: false,
      },
    });

    try {
      this.socketService.sendSupportMessageUser(user.id, {
        tempId: data.tempId,
        supportMessage,
      });

      this.logger.debug(`Handled massage from user: ${user.userName}`);
    } catch (error) {
      this.logger.error(
        `Failed to send support message for user: ${user.userName}`,
        error.stack,
      );
      throw new Error('Failed to send support message');
    }

    return supportMessage;
  }

  async sendSupportMessageAdmin(admin: User, data: SupportMessageAdminDto) {
    this.logger.debug(`Handling massage from admin: ${admin.userName}...`);

    const supportMessage = await this.prisma.supportMessage.create({
      include: {
        User: {
          select: {
            id: true,
            userName: true,
            email: true,
            avatar: true,
          },
        },
      },
      data: {
        userId: data.userId,
        supporterId: admin.id,
        message: data.message,
        filepaths: data.filepaths,
        filenames: data.filenames,
        replyId: data.replyId || null,
        isEdited: false,
        isDeleted: false,
      },
    });

    try {
      this.socketService.sendSupportMessageUser(data.userId, {
        tempId: data.tempId,
        supportMessage,
      });

      this.logger.debug(`Handled massage from admin: ${admin.userName}`);
    } catch (error) {
      this.logger.error(
        `Failed to send support message for admin: ${admin.userName}`,
        error.stack,
      );
      throw new Error('Failed to send support message');
    }

    return supportMessage;
  }

  async getUsersForSupport() {
    const connectedUsers = this.socketService.getConnectedUserIds();

    const users = await this.prisma.user.findMany({
      where: {
        role: {
          notIn: ['ADMIN', 'SUB_ADMIN', 'SUPER_ADMIN'],
        },
        supportingUser: true,
      },
      select: {
        id: true,
        userName: true,
        email: true,
        avatar: true,
        smSupporterCursor: true,
      },
    });

    const usersWithUnseenCount = await Promise.all(
      users.map(async (user) => {
        const unseenMessagesCount = await this.prisma.supportMessage.count({
          where: {
            userId: user.id,
            id: { gt: user.smSupporterCursor },
          },
        });
        return {
          ...user,
          unseenMessagesCount,
        };
      }),
    );

    const usersWithConnectionState = usersWithUnseenCount
      .map((user) => ({
        ...user,
        isConnected: connectedUsers.includes(user.id),
      }))
      .sort((a, b) => {
        if (b.unseenMessagesCount > 0 || a.unseenMessagesCount > 0) {
          return b.unseenMessagesCount - a.unseenMessagesCount;
        }
        return Number(b.isConnected) - Number(a.isConnected);
      });

    return usersWithConnectionState;
  }

  getConnectedUsers() {
    const connectedUserIds = this.socketService.getConnectedUserIds();
    return connectedUserIds;
  }

  async setSmAdminCursor(userId: string, cursor: number) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { smSupporterCursor: cursor },
      });
      return true;
    } catch (ex) {
      this.logger.error(ex);
      return false;
    }
  }

  async setSmUserCursor(userId: string, cursor: number) {
    try {
      await this.prisma.user.update({
        where: { id: userId },
        data: { smUserCursor: cursor },
      });
      return true;
    } catch (ex) {
      this.logger.error(ex);
      return false;
    }
  }
}