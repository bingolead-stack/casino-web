import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { SocketGateway } from 'src/socket/socket.gateway';

@Injectable()
export class PrizeService {
  private readonly logger = new Logger(PrizeService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly socketService: SocketGateway,
  ) {}

  async getLeaderboard() {
    const prize = await this.prisma.prize.findFirst({
      orderBy: {
        startedAt: 'desc',
      },
    });

    const users = await this.prisma.prizeUser.findMany({
      include: {
        User: {
          select: {
            userName: true,
            email: true,
            cash: true,
            avatar: true,
          },
        },
      },
      where: {
        prizeId: prize.id,
      },
      orderBy: {
        wagered: 'desc',
      },
    });

    return {
      prize,
      users,
    };
  }
}
