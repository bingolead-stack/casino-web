import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { Logger } from '@nestjs/common';
import { tBalance } from 'src/types/tBalance';
import {
  ChatMessage,
  PredictDepositType,
  SupportMessage,
  WithdrawRequest,
} from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@WebSocketGateway({ transports: ['websocket'] })
export class SocketGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  private readonly logger = new Logger(SocketGateway.name);

  constructor(private readonly prisma: PrismaService) {}

  @WebSocketServer() io: Server;

  socketMap: { [userId: string]: string[] } = {};
  adminSocketMap: { [adminId: string]: string[] } = {};

  async afterInit() {
    this.logger.debug('Initialized');
  }

  onModuleDestroy() {
    this.logger.debug('BackgroundService is being destroyed');
  }

  handleConnection(client: any, ...args: any[]) {
    const { sockets } = this.io.sockets;

    this.logger.debug(`Client id: ${client.id} connected`);
    this.logger.debug(`Number of connected clients: ${sockets.size}`);
  }

  handleDisconnect(client: any) {
    this.logger.debug(`Cliend id: ${client.id} disconnected`);

    try {
      for (const userId in this.socketMap) {
        const i = this.socketMap[userId].findIndex(
          (socketId) => socketId === client.id,
        );
        if (i !== -1) {
          this.socketMap[userId].splice(i, 1);
        }
      }

      for (const adminId in this.adminSocketMap) {
        const i = this.adminSocketMap[adminId].findIndex(
          (socketId) => socketId === client.id,
        );
        if (i !== -1) {
          this.adminSocketMap[adminId].splice(i, 1);
        }
      }
    } catch (ex) {
      this.logger.error(ex);
    }
  }

  @SubscribeMessage('user.id')
  async handleUserId(client: any, userId: string) {
    this.logger.debug(`User id from client id: ${client.id}, ${userId}`);

    const socketId = client.id;
    if (Array.isArray(this.socketMap[userId])) {
      if (!this.socketMap[userId].includes(socketId)) {
        this.socketMap[userId].push(socketId);
      }
    } else {
      this.socketMap[userId] = [socketId];
    }

    // const tokens = await this.prisma.tokenPrice.findMany({
    //   where: {
    //     chainId: {
    //       not: 0,
    //     },
    //   },
    // });

    // const predicts = tokens.map((t) => ({
    //   userId,
    //   createdAt: new Date(),
    //   type: PredictDepositType.socket_service,
    //   chainId: t.chainId,
    //   tokenAddress: t.tokenAddress,
    // }));

    // await this.prisma.predictDeposit.createMany({
    //   data: predicts,
    // });
  }

  @SubscribeMessage('admin.id')
  handleAdminId(client: any, adminId: any) {
    this.logger.debug(`Admin id from client id: ${client.id}, ${adminId}`);

    const socketId = client.id;
    if (Array.isArray(this.adminSocketMap[adminId])) {
      if (!this.adminSocketMap[adminId].includes(socketId)) {
        this.adminSocketMap[adminId].push(socketId);
      }
    } else {
      this.adminSocketMap[adminId] = [socketId];
    }
  }

  sendBalanceUpdated(userId: string, newBalance: tBalance) {
    const socketIds = this.socketMap[userId];
    if (!socketIds) {
      this.logger.debug(`no sockets userId: ${userId} newBalance: ${newBalance.cash}`);
      return;
    }

    try {
      for (let socketId of socketIds) {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          try {
            socket.emit('balance.updated', newBalance);
          } catch (ex) {}
        }
      }
    } catch (ex) {
      this.logger.debug('Exception in sendBalanceUpdated');
    }
  }

  sendWithdrawRequest(request: WithdrawRequest) {
    for (let adminId in this.adminSocketMap) {
      const socketIds = this.adminSocketMap[adminId];
      if (!socketIds) {
        this.logger.debug('no sockets');
        return;
      }

      try {
        for (let socketId of socketIds) {
          const socket = this.io.sockets.sockets.get(socketId);
          if (socket) {
            try {
              socket.emit('withdraw.requested', request);
            } catch (ex) {}
          }
        }
      } catch (ex) {
        this.logger.debug('Exception in sendWithdrawRequest');
      }
    }
  }

  getConnectedUserIds() {
    const res: string[] = [];
    for (const userId in this.socketMap) {
      if (this.socketMap[userId].length > 0) {
        res.push(userId);
      }
    }
    return res;
  }

  sendChatMessage(data: { tempId: number; message: ChatMessage }) {
    this.io.sockets.emit('received.chat', data);
  }

  sendSupportMessageUser(
    userId: string,
    data: {
      tempId: number;
      supportMessage: SupportMessage;
    },
  ) {
    const socketIds = this.socketMap[userId];
    if (!socketIds) {
      this.logger.debug('no sockets');
    } else {
      for (let socketId of socketIds) {
        const socket = this.io.sockets.sockets.get(socketId);
        if (socket) {
          try {
            socket.emit('received.support', data);
          } catch (ex) {
            this.logger.error(ex);
          }
        }
      }
    }

    try {
      for (let adminId in this.adminSocketMap) {
        const adminSocketIds = this.adminSocketMap[adminId];
        for (let adminSocketId of adminSocketIds) {
          const adminSocket = this.io.sockets.sockets.get(adminSocketId);
          if (adminSocket) {
            try {
              adminSocket.emit('received.support', data);
            } catch (ex) {
              this.logger.error(ex);
            }
          }
        }
      }
    } catch (ex) {
      this.logger.debug('Exception in sendSupportMessageUser');
    }
  }
}
