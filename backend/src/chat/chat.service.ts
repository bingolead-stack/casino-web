import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';
import { User } from '@prisma/client';
import { SendMessageDto } from './dto/SendMessageDto';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly socketService: SocketGateway,
  ) {}

  async sendMessage(user: User, data: SendMessageDto) {
    this.logger.debug('send');

    const message = await this.prisma.chatMessage.create({
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
        senderId: user.id,
        message: data.message,
        filepaths: data.filepaths,
        filenames: data.filenames,
        replyId: data.replyId || null,
        isEdited: false,
        isDeleted: false,
        mentionedUserIds: [],
      },
    });

    this.socketService.sendChatMessage({ tempId: data.tempId, message });
    return message;
  }

  async getHistory(lastId: number) {
    const messages = await this.prisma.chatMessage.findMany({
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
              lt: lastId,
            }
          : { gt: 0 },
      },
      orderBy: { id: 'desc' },
      take: 20,
    });

    return messages.sort((a, b) => (a.id < b.id ? -1 : 1));
  }

  getConnectedUsers() {
    const connectedUserIds = this.socketService.getConnectedUserIds();
    return connectedUserIds;
  }
}
